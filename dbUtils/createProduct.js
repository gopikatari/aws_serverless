import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import isEmpty from "lodash/isEmpty.js";
import ddbClient from "./ddbClient.js";
import { marshall } from "@aws-sdk/util-dynamodb";
import { v4 as uuidv4 } from "uuid";
import getProduct from "./getProduct.js";

const createProduct = async payload => {
  console.log("-----CREATE PRODUCT------");

  const requestPayload = JSON.parse(payload);

  try {
    const _id = uuidv4();
    requestPayload.product_id = _id;
    const productId = requestPayload.product_id;
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: marshall(requestPayload || {}),
    };

    //check if the record already exists with same id;

    const isRecordExists = await getProduct(productId);
    console.log("IS RECORD EXISTS", isRecordExists);
    if (!isEmpty(isRecordExists)) {
      return {
        statusCode: 400,
        message: `Record already exist with key ${productId}`,
      };
    }
    const cmd = new PutItemCommand(params);
    const data = await ddbClient.send(cmd);

    console.log("RESPONSE CREATE PRODUCT", data);
    return data;
  } catch (error) {
    console.log("ERROR in CREATE PRODUCT");
    console.log(error);
  }
};

export default createProduct;
