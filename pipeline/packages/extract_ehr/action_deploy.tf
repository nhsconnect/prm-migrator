# Setup permissions for action

resource "aws_iam_role" "deploy_role" {
  name               = "extract-ehr-pipeline-deploy-${var.environment}"
  assume_role_policy = "${data.aws_iam_policy_document.codebuild_assume.json}"
}

data "aws_iam_policy_document" "deploy_role_policy" {
  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    resources = [
      "*",
    ]
  }

  statement {
    effect = "Allow"

    actions = [
      "s3:GetObject",
    ]

    resources = ["${aws_s3_bucket.artifacts.arn}/*"]
  }

  statement {
    effect    = "Allow"
    actions   = ["sts:AssumeRole"]
    resources = ["${var.iam_role}"]
  }
}

resource "aws_iam_role_policy" "deploy_role_policy" {
  name   = "extract-ehr-pipeline-deploy"
  role   = "${aws_iam_role.deploy_role.id}"
  policy = "${data.aws_iam_policy_document.deploy_role_policy.json}"
}

# Create the CodeBuild project for the action

resource "aws_codebuild_project" "deploy" {
  name        = "prm-extract-ehr-deploy-${var.environment}"
  description = "Deploy the EHR extract application"

  source {
    type      = "CODEPIPELINE"
    buildspec = "./pipeline/packages/extract_ehr/spec/deploy.yml"
  }

  artifacts {
    type = "CODEPIPELINE"
  }

  service_role = "${aws_iam_role.deploy_role.arn}"

  environment {
    compute_type = "BUILD_GENERAL1_SMALL"
    image        = "431593652018.dkr.ecr.eu-west-2.amazonaws.com/codebuild/terraform:0.2.0"
    type         = "LINUX_CONTAINER"

    environment_variable {
      name  = "ENVIRONMENT"
      value = "${var.environment}"
    }

    environment_variable {
      name  = "ACCOUNT_ID"
      value = "${data.aws_caller_identity.current.account_id}"
    }
  }

  tags {
    Environment = "prm-${var.environment}"
    Component   = "pipeline"
  }
}
