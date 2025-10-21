export interface Product {
  id: number;
  image: string;
  store: string;
  name: string;
  slug: string;
  sku: string;
  cate: string;
  barcode: string;
  description: string;
  quantity: number;
  price: number;
  tax?: number;
  discount_value?: number;
  quantity_alert: number;
}
