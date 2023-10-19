import { Pizza } from "../model/pizza";


export interface PizzaStore {
  getPizza: (id: string) => Promise<Pizza | undefined>;
  putPizza: (Pizza: Pizza) => Promise<void>;
  deletePizza: (id: string) => Promise<void>;
  getPizzas: () => Promise<Pizza[] | undefined>;
}
