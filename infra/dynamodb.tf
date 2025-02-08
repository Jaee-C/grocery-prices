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

  attribute {
    name = "product_type"
    type = "S"
  }

  attribute {
    name = "price"
    type = "N"
  }

  server_side_encryption {
    enabled = true
  }

  global_secondary_index {
    name               = "product_type_index"
    hash_key           = "product_type"
    range_key          = "date"
    projection_type    = "INCLUDE"
    write_capacity     = 5
    read_capacity      = 5
    non_key_attributes = ["price"]
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
