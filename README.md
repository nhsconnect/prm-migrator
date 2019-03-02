# API Gateway Lambdas

This repository contains the code required to deploy the PRM translator lambdas that depend on the API Gateway.

## Pre-requisites

The following programs should be installed and available on the path:

* [nodejs 8.x](https://nodejs.org/en/)
* [npm](https://www.npmjs.com/)
* [go 1.10+](https://golang.org/)
* [dep](https://github.com/golang/dep)
* [terraform](https://www.terraform.io/)
* [terragrunt](https://github.com/gruntwork-io/terragrunt)
* [aws cli](https://aws.amazon.com/cli/)
* [jq](https://stedolan.github.io/jq/)
* [make](https://www.gnu.org/software/make/)
* zip

## Usage

**Deploy an environment**

In the root of the project: `make deploy-<env>`, where _<env>_ is the name of the environment. e.g. `make deploy-dev`

**Working on a Lambda**

Set your working directory to the directory containing the lambda source, e.g. send_lambda

|Command            |Effect|
|-------            |------|
|`make build`       |Package the lambda as a zip|
|`make test`        |Run the unit tests|
|`make funtest`     |Run the functional tests|
|`make deploy-<env>`|Deploy the lambda to the specified environment|

## Structure

The source code uses the following structure:

```
├── deploy
|   ├── <env-name>-<account-id>         Environment specific terragrunt setup
|   |   ├── apigw_deploy
|   |   |   ├── Makefile                Makefile for deploying component
|   |   |   └── terraform.tfvars        Terragrunt configuration for component
|   |   ├── apigw_setup
|   |   |   ├── Makefile
|   |   |   └── terraform.tfvars
|   |   ├── retrieve_lambda
|   |   |   ├── Makefile
|   |   |   └── terraform.tfvars
|   |   ├── send_lambda
|   |   |   ├── Makefile
|   |   |   └── terraform.tfvars
|   |   ├── status_lambda
|   |   |   ├── Makefile
|   |   |   └── terraform.tfvars
|   |   └── Makefile                    Makefile for deploying a whole environment
|   ├── src                             Terraform code to deploy components
|   |   ├── account_setup
|   |   |   └── *.tf
|   |   ├── apigw_deploy
|   |   |   └── *.tf
|   |   ├── apigw_setup
|   |   |   └── *.tf
|   |   ├── modules
|   |   |   ├── apigw_deploy
|   |   |   |   └── *.tf
|   |   |   └── apigw_setup
|   |   |       └── *.tf
|   |   ├── retrieve_lambda
|   |   |   └── *.tf
|   |   ├── send_lambda
|   |   |   └── *.tf
|   |   └── status_lambda
|   |       └── *.tf
|   └── test                            Functional tests (deploy and test components)
|       ├── apigw_setup
|       |   ├── post_setup              Terraform code used to create dependent resources
|       |   |   └── *.tf
|       |   ├── *.go                    Test application
|       |   ├── Gopkg.lock              Dep locked dependencies
|       |   └── Gopkg.toml              Dep dependencies
|       ├── retrieve_lambda
|       |   ├── post_setup
|       |   |   └── *.tf
|       |   ├── pre_setup
|       |   |   └── *.tf
|       |   ├── *.go
|       |   ├── Gopkg.lock
|       |   └── Gopkg.toml
|       ├── send_lambda
|       |   ├── post_setup
|       |   |   └── *.tf
|       |   ├── pre_setup
|       |   |   └── *.tf
|       |   ├── *.go
|       |   ├── Gopkg.lock
|       |   └── Gopkg.toml
|       └── status_lambda
|           ├── post_setup
|           |   └── *.tf
|           ├── pre_setup
|           |   └── *.tf
|           ├── *.go
|           ├── Gopkg.lock
|           └── Gopkg.toml
├── send_lambda                         Lambda code
|       |   └── Gopkg.toml
|       ├── *.js                        Javascript code for lambda and unit tests
|       ├── package.json                NPM dependencies
|       ├── package-lock.json           NPM locked dependencies
|       └── Makefile                    Makefile for use when developing lambda
├── status_lambda
|       ├── *.js
|       ├── package.json
|       ├── package-lock.json
|       └── Makefile
├── retrieve_lambda
|       ├── *.js
|       ├── package.json
|       ├── package-lock.json
|       └── Makefile
└── Makefile                            Makefile for building and deploying the whole system
```
