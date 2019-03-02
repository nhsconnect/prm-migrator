terragrunt = {
  terraform {
    source = "../src//"
  }

  remote_state {
    backend = "s3"
    config {
      bucket = "prm-431593652018-terraform-states"
      key = "testing/pipeline/terraform.tfstate"
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
iam_role = "arn:aws:iam::431593652018:role/codebuild"
github_token_name = "/NHS/dev-431593652018/tf/codepipeline/github-token"