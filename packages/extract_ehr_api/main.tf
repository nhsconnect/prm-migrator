resource "aws_api_gateway_rest_api" "api_gw_endpoint" {
  name        = "ehr-extract-${var.environment}"
  description = "API to allow EHR summary records to be translated from v2.2 to 3.0"
}

resource "aws_api_gateway_deployment" "api_gw_deployment" {
  depends_on = [
    "aws_api_gateway_integration.send_post_method_mock_integration", 
    "aws_api_gateway_integration.status_uuid_get_method_mock_integration",
    "aws_api_gateway_integration.retrieve_uuid_get_method_mock_integration"
  ]

  rest_api_id = "${aws_api_gateway_rest_api.api_gw_endpoint.id}"
  stage_name = "${var.environment}"
}

data "aws_iam_policy_document" "apigateway_assume" {
    statement {
        effect = "Allow"
        actions = ["sts:AssumeRole"]
        principals {
            type = "Service"
            identifiers = ["apigateway.amazonaws.com"]
        }        
    }
}

resource "aws_iam_role" "api_gw_role" {
  name               = "api-gw-ehr-extract-${var.environment}"
  assume_role_policy = "${data.aws_iam_policy_document.apigateway_assume.json}"
}

data "aws_iam_policy_document" "apigateway_policy" {
  statement {
      effect = "Allow"
      actions = [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:DescribeLogGroups",
        "logs:DescribeLogStreams",
        "logs:PutLogEvents",
        "logs:GetLogEvents",
        "logs:FilterLogEvents"
      ]
      resources = ["*"]
  }
}

resource "aws_iam_role_policy" "api_gw_role_policy" {
    role = "${aws_iam_role.api_gw_role.id}"
    policy = "${data.aws_iam_policy_document.apigateway_policy.json}"
}

resource "aws_api_gateway_account" "api_gw_account" {
  cloudwatch_role_arn = "${aws_iam_role.api_gw_role.arn}"
}

## Send

resource "aws_api_gateway_resource" "send_resource" {
  rest_api_id = "${aws_api_gateway_rest_api.api_gw_endpoint.id}"
  parent_id   = "${aws_api_gateway_rest_api.api_gw_endpoint.root_resource_id}"
  path_part   = "send"
}

resource "aws_api_gateway_method" "send_post_method" {
  rest_api_id   = "${aws_api_gateway_rest_api.api_gw_endpoint.id}"
  resource_id   = "${aws_api_gateway_resource.send_resource.id}"
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "send_post_method_mock_integration" {
  rest_api_id = "${aws_api_gateway_rest_api.api_gw_endpoint.id}"
  resource_id = "${aws_api_gateway_resource.send_resource.id}"
  http_method = "${aws_api_gateway_method.send_post_method.http_method}"
  type        = "MOCK"
}

## Status

resource "aws_api_gateway_resource" "status_resource" {
    rest_api_id = "${aws_api_gateway_rest_api.api_gw_endpoint.id}"
    parent_id = "${aws_api_gateway_rest_api.api_gw_endpoint.root_resource_id}"
    path_part = "status"
}

resource "aws_api_gateway_resource" "status_uuid_resource" {
    rest_api_id = "${aws_api_gateway_rest_api.api_gw_endpoint.id}"
    parent_id = "${aws_api_gateway_resource.status_resource.id}"
    path_part = "{uuid}"
}

resource "aws_api_gateway_method" "status_uuid_get_method" {
  rest_api_id = "${aws_api_gateway_rest_api.api_gw_endpoint.id}"
  resource_id = "${aws_api_gateway_resource.status_uuid_resource.id}"
  http_method = "GET"
  authorization = "NONE"

  request_parameters {
    "method.request.path.uuid" = true
  }
}

resource "aws_api_gateway_integration" "status_uuid_get_method_mock_integration" {
  rest_api_id = "${aws_api_gateway_rest_api.api_gw_endpoint.id}"
  resource_id = "${aws_api_gateway_resource.status_uuid_resource.id}"
  http_method = "${aws_api_gateway_method.status_uuid_get_method.http_method}"
  type        = "MOCK"
}

## Retrieve

resource "aws_api_gateway_resource" "retrieve_resource" {
    rest_api_id = "${aws_api_gateway_rest_api.api_gw_endpoint.id}"
    parent_id = "${aws_api_gateway_rest_api.api_gw_endpoint.root_resource_id}"
    path_part = "retrieve"
}

resource "aws_api_gateway_resource" "retrieve_uuid_resource" {
    rest_api_id = "${aws_api_gateway_rest_api.api_gw_endpoint.id}"
    parent_id = "${aws_api_gateway_resource.retrieve_resource.id}"
    path_part = "{uuid}"
}

resource "aws_api_gateway_method" "retrieve_uuid_post_method" {
    rest_api_id = "${aws_api_gateway_rest_api.api_gw_endpoint.id}"
    resource_id = "${aws_api_gateway_resource.retrieve_uuid_resource.id}"
    http_method = "POST"
    authorization = "NONE"

  request_parameters {
    "method.request.path.uuid" = true
  }
}

resource "aws_api_gateway_integration" "retrieve_uuid_get_method_mock_integration" {
  rest_api_id = "${aws_api_gateway_rest_api.api_gw_endpoint.id}"
  resource_id = "${aws_api_gateway_resource.retrieve_uuid_resource.id}"
  http_method = "${aws_api_gateway_method.retrieve_uuid_post_method.http_method}"
  type        = "MOCK"
}
