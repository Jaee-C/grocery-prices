import { LambdaClient } from "@aws-sdk/client-lambda";

export const client = new LambdaClient({
  endpoint: process.env.NODE_ENV === "production" ? undefined : "http://localhost:4566",
  region: "us-east-1",
  credentials: process.env.NODE_ENV === "production" ? undefined : {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  }
});
