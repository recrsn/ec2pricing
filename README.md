# EC2 Pricing Info

Shows an easy-to-view and compare prices of Amazon Web Services EC2 instances across various AWS regions.

## Setting up for development

### Pre-requisites

 - [NodeJS](https://nodejs.org)

This project uses [npm](https://www.npmjs.com/) and [bower](https://bower.io/) for dependency management
and [gulp](https://gulpjs.com) as the task-runner. 

To install all dependencies:

````
npm install && bower install
```` 

### Running in dev mode

````
gulp serve
````

## Deploying a prod build

````
gulp build
````

This will generated a optimized build inside `dist` directory. You can deploy the contents of this directory to a static
web host.

## Roadmap

### Features

  - [x] Show pricing info for spot instances.
  - [ ] Leverage the new AWS Pricing API to show prices for on-demand instances.
  - [ ] Currency conversion.
  - [ ] Show a graph depicting trends in spot pricing.

### Development
  - [ ] Use webpack.
  - [ ] Use npm instead of bower.
  - [ ] A better frontend.

## License

MIT License

Copyright (c) 2017 Amitosh Swain Mahapatra

See detailed terms in [LICENSE](LICENSE)
