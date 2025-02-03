data "aws_iam_policy_document" "lambda_execution_policy" {
  statement {
    sid = "KmsAccess"
    actions = [
      "kms:Decrypt",
      "kms:GenerateDataKey"
    ]
    resources = ["*"]
  }
}

data "aws_iam_policy_document" "lambda_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "grocery_lambda_execution_role" {
  name               = "grocery_lambda_execution_role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role_policy.json
}

resource "aws_iam_policy" "execution_policy" {
  name = "grocery_lambda_execution_policy"
  policy = data.aws_iam_policy_document.lambda_execution_policy.json
}

resource "aws_iam_role_policy_attachment" "grocery_lambda_execution_policy_attachment" {
  role       = aws_iam_role.grocery_lambda_execution_role.name
  policy_arn = aws_iam_policy.execution_policy.arn
}

data "aws_iam_policy_document" "lambda_invoke_policy" {
  statement {
    sid    = "InvokeLambda"
    effect = "Allow"
    actions = [
      "lambda:InvokeFunction"
    ]
    resources = [module.lambdas.search_grocery_prices_arn]
  }
}

data "aws_iam_policy_document" "lambda_invoke_trust_policy" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    effect  = "Allow"
    principals {
      type        = "Federated"
      identifiers = ["arn:aws:iam::340752823750:oidc-provider/oidc.vercel.com/huffsteacup0picloudcoms-projects"]
    }
    condition {
      test     = "StringEquals"
      variable = "oidc.vercel.com/huffsteacup0picloudcoms-projects:aud"
      values   = ["https://vercel.com/huffsteacup0picloudcoms-projects"]
    }

    condition {
      test     = "StringEquals"
      variable = "oidc.vercel.com/huffsteacup0picloudcoms-projects:sub"
      values = [
        "owner:[TEAM SLUG]:project:*:environment:preview",
        "owner:[TEAM SLUG]:project:*:environment:production"
      ]
    }
  }
}
