import { APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import { DynamoDbPizzaStore } from "../store/dynamodb-pizza-store";
import { PizzaStore } from "../store/pizza-store";


const store: PizzaStore = new DynamoDbPizzaStore();
const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const result = await store.getPizzas();

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: `{"pizzas":${JSON.stringify(result)}}`,
    };
  } catch (error) {
      console.log('Unexpected error occurred while trying to retrieve pizzas', error as Error);

      return {
        statusCode: 500,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(error),
      };
  }
};

export default lambdaHandler;