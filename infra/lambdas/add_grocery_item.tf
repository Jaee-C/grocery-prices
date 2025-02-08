resource "aws_lambda_function" "add_grocery_item" {
  function_name = "add_grocery_item"
  role          = var.execution_role_arn
  image_uri     = var.grocery_prices_image
  package_type  = "Image"
  memory_size   = 3000

  image_config {
    command = ["grocery_prices.handlers.add_grocery_item.lambda_handler"]
  }
}
