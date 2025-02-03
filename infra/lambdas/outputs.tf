output "search_grocery_prices_function_name" {
  value = aws_lambda_function.search_grocery_prices.function_name
}

output "search_grocery_prices_arn" {
  value = aws_lambda_function.search_grocery_prices.arn
}

output "save_price_lambda" {
  value = aws_lambda_function.save_price
}
