import fetchJsonp from 'fetch-jsonp'

const SPOT_PRICE_URL = '/.netlify/functions/spot-pricing'

type SpotPriceInfoResponse = {
  config: {
    regions: [{
      region: string,
      instanceTypes: [{
        type: string,
        sizes: [{
          size: string,
          valueColumns: [{
            name: string,
            prices: {
              "USD": string
            }
          }]
        }]
      }]
    }]
  }
}

export type PriceInfo = {
  region: string,
  type: string,
  size: string,
  os: string,
  price: string,
}

export async function loadData(): Promise<PriceInfo[]> {
  const data: SpotPriceInfoResponse = await (await fetch(SPOT_PRICE_URL)).json();
  const pricingData: PriceInfo[] = [];
  data.config.regions.forEach((region) =>
    region.instanceTypes.forEach((instanceType) =>
      instanceType.sizes.forEach((size) =>
        size.valueColumns.filter(sku => !sku.prices.USD.startsWith("N/A")).forEach(sku =>
          pricingData.push({
            region: region.region,
            type: instanceType.type,
            size: size.size,
            os: sku.name,
            price: sku.prices.USD,
          })
        )
      )
    )
  );

  return pricingData;
}
