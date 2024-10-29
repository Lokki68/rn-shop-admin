
import {ProductWithCategory} from "@/app/admin/products/products.type";

export type Category = {
  id: number
  name: string
  slug: string
  imageUrl: string
  created_at: string
}

export type CategoryWithProducts = Category & {
  products: ProductWithCategory[]
}

export type CategoriesWithProductsResponse = CategoryWithProducts[]



