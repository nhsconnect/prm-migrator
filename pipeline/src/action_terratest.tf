resource "aws_codebuild_project" "terratest" {
  name        = "prm-apigw-terratest-${var.environment}"
  description = "Test the APIGW Lambdas Deploys"

  source {
    type      = "CODEPIPELINE"
    buildspec = "./pipeline/src/action_terratest.yml"
  }

  artifacts {
    type = "CODEPIPELINE"
  }

  service_role = "${var.iam_role}"

  environment {
    compute_type = "BUILD_GENERAL1_SMALL"
    image        = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/codebuild/terratest:latest"
    type         = "LINUX_CONTAINER"

    environment_variable {
      name  = "ENVIRONMENT"
      value = "${var.environment}"
    }
  }

  tags {
    Environment = "${var.environment}"
  }
}
