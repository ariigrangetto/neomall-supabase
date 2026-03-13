export interface FiltersType {
  text: string;
  category: string;
}

export interface CartItem {
  id: number | string;
  quantity: number;
  product_id: number | string;
  cart_id: number | string;
  fav: boolean;
  Products: Products;
}

export interface Products {
  id: number | string;
  title: string;
  description: string;
  category: string;
  price: number;
  discount: number;
  rating: number;
  stock: number;
  brand: string;
  warraty: string;
  shipping: string;
  availability: string;
  image: string;
}

export interface Cart {
  id: number | string;
  user_id: number | string;
}

export interface Rating {
  id: number | string;
  rating: number;
  comment: string;
  reviewerName: string;
  reviewerEmail: string;
  created_at: string;
  product_id: number | string;
}
