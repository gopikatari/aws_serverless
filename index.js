import isEmpty from "lodash/isEmpty.js";
import getProduct from "./dbUtils/getProduct.js";
import getAllProudcts from "./dbUtils/getAllProducts.js";
import createProduct from "./dbUtils/createProduct.js";
import deleteProduct from "./dbUtils/deleteProduct.js";
import getProductByQuery from "./dbUtils/getProductByQuery.js";
import updateProduct from "./dbUtils/updateProduct.js";

export const handler = async event => {
  console.log("RECEIVED EVENT", JSON.stringify(event));

  const { httpMethod, pathParameters, queryStringParameters, body } = event;

  let response;
  try {
    switch (httpMethod) {
      case "GET":
        if (!isEmpty(pathParameters) && !isEmpty(queryStringParameters)) {
          response = await getProductByQuery(event);
        } else if (!isEmpty(pathParameters)) {
          response = await getProduct(pathParameters.id);
        } else {
          response = await getAllProudcts();
        }
        break;
      case "POST":
        response = await createProduct(body);
        break;
      case "DELETE":
        response = await deleteProduct(pathParameters.id);
        break;
      case "PUT":
        response = await updateProduct(pathParameters.id, body);
        break;
      default:
        throw new Error(`Unsupported request method ${httpMethod}`);
    }

    console.log("INDEX RESPONSE", response);
    return {
      statusCode: 200,
      // headers: { "Content-Type": "text/json" },
      body: JSON.stringify({
        message: `Successfully finished operation ${httpMethod}`,
        data: response,
      }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      //  headers: { "Content-Type": "text/json" },
      body: JSON.stringify({
        message: `Falied to perfrom peration ${httpMethod}`,
        errorMsg: error.message,
        errorStack: error.stack,
      }),
    };
  }
};
