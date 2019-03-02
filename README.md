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
├── deploy                              Terragrunt setup for deploying components
|   ├── <env-name>-<account-id>         Environment specific terragrunt setup
|   |   ├── <component>
|   |   |   ├── Makefile                Makefile for deploying individual component
|   |   |   └── terraform.tfvars        Terragrunt configuration for component
|   |   └── Makefile                    Makefile for deploying a whole environment
|   ├── src                             Terraform code to deploy components
|   |   └── <component>
|   |       └── *.tf
|   └── test                            Terraform tests (deploy and test components)
|       └── <package>
|           ├── pre_setup               Terraform code used to create dependent resources
|           |   └── *.tf
|           ├── post_setup              Terraform code used to create dependent resources
|           |   └── *.tf
|           ├── *.go                    Test application
|           ├── Gopkg.lock              Dep locked dependencies
|           └── Gopkg.toml              Dep dependencies
├── lambda                              Lambda code
|   └── <lambda>
|       ├── *.js                        Javascript code for lambda and unit tests
|       ├── package.json                NPM dependencies
|       ├── package-lock.json           NPM locked dependencies
|       └── Makefile                    Makefile for use when developing lambda
├── pipeline                            Terragrunt setup for deploying pipeline
|   ├── <env-name>-<account-id>         Environment specific terragrunt setup
|   |   └── terraform.tfvars            Terragrunt configuration
|   └── src                             Terraform code to build pipeline
|       ├── *.yml                       CodeBuild buildspec files
|       └── *.tf                        Terraform code
└── Makefile                            Makefile for building and deploying the whole system
```
