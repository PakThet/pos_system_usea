export type Product = {
  id: number;
  image: string;
  store: string;
  p_name: string;
  slug: string;
  sku: string;
  cate: string;
  barcode: string;
  desc: string;
  quantity: number;
  price: number;
  tax: number;
  discount_value?: number;
  quantity_alert: number;
};
