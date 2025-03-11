import { LambdaClient } from "@aws-sdk/client-lambda";
import { awsCredentialsProvider }  from "@vercel/functions/oidc";

const AWS_ROLE_ARN = process.env.AWS_ROLE_ARN!;

export const client = new LambdaClient({
  endpoint: process.env.NODE_ENV === "production" ? undefined : "http://localhost:4566",
  region: "us-east-1",
  credentials: process.env.NODE_ENV === "production" ? awsCredentialsProvider({
    roleArn: AWS_ROLE_ARN,
  }) : {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  }
});
