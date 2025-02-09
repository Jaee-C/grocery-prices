output "save_price_lambda_name" {
  value = aws_lambda_function.save_price.function_name
}

output "save_price_lambda_arn" {
  value = aws_lambda_function.save_price.arn
}
