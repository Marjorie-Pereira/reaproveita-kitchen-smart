export function splitRecipeIngredients(ingredients: string) {
    const separator = ingredients.includes(",") ? ", " : "| ";
    const ingredientsSplit = ingredients.split(separator);
    return ingredientsSplit;
}
