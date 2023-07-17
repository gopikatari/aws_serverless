import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import ddbClient from "./ddbClient.js";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
// import { get } from "lodash";

const getProduct = async id => {
  console.log("-----GET ALLPRODUCT BY ID------");

  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ product_id: id }),
    };
    const cmd = new GetItemCommand(params);
    const data = await ddbClient.send(cmd);
    console.log("RESPONSE GET PRODUCT BY ID =>", data);

    return unmarshall(data.Item || {});
  } catch (error) {
    console.log("ERROR in GET PRODUCT");
    console.log(error);
  }
};

export default getProduct;
