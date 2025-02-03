resource "aws_ecrpublic_repository" "grocery_prices" {
  repository_name = "grocery-prices"

  catalog_data {
    about_text        = "Lambda functions to search grocery prices"
    architectures     = ["x86-64"]
    description       = "Lambda functions to search grocery prices"
    operating_systems = ["Linux"]
    usage_text        = "Should not be used by anyone, no idea if it actually works"
  }
}

data "aws_iam_policy_document" "public_ecr_policy" {
  statement {
    sid    = "new policy"
    effect = "Allow"

    principals {
      type        = "AWS"
      identifiers = ["340752823750"]
    }

    actions = [
      "ecr-public:BatchCheckLayerAvailability",
      "ecr-public:PutImage",
      "ecr-public:InitiateLayerUpload",
      "ecr-public:UploadLayerPart",
      "ecr-public:CompleteLayerUpload"
    ]
  }
}

resource "aws_ecrpublic_repository_policy" "public_ecr" {
  repository_name = aws_ecrpublic_repository.grocery_prices.repository_name
  policy          = data.aws_iam_policy_document.public_ecr_policy.json
}
