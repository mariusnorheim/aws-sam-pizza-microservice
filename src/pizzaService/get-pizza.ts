import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDbPizzaStore } from "../store/dynamodb-pizza-store";
import { PizzaStore } from "../store/pizza-store";


const store: PizzaStore = new DynamoDbPizzaStore();
const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters!.id;
  if (id === undefined) {
    console.log('Missing \'id\' parameter in path while trying to retrieve a pizza');

    return {
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "Missing 'id' parameter in path" }),
    };
  }
  
  try {
    const result = await store.getPizza(id);

    if (!result) {
      console.log('No pizza with ID '+ id + ' found in the databases while trying to retrieve a pizza');

      return {
        statusCode: 404,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: "Pizza not found" }),
      };
    }

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.log('Unexpected error occurred while trying to retrieve a pizza', error);

    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(error),
    };
  }
};

export default lambdaHandler;