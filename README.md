# PRM-Migrator

Overview of problem / solution.

## Pre-requisites
- node v8.10.0 (or above)

## Solution structure
*todo*

### Lambdas
Each of the lambdas are independent of one another, so they can be packaged / deployed independently. As such, they each have their own `node_modules` and `packages.json`.

#### How to build the lambdas
From a command prompt, `cd` into the root directory of the lambda you want to build, then install its node packages with:

`npm i`

#### Running the tests

Run the tests with `npm t`

### End to end tests

**Please note:** The end to end tests are for testing the deployed code, hosted in AWS, rather than any local changes you may want to test.

The end to end tests are **Postman** tests, and so we use **Newman** to run them from command line.

From a command prompt, `cd` into the **e2e** directory, then install its node packages with:

`npm i`

Run the tests by passing the postman collection to newman, along with the relevant environment variables collection:

*i.e.*
`newman run postman-collections/PRM.postman_collection.json --environment postman-collections/PRM-dev-327778747031.postman_environment.json --delay-request 200`

#### Postman

You can also run the tests from Postman directly, by importing them. You'll find the tests and their environment variable collection in the **postman-collections** directory.

### Pipelines

The build pipelines for the lambdas are defined in the **pipelines** directory, however they are deployed by the [PRM-Infra](https://github.com/nhsconnect/prm-infra) solution.