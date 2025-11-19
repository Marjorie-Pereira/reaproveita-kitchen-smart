export type recipeParamType = {
  id: number;
  title: string;
  time: string;
  imageUri: string;
  instructions: string;
  recipeIngredients: {
    id: number;
    ingredient: string;
    checked: boolean;
  }[];
};
