export interface Product {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  tags: string[]
  brand?: string
  sku: string
  weight: number
  dimensions: {
    width: number
    height: number
    depth: number
  }
  warrantyInformation: string
  shippingInformation: string
  availabilityStatus: string
  returnPolicy: string
  minimumOrderQuantity: number
  images: string[]
  thumbnail: string
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export interface ProductFormData {
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  tags: string[]
  brand: string
  sku: string
  weight: number
  dimensions: {
    width: number
    height: number
    depth: number
  }
  warrantyInformation: string
  shippingInformation: string
  availabilityStatus: string
  returnPolicy: string
  minimumOrderQuantity: number
  images: string[]
  thumbnail: string
}

export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock'
  search?: string
}
