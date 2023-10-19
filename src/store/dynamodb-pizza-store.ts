import { Pizza } from "../model/pizza";
import { PizzaStore } from "./pizza-store";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandOutput,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";


export class DynamoDbPizzaStore implements PizzaStore {
  private static tableName = process.env.TABLE_NAME;
  private static ddbClient: DynamoDBClient = new DynamoDBClient({});
  private static ddbDocClient: DynamoDBDocumentClient =
    DynamoDBDocumentClient.from(DynamoDbPizzaStore.ddbClient);
  
  public async getPizza(id: string): Promise<Pizza | undefined> {
    const params: GetCommand = new GetCommand({
      TableName: DynamoDbPizzaStore.tableName,
      Key: {
        id: id,
      },
    });
    const result:GetCommandOutput = await DynamoDbPizzaStore.ddbDocClient.send(params);
    return result.Item as Pizza;
  };

  public async putPizza(Pizza: Pizza): Promise<void> {
    const params: PutCommand = new PutCommand({
      TableName: DynamoDbPizzaStore.tableName,
      Item: {
        id: Pizza.id,
        name: Pizza.name,
        description: Pizza.description,
        price: Pizza.price,
      },
    });
    await DynamoDbPizzaStore.ddbDocClient.send(params);
  };

  public async deletePizza(id: string): Promise<void> {
    const params: DeleteCommand = new DeleteCommand({
      TableName: DynamoDbPizzaStore.tableName,
      Key: {
        id: id,
      },
    });
    await DynamoDbPizzaStore.ddbDocClient.send(params);
  };

  public async getPizzas (): Promise<Pizza[] | undefined> {
    const params:ScanCommand = new ScanCommand( {
        TableName: DynamoDbPizzaStore.tableName,
        Limit: 20
    });
    const result = await DynamoDbPizzaStore.ddbDocClient.send(params);
    return result.Items as Pizza[];
  };
}
