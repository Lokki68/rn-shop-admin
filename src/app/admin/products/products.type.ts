import { Category } from "@/app/admin/categories/categories.type";

export type ProductWithCategory = {
  id: number;
  title: string;
  slug: string;
  imagesUrl: string[];
  price: number;
  heroImage: string;
  category: Category;
  maxQuantity: number;
}

export type ProductWithCategoriesResponse = ProductWithCategory[]

export type UpdateProductSchema = {
  slug: string;
  title: string;
  category: number;
  price: number;
  maxQuantity: number;
  heroImage: string;
  imagesUrl: string[];
}