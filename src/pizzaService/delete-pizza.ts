import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDbPizzaStore } from "../store/dynamodb-pizza-store";
import { PizzaStore } from "../store/pizza-store";


const store: PizzaStore = new DynamoDbPizzaStore();
const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters!.id;
  if (id === undefined) {
    console.log('Missing \'id\' parameter in path while trying to delete a pizza');

    return {
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "Missing 'id' parameter in path" }),
    };
  }

  try {
    await store.deletePizza(id);

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "Pizza deleted" }),
    };
  } catch (error) {
    console.log('Unexpected error occurred while trying to delete pizza with ID '+ id, error);

    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(error),
    };
  }
};

export default lambdaHandler;