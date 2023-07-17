import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import ddbClient from "./ddbClient.js";

const getAllProudcts = async () => {
  console.log("-----GET ALLPRODUCTS------");

  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
    };
    const cmd = new ScanCommand(params);
    const data = await ddbClient.send(cmd);
    console.log("RESPONSE GET ALL PRODUCTS =>", data);

    return data.Items.map(item => unmarshall(item));
  } catch (error) {
    console.log("ERROR in GET PRODUCT");
    console.log(error);
  }
};

export default getAllProudcts;
