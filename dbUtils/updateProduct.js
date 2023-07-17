import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import ddbClient from "./ddbClient.js";
import { marshall } from "@aws-sdk/util-dynamodb";
import getProduct from "./getProduct.js";

const updateProduct = async (productId, payload) => {
  console.log("-----UPDATE PRODUCT------");

  const requestPayload = JSON.parse(payload);
  const payloadKeys = Object.keys(requestPayload);

  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ product_id: productId }),
      UpdateExpression: `SET ${payloadKeys
        .map((_, index) => `#key${index} = :value${index}`)
        .join(", ")}`,
      ExpressionAttributeNames: payloadKeys.reduce((acc, value, index) => {
        return {
          ...acc,
          [`#key${index}`]: value,
        };
      }, {}),
      ExpressionAttributeValues: marshall(
        payloadKeys.reduce((acc, value, index) => {
          return {
            ...acc,
            [`:value${index}`]: requestPayload[value],
          };
        }, {})
      ),
    };

    //check if the record already exists with same id;

    const isRecordExists = await getProduct(productId);
    if (!isRecordExists) {
      return {
        statusCode: 400,
        message: `Record Not exist to update key ${productId}`,
      };
    }
    const cmd = new UpdateItemCommand(params);
    const data = await ddbClient.send(cmd);

    console.log("RESPONSE UPDATE PRODUCT", data);
    return data;
  } catch (error) {
    console.log("ERROR in UPDATE PRODUCT");
    console.log(error);
  }
};

export default updateProduct;
