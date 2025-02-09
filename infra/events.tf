resource "aws_cloudwatch_event_rule" "fetch_grocery_prices" {
  name                = "fetch_grocery_prices"
  description         = "Fetch grocery prices every Wednesday"
  schedule_expression = "cron(0 8 ? * 4 *)"
}

resource "aws_cloudwatch_event_target" "fetch_grocery_prices_target" {
  rule = aws_cloudwatch_event_rule.fetch_grocery_prices.name
  arn  = module.lambdas.search_grocery_prices_arn
}

resource "aws_lambda_permission" "cloudwatch_events_invoke" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = module.lambdas.search_grocery_prices_function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.fetch_grocery_prices.arn
}
