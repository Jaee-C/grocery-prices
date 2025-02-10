resource "aws_lambda_function" "search_grocery_prices" {
  function_name    = "search_grocery_prices"
  role             = var.execution_role_arn
  package_type     = "Zip"
  source_code_hash = filebase64sha256("../grocery_prices.zip")
  filename         = "../grocery_prices.zip"
  handler          = "grocery_prices/${var.handler_prefix}/search.lambda_handler"
  runtime          = "python3.13"
  memory_size      = 1000
  architectures    = ["x86_64"]
}
