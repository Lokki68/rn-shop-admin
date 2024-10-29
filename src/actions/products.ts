'use server'

import slugify from "slugify"

import { createClient } from "@/utils/supabase/server"
import {
  ProductWithCategoriesResponse,
  UpdateProductSchema
} from '@/app/admin/products/products.type'
import {CreateProductSchemaServer} from '@/app/admin/products/schema'

const supabase = createClient()

export const getProductsWithCategories = async (): Promise<ProductWithCategoriesResponse> => {
  const {data, error} = await supabase
    .from('product')
    .select('* , categories:category(*)')
    .returns<ProductWithCategoriesResponse>()

  if(error) throw new Error(`Error fetching products: ${error.message}`)

  return data || []
}

export const createProduct = async ({
  title,
  price,
  maxQuantity,
  category,
  heroImage,
  images
}: CreateProductSchemaServer) =>{
  const slug = slugify(title, {lower: true})

  const {data, error} = await supabase
    .from('product')
    .insert({
      title,
      price,
      maxQuantity,
      category,
      heroImage,
      imagesUrl: images,
      slug
    })

  if(error) throw new Error(`Error creating product: ${error.message}`)

    return data
}

export const updateProduct = async ({
  title,
  price,
  maxQuantity,
  category,
  heroImage,
  imagesUrl,
  slug
}: UpdateProductSchema) => {
  const {data, error} = await supabase
    .from('product')
    .update({
      title,
      price,
      maxQuantity,
      category,
      heroImage,
      imagesUrl
    })
    .match({slug})

  if(error) throw new Error(`Error updating product: ${error.message}`)

  return data
}

export const deleteProduct = async (slug: string) => {
  const {error} = await supabase.from('product').delete().match({slug})

  if(error) throw new Error(`Error deleting product: ${error.message}`)
}