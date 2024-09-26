export interface ReceiptItem {
  id: number;
  itemName: string;
  unit: "kg" | "gram";
  quantity: number;
  amount: number;
}

export interface Receipt {
  id: string;
  userId: string;
  customerName: string;
  totalAmount: number;
  items: ReceiptItem[];
  createdAt: Date;
}
