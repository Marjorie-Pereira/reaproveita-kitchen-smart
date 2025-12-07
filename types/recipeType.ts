export type recipe = {
  id: number;
  id_receita?:number
  receita: string;
  ingredientes: string;
  modo_preparo: string;
  ingredientes_base: string[];
  link_imagem: string;
  tempo_preparo: string;
  categoria: recipeCategory;
};

export type recipeCategory = 'Café da Manhã' | 'Almoço' | 'Janta';