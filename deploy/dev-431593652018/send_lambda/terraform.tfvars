terragrunt = {
  terraform {
    source = "../../src//send_lambda"
  }

  dependencies {
    paths = ["../apigw_setup"]
  }

  remote_state {
    backend = "s3"
    config {
      bucket = "prm-431593652018-terraform-states"
      key = "testing/send_lambda/terraform.tfstate"
      region = "eu-west-2"
      encrypt = true
    }
  }
}

# ---------------------------------------------------------------------------------------------------------------------
# MODULE PARAMETERS
# These are the variables we have to pass in to use the module specified in the terragrunt configuration above
# ---------------------------------------------------------------------------------------------------------------------

aws_region = "eu-west-2"
environment = "testingdev"

# Path has 5 extra .. components in as Terragrunt copies the modules into a cache in several sub-directories of this directory
lambda_zip = "../../../../../../../lambda/send/lambda.zip"
