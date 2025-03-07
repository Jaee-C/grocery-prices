export interface GrocerySearchQuery {
  keyword: string;
}

export interface TrackGroceryQuery {
  code: string;
  merchant: string;
}

export interface GrocerySearchResponse {
  products: Grocery[];
}

export interface Grocery {
  index: string;
  display_name: string;
  price: number;
  price_per_unit: string;
  size: string;
  is_on_special: boolean;
  url: string;
  code: string;
}
