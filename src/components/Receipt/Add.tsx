"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { dismissToast, showToast } from "../Toast";

interface ReceiptItem {
  id: number;
  itemName: string;
  unit: "kg" | "gram";
  quantity: number;
  amount: number;
}

const AddReceipt = () => {
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState<ReceiptItem[]>([
    { id: 1, itemName: "", unit: "kg", quantity: 0, amount: 0 },
  ]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: items.length + 1,
        itemName: "",
        unit: "kg",
        quantity: 0,
        amount: 0,
      },
    ]);
  };

  const handleItemChange = (
    id: number,
    field: keyof ReceiptItem,
    value: string | number,
  ) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!customerName) {
      newErrors.customerName = "Customer name is required.";
    }

    items.forEach((item, index) => {
      if (!item.itemName) {
        newErrors[`itemName${index}`] = "Item name is required.";
      }
      if (item.quantity <= 0) {
        newErrors[`quantity${index}`] = "Quantity must be greater than zero.";
      }
      if (item.amount <= 0) {
        newErrors[`amount${index}`] = "Amount must be greater than zero.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.amount, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("error", "Please fix the validation errors.");
      return;
    }

    const toastID = showToast("loading", "Creating receipt...");

    try {
      await addDoc(collection(db, "receipts"), {
        customerName,
        items,
        totalAmount: calculateTotal(),
        createdAt: new Date().toISOString(),
      });
      dismissToast(toastID);
      showToast("success", "Receipt created successfully!");
      router.push("/receipts");
    } catch (error) {
      showToast("error", "Failed to create receipt.");
      console.error("Error adding receipt: ", error);
    }
  };

  return (
    <>
      <div className="rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              Customer Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              required
            />
            {errors.customerName && (
              <p className="text-sm text-red-500">{errors.customerName}</p>
            )}
          </div>

          <div className="mb-6">
            <h3 className="mb-3 text-body-sm font-medium text-dark dark:text-white">
              Items
            </h3>
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-[#F7F9FC] text-left dark:bg-dark-2">
                  <th className="px-4 py-3 text-body-sm font-medium text-dark dark:text-white">
                    Item Name
                  </th>
                  <th className="px-4 py-3 text-body-sm font-medium text-dark dark:text-white">
                    Unit
                  </th>
                  <th className="px-4 py-3 text-body-sm font-medium text-dark dark:text-white">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-body-sm font-medium text-dark dark:text-white">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.itemName}
                        onChange={(e) =>
                          handleItemChange(item.id, "itemName", e.target.value)
                        }
                        className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-3 py-1.5 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                        required
                      />
                      {errors[`itemName${index}`] && (
                        <p className="text-sm text-red-500">
                          {errors[`itemName${index}`]}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={item.unit}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "unit",
                            e.target.value as "kg" | "gram",
                          )
                        }
                        className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-3 py-1.5 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                      >
                        <option value="kg">kg</option>
                        <option value="gram">gram</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "quantity",
                            parseFloat(e.target.value),
                          )
                        }
                        onFocus={(e) => e.target.select()}
                        className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-3 py-1.5 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                        required
                      />
                      {errors[`quantity${index}`] && (
                        <p className="text-sm text-red-500">
                          {errors[`quantity${index}`]}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "amount",
                            parseFloat(e.target.value),
                          )
                        }
                        onFocus={(e) => e.target.select()}
                        className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-3 py-1.5 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                        required
                      />
                      {errors[`amount${index}`] && (
                        <p className="text-sm text-red-500">
                          {errors[`amount${index}`]}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-6">
            <button
              className="inline-flex items-center justify-center gap-2.5 rounded-[5px] border border-primary px-6 py-2 text-center font-medium text-primary hover:bg-opacity-90"
              onClick={handleAddItem}
            >
              Add Item
            </button>
          </div>

          <div className="mb-6 text-right">
            <p className="text-body-sm font-medium text-dark dark:text-white">
              Total Amount: ${calculateTotal().toFixed(2)}
            </p>
          </div>

          <div className="flex justify-end">
            <button
              className="inline-flex items-center justify-center gap-2.5 rounded-[5px] border border-green px-10 py-3.5 text-center font-medium text-green hover:bg-opacity-90 lg:px-8 xl:px-10"
              type="submit"
            >
              Create Receipt
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddReceipt;
