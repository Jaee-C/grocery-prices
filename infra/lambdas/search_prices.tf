resource "aws_lambda_function" "search_grocery_prices" {
  function_name = "search_grocery_prices"
  role          = var.execution_role_arn
  image_uri     = var.grocery_prices_image
  package_type  = "Image"
  runtime       = "python3.13"

  image_config {
    command = ["grocery_prices.handlers.save_price.lambda_handler"]
  }
}
