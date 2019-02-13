output "apigw_endpoint_public" {
  value = "https://${aws_api_gateway_rest_api.api_gw_endpoint.id}.execute-api.${var.aws_region}.amazonaws.com/${var.environment}"
}
