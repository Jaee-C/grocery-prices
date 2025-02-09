terraform {
  required_version = "~> 1.10"

  backend "s3" {
    bucket       = "daniel-chin-terraform-state"
    key          = "grocery_prices/terraform.tfstate"
    region       = "us-east-1"
    use_lockfile = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

module "lambdas" {
  source = "./lambdas"

  execution_role_arn = aws_iam_role.grocery_lambda_execution_role.arn
}
