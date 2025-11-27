import { recipe } from "./recipeType";

export type mealObject = {
  id?: number;
  id_receita: number;
  porcoes: number;
  data_sobras: Date;
  recipeInfo?: Partial<recipe>;
};
