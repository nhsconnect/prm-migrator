terragrunt = {
  terraform {
    source = "../../../packages//extract_ehr_api"
  }

  iam_role = "arn:aws:iam::431593652018:role/PASTASLOTHVULGAR"

  dependencies {
    paths = []
  }


  remote_state {
    backend = "s3"
    config {
      bucket = "prm-431593652018-terraform-states"
      key = "dale/extract_ehr_api/terraform.tfstate"
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
environment = "dale"
