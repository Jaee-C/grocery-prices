resource "aws_dynamodb_table" "grocery_prices" {
  name           = "grocery_prices"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "code-merchant"
  range_key      = "date"

  attribute {
    name = "code-merchant"
    type = "S"
  }

  attribute {
    name = "date"
    type = "S"
  }

  server_side_encryption {
    enabled = true
  }
}

resource "aws_dynamodb_table" "grocery_items" {
  name           = "grocery_items"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "code"
  range_key      = "merchant"

  attribute {
    name = "code"
    type = "S"
  }

  attribute {
    name = "merchant"
    type = "S"
  }

  server_side_encryption {
    enabled = true
  }
}
