import boto3
from mypy_boto3_ecr_public import ECRPublicClient
from mypy_boto3_ecr_public.type_defs import ImageIdentifierTypeDef


def get_old_images(ecr_client: ECRPublicClient, repository_name) -> list[ImageIdentifierTypeDef]:
    images = ecr_client.describe_images(repositoryName=repository_name)["imageDetails"]
    images.sort(key=lambda x: x["imagePushedAt"] if "imagePushedAt" in x else 0)
    return [{"imageDigest": image["imageDigest"]} for image in images[:5] if "imageDigest" in image]


def purge_old_images(ecr_client: ECRPublicClient, repository_name, images: list[ImageIdentifierTypeDef]):
    print(f"Deleting impages: {[image['imageDigest'] for image in images if 'imageDigest' in image]}")
    ecr_client.batch_delete_image(repositoryName=repository_name, imageIds=images)


def main():
    ecr_client = boto3.client("ecr-public")
    repository_name = "my-repository"
    old_images = get_old_images(ecr_client, repository_name)
    purge_old_images(ecr_client, repository_name, old_images)


if __name__ == "__main__":
    main()
