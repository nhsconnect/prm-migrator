resource "aws_codebuild_project" "deploy" {
  name        = "prm-apigw-deploy-${var.environment}"
  description = "Deploy the APIGW Lambdas"

  source {
    type      = "CODEPIPELINE"
    buildspec = "./pipeline/src/allinone/action_deploy.yml"
  }

  artifacts {
    type = "CODEPIPELINE"
  }

  service_role = "${var.iam_role}"

  environment {
    compute_type = "BUILD_GENERAL1_SMALL"
    image        = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/codebuild/terraform:latest"
    type         = "LINUX_CONTAINER"

    environment_variable {
      name  = "ENVIRONMENT"
    #   value = "${var.environment}"
      value = "dev"
    }
  }

  tags {
    Environment = "${var.environment}"
  }
}
