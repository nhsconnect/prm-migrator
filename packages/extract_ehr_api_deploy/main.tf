data "aws_api_gateway_rest_api" "api_gw_endpoint" {
  name        = "ehr-extract-${var.environment}"
}

resource "aws_api_gateway_deployment" "api_gw_deployment" {
  rest_api_id = "${data.aws_api_gateway_rest_api.api_gw_endpoint.id}"
  stage_name = "${var.environment}"
}
