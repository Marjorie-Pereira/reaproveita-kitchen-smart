export type FoodListItemProps = {
  imageUri: string;
  name: string;
  brand: string;
  category: string;
  volume: string;
  expiresIn: string
 
};

export type foodItem = {
  id?: string;
  imagem?: string;
  nome: string;
  marca: string;
  quantidade: number;
  unidade_medida: string;
  data_validade: string;
  categoria: string;
  preco: number;
  status: "Aberto" | "Fechado";
  id_ambiente: string;
};

export type foodStatus = "Aberto" | "Fechado";
