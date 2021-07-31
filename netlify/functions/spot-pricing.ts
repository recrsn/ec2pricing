import { Handler } from "@netlify/functions";
import fetch, { Headers } from 'cross-fetch';

const SPOT_PRICE_URL = 'https://spot-price.s3.amazonaws.com/spot.js'

const handler: Handler = async (event, context) => {

  const requestHeaders = {}

  const {
    'if-modified-since': ifModifiedSince,
    'if-none-match': ifNoneMatch,
    'cache-control': cacheControl
  } = event.headers;

  if (ifModifiedSince) {
    requestHeaders['If-Modified-Since'] = ifModifiedSince
  }

  if (ifNoneMatch) {
    requestHeaders['If-None-Match'] = ifNoneMatch
  }

  if (cacheControl) {
    requestHeaders['Cache-Control'] = cacheControl
  }

  const response = await fetch(SPOT_PRICE_URL, {
    method: 'GET',
    headers: requestHeaders
  })

  if (response.status === 304) {
    return {
      statusCode: 304,
      headers: {
        'Date': response.headers.get('Date'),
        'ETag': response.headers.get('ETag'),
        'Last-Modified': response.headers.get('Last-Modified'),
      },
      body: ''
    }
  }

  const data = (await response.text()).slice(9, -2);

  return {
    statusCode: 200,
    headers: {
      'Content-Length': data.length,
      'Date': response.headers.get('Date'),
      'ETag': response.headers.get('ETag'),
      'Last-Modified': response.headers.get('Last-Modified'),
      'Content-Type': 'application/json'
    },
    body: data,
  };
};

export { handler };
