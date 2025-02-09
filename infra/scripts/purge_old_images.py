import boto3
from mypy_boto3_ecr_public import ECRPublicClient


def get_old_images(ecr_client: ECRPublicClient, repository_name):
    images = ecr_client.describe_images(repositoryName=repository_name)["imageDetails"]
    images.sort(key=lambda x: x["imagePushedAt"] if "imagePushedAt" in x else 0)
    return images[:-5]


def purge_old_images(ecr_client, repository_name, images):
    ecr_client.batch_delete_image(
        repositoryName=repository_name, imageIds=[{"imageDigest": image["imageDigest"]} for image in images]
    )


def main():
    ecr_client = boto3.client("ecr")
    repository_name = "my-repository"
    old_images = get_old_images(ecr_client, repository_name)
    purge_old_images(ecr_client, repository_name, old_images)


if __name__ == "__main__":
    main()
