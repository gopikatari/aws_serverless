import { QueryCommand } from "@aws-sdk/client-dynamodb";
import ddbClient from "./ddbClient.js";
import { unmarshall } from "@aws-sdk/util-dynamodb";
// import { get } from "lodash";

const getProductByQuery = async event => {
  console.log("-----GET PRODUCTS BY QUERY ------");

  try {
    const { pathParameters, queryStringParameters } = event;
    const { id } = pathParameters;
    const { category } = queryStringParameters;

    const _keyCondExpression = `product_id = :id`;

    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      KeyConditionExpression: _keyCondExpression,
      FilterExpression: "contains (category, :category)",
      ExpressionAttributeValues: {
        ":id": { S: id },
        ":category": { S: category },
      },
    };
    const cmd = new QueryCommand(params);
    const data = await ddbClient.send(cmd);
    console.log("RESPONSE PRODUCT BY QUERY", data);

    // return get(data, "Items", []).map(item => unmarshall(item));
    return (data.Items || []).map(item => unmarshall(item));
  } catch (error) {
    console.log("ERROR in PRODUCT BY QUERY");
    console.log(error);
  }
};

export default getProductByQuery;
