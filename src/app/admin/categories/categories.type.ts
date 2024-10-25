
export type Products = {
  id: number;
  title: string;
  slug: string;
  imagesUrl: string[];
  price: number;
  heroImage: string;
  category: number;
  maxQuantity: number;
}

export type CategoryWithProducts = {
  id: number
  created_at: string
  imageUrl: string
  name: string
  slug: string
  products: Products[]
}

export type CategoriesWithProductsResponse = CategoryWithProducts[]



