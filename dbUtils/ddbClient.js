import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const params = {
  region: "us-east-1",
};
const ddbClient = new DynamoDBClient(params);

export default ddbClient;
