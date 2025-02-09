resource "aws_lambda_function" "remove_grocery_item" {
  function_name    = "remove_grocery_item"
  role             = var.execution_role_arn
  package_type     = "Zip"
  source_code_hash = filebase64sha256("../grocery_prices.zip")
  filename         = "../grocery_prices.zip"
  handler          = "grocery_prices/handlers/remove_grocery_item.lambda_handler"
  runtime          = "python3.13"
  memory_size      = 128
}
