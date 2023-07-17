import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import ddbClient from "./ddbClient.js";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import getProduct from "./getProduct.js";
import isEmpty from "lodash/isEmpty.js";

const deleteProduct = async productId => {
  console.log("-----DELETE PRODUCT------");
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ product_id: productId }),
    };

    //check if the record already exists with same id;
    const resp = await getProduct(productId);
    console.log("isRecordExists==>", resp);
    if (isEmpty(resp)) {
      return {
        statusCode: 400,
        body: `No Record found for this key ${productId}`,
      };
    }
    const cmd = new DeleteItemCommand(params);
    const data = await ddbClient.send(cmd);

    console.log("RESPONSE DELETE PRODUCT", data);
    return data;
  } catch (error) {
    console.log("ERROR in DELETE PRODUCT");
    console.log(error);
  }
};

export default deleteProduct;
