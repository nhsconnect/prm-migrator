# PRM-Migrator

Overview of problem / solution.

## Pre-requisites
- node v8.10.0 (or above)

## Walking skeleton overview
This solution is a walking skeleton to explore the problem of a patient record being migrated from one practice to another.

- It starts with an EHR extract being uploaded to the solution
- We store the extract as JSON payload in a database (DynamoDB)
  - The database is shared across the lambdas for simplicity
- The payload is validated with data retrieved from PDS
  - In this instance, it's just a very basic check to prove the concept of calling PDS via OpenTest
- At any point after the extract is uploaded and stored as the payload, its translation status can be checked by calling the `status` endpoint
- Once the stored payload has been fully translated, its status will be updated to reflect that, and it can be retrieved by calling the `retrieve` endpoint

![Solution overview](https://github.com/nhsconnect/prm-migrator/images/prm_migrator_overview.png "Solution overview")

For further information on the solution, please see the [Core Infrastructure](https://gpitbjss.atlassian.net/wiki/spaces/TW/pages/1407385703/Core+Infrastructure) section in **Confluence**.

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

The build pipelines for the lambdas are defined in the **pipelines** directory, however they are deployed by the [PRM-Infra](https://github.com/nhsconnect/prm-infra) solution. All of the AWS dependencies, such as the API gateway and DynamoDB are deployed and configured by the the **prm-infra** solution as well.