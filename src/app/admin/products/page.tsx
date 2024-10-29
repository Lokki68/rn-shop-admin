import { getCategoriesWithProducts } from "@/actions/categories"
import { getProductsWithCategories } from "@/actions/products";
import ProductsPageComponent from "@/app/admin/products/page-component";


export default async function Products() {

  const categories = await getCategoriesWithProducts()
  const productsWithCategories = await getProductsWithCategories()

  

  return <ProductsPageComponent 
    categories={categories}
    productsWithCategories={productsWithCategories}
  />
}