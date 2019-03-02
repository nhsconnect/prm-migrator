terragrunt = {
  terraform {
    source = "../../src//apigw_deploy"
  }

  dependencies {
    paths = ["../apigw_setup", "../send_lambda"]
  }

  remote_state {
    backend = "s3"
    config {
      bucket = "prm-431593652018-terraform-states"
      key = "testing/apigw_deploy/terraform.tfstate"
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
