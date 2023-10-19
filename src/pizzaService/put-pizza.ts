import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Pizza } from "../model/pizza";
import { DynamoDbPizzaStore } from "../store/dynamodb-pizza-store";
import { PizzaStore } from "../store/pizza-store";


const store: PizzaStore = new DynamoDbPizzaStore();
const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters!.id;
  if (id === undefined) {
    console.log('Missing \'id\' parameter in path while trying to create a pizza');

    return {
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "Missing 'id' parameter in path" }),
    };
  }

  if (!event.body) {
    console.log('Empty request body provided while trying to create a pizza');

    return {
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "Empty request body" }),
    };
  }

  let pizza: Pizza;
  try {
    pizza = JSON.parse(event.body);

    if ((typeof pizza) !== "object" ){
      throw Error("Parsed pizza is not an object")
    }
  } catch (error) {
    console.log('Unexpected error occurred while trying to create a pizza', error);

    return {
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        message: "Failed to parse pizza from request body",
      }),
    };
  }

  if (id !== pizza.id) {
    console.log( `Pizza ID in path ${id} does not match pizza ID in body ${pizza.id}`);

    return {
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        message: "Pizza ID in path does not match pizza ID in body",
      }),
    };
  }

  try {
    await store.putPizza(pizza);

    return {
      statusCode: 201,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "Pizza created" }),
    };
  } catch (error) {
    console.log('Unexpected error occurred while trying to create a Pizza', error);

    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(error),
    };
  }
};

export default lambdaHandler;