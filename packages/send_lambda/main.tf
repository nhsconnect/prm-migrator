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

data "aws_caller_identity" "current" {}

resource "aws_lambda_permission" "allow_invoke_from_api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = "${local.function_name}"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.aws_region}:${data.aws_caller_identity.current.account_id}:${data.aws_api_gateway_rest_api.api_gw_api.id}/*/POST${data.aws_api_gateway_resource.api_gw_resource.path}"
}

data "aws_api_gateway_rest_api" "api_gw_api" {
  name = "ehr-extract-${var.environment}"
}

data "aws_api_gateway_resource" "api_gw_resource" {
  rest_api_id = "${data.aws_api_gateway_rest_api.api_gw_api.id}"
  path = "/send"
}

resource "aws_api_gateway_integration" "api_gw_integration" {
  rest_api_id = "${data.aws_api_gateway_rest_api.api_gw_api.id}"
  resource_id = "${data.aws_api_gateway_resource.api_gw_resource.id}"
  http_method = "POST"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${aws_lambda_function.lambda.invoke_arn}"
}