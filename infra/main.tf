terraform {
  required_version = "~> 1.8.2"

  cloud {
    organization = "daniel-personal-lab"
    workspaces {
      name = "grocery-prices"
    }
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

module "lambdas" {
  source = "./lambdas"

  grocery_prices_image = var.grocery_prices_image
  execution_role_arn   = aws_iam_role.grocery_lambda_execution_role.arn
}
