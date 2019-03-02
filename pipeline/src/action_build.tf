resource "aws_codebuild_project" "build" {
  name        = "prm-apigw-build-${var.environment}"
  description = "Build the APIGW Lambdas"

  source {
    type      = "CODEPIPELINE"
    buildspec = "./pipeline/src/action_build.yml"
  }

  artifacts {
    type = "CODEPIPELINE"
  }

  service_role = "${var.iam_role}"

  environment {
    compute_type = "BUILD_GENERAL1_SMALL"
    image        = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/codebuild/node:latest"
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
