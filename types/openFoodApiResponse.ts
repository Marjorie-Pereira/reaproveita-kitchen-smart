export type responseType = {
  code: string;
  status: number;
  status_verbose: string;
  product: productType;
};

export type productType = {
  product_name: string;
  brands: string;
  categories: string;
  image_url: string;
  expiration_date: string;
};
