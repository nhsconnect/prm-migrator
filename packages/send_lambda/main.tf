module "package" {
  source = "../modules/package_lambda"

  name = "send"
}

locals {
  function_name = "ehr-extract-send-${var.environment}"
}

resource "aws_lambda_function" "lambda" {
  filename         = "${module.package.zip}"
  function_name    = "${local.function_name}"
  handler          = "main.handler"
  role             = "${aws_iam_role.lambda.arn}"
  description      = "EHR extract send API handler for ${var.environment}"
  memory_size      = 128
  timeout          = 20
  runtime          = "nodejs8.10"
  source_code_hash = "${module.package.hash}"

  environment {
    variables {
      TABLE_NAME = "PROCESS_STORAGE_${upper(var.environment)}"
    }
  }

  tags {
    Name          = "ehr-extract-send-${var.environment}"
    Enviroronment = "prm-${var.environment}"
    Component     = "ehr-extract"
  }
}

data "aws_iam_policy_document" "lambda_assume" {
    statement {
        effect = "Allow"
        actions = ["sts:AssumeRole"]
        principals {
            type = "Service"
            identifiers = ["lambda.amazonaws.com"]
        }        
    }
}

resource "aws_iam_role" "lambda" {
  name = "ehr-extract-send-${var.environment}"

  assume_role_policy = "${data.aws_iam_policy_document.lambda_assume.json}"
}

data "aws_iam_policy_document" "lambda_policy" {
  statement {
    effect = "Allow"
    actions = [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"    
    ]
    resources = ["*"]
  }

  statement {
    effect = "Allow"
    actions = [
      "dynamodb:*"
    ]
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "lambda" {
  name = "ehr-extract-send-${var.environment}"
  role = "${aws_iam_role.lambda.id}"

  policy = "${data.aws_iam_policy_document.lambda_policy.json}"
}

