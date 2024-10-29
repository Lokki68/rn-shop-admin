'use client';

import { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { ProductsWithCategoriesResponse } from '@/app/admin/products/products.type';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Category } from '@/app/admin/categories/categories.type';
import {
  createOrUpdateProductSchema,
  CreateOrUpdateProductSchema,
} from '@/app/admin/products/schema';
import { imageUploadHandler } from '@/actions/categories';
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from '@/actions/products';
import { ProductForm } from '@/app/admin/products/product-form';
import { ProductTableRow } from '@/app/admin/products/product-table-row';

type Props = {
  categories: Category[]
  productsWithCategories: ProductWithCategoriesResponse
}

export default function ProductsPageComponent({ categories, productsWithCategories }: Props) {
  const [currentProduct, setCurrentProduct] = useState<CreateOrUpdateProductSchema | null>(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const form = useForm<CreateOrUpdateProductSchema>({
    resolver: zodResolver(createOrUpdateProductSchema),
    defaultValues: {
      title: '',
      category: undefined,
      price: undefined,
      maxQuantity: undefined,
      heroImage: undefined,
      images: [],
      intent: 'create',
    }
  })

  const router = useRouter()

  const productCreateUpdateHandler = 
    async (data: CreateOrUpdateProductSchema) => {
      console.log(data)
      const {
        category,
        heroImage,
        images,
        intent = 'create',
        maxQuantity,
        price,
        slug,
        title
      } = data

      const uploadFile = async (file: File) => {
        const uniqueId = uuid()

        const fileName = `product/product-${uniqueId}-${file.name}`
        const formData = new FormData()
        formData.append('file', file, fileName)
        return imageUploadHandler(formData)
      }

      let heroImageUrl: string | undefined
      let imageUrls: string[] = []

      if (heroImage) {
        const imagePromise = Array.from(heroImage).map(file => uploadFile(file as File))

        try {
          [heroImageUrl] = await Promise.all(imagePromise)
        } catch (error) {
          console.error('Error uploading image:', error)
          toast.error('Error uploading image')
          return
        }
      }

      if (imageUrls.length > 0) {
        const imagesPromise = Array.from(images).map(file => uploadFile(file as File))

        try {
          imageUrls = (await Promise.all(imagesPromise))as string[]
        } catch (error) {
          console.error('Error uploading image:', error)
          toast.error('Error uploading image')
          return
        }
      }

      switch (intent) {
        case 'create': {
          if (heroImageUrl && imageUrls.length > 0 ) {
            await createProduct({
              category: Number(category),
              heroImage: heroImageUrl,
              images: imageUrls,
              maxQuantity: Number(maxQuantity),
              price: Number(price),
              title
            })
            form.reset()
            router.refresh()
            setIsProductModalOpen(false)
            toast.success('Product created successfully')
          }
          break;
        }

        case 'update': {
          if (heroImageUrl && imageUrls.length > 0 ) {
            await updateProduct({
              category: Number(category),
              heroImage: heroImageUrl!,
              imagesUrl: imageUrls,
              maxQuantity: Number(maxQuantity),
              price: Number(price),
              slug,
              title
            })
            form.reset()
            router.refresh()
            setIsProductModalOpen(false)
            toast.success('Product updated successfully')
          }
          break
        }
      
        default:
          console.error('Invalid intent:', intent)
      }
    }

    const deleteProductHandler = async () => {
      if (currentProduct?.slug) {
        await deleteProduct(currentProduct.slug)
        router.refresh()
        toast.success('Product deleted successfully')
        setIsDeleteModalOpen(false)
        setCurrentProduct(null)
      }
    }

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Product Management</h1>
          <Button
            onClick={() => {
              setCurrentProduct(null)
              setIsProductModalOpen(true)
            }}
          >
            <PlusIcon className='mr-2 h-4 w-4'/>
            <span>Add Product</span>
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Max Quatity</TableHead>
              <TableHead>Hero Image</TableHead>
              <TableHead>Product Image</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              productsWithCategories.map((product) => (
                <ProductTableRow
                  key={product.id}
                  setIsProductModalOpen={setIsProductModalOpen}
                  setCurrentProduct={setCurrentProduct}
                  setIsDeleteModalOpen={setIsDeleteModalOpen}
                  product={product}
                />
              ))
            }
          </TableBody>
        </Table>

        {/* Product Modal */}
        <ProductForm 
          form={form}
          onSubmit={productCreateUpdateHandler}
          categories={categories}
          isProductModalOpen={isProductModalOpen}
          setIsProductModalOpen={setIsProductModalOpen}
          defaultValues={currentProduct}
        />

        {/* Delete Modal */}
        <Dialog
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this product?</p>
            <DialogFooter>
              <Button
                variant='destructive'
                onClick={deleteProductHandler}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </main>
  )
}