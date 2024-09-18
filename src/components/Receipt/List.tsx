"use client";
import { useState, useEffect } from "react";
import Pagination from "../Pagination";
import ButtonDefault from "../Buttons/ButtonDefault";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Edit, Delete } from "@mui/icons-material";
import DeleteAlert from "@/components/Alerts/Delete";
import Loader from "../Loader/Subtle";
import { showToast } from "../Toast";

interface Receipt {
  id: string;
  customerName: string;
  totalAmount: number;
  createdAt: Date;
}

const ReceiptList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [receiptToDelete, setReceiptToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = receipts.slice(indexOfFirstItem, indexOfLastItem);

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setItemsPerPage(itemsPerPage);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchReceipts = async () => {
      const q = query(collection(db, "receipts"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedReceipts: Receipt[] = [];
      querySnapshot.forEach((doc) => {
        fetchedReceipts.push({ id: doc.id, ...doc.data() } as Receipt);
      });
      setReceipts(fetchedReceipts);
      setLoading(false);
    };
    fetchReceipts();
  }, []);

  const handleDeleteClick = (id: string) => {
    setReceiptToDelete(id);
    setIsAlertOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (receiptToDelete) {
      try {
        await deleteDoc(doc(db, "receipts", receiptToDelete));
        setReceipts(
          receipts.filter((receipt) => receipt.id !== receiptToDelete),
        );
        setIsAlertOpen(false);
        setReceiptToDelete(null);
        showToast("success", "Receipt deleted successfully");
      } catch (error) {
        setIsAlertOpen(false);
        console.error("Error deleting receipt: ", error);
        showToast("error", "Failed to delete receipt");
      }
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-title-md2 font-bold text-black dark:text-white">
          Receipts List
        </h2>

        <ButtonDefault
          label="Create Receipt"
          customClasses="border border-green text-green rounded-[5px] px-10 py-3.5 lg:px-8 xl:px-10"
          link="/receipts/add"
        />
      </div>

      {loading ? (
        <Loader />
      ) : receipts.length ? (
        <>
          <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
            <div className="max-w-full overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-[#F7F9FC] text-left dark:bg-dark-2">
                    <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">
                      Customer Name
                    </th>
                    <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                      Total Amount
                    </th>
                    <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                      Date
                    </th>
                    <th className="px-4 py-4 text-right font-medium text-dark dark:text-white xl:pr-7.5">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((receipt) => (
                    <tr key={receipt.id}>
                      <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                        <p className="text-dark dark:text-white">
                          {receipt.customerName}
                        </p>
                      </td>
                      <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                        <p className="text-dark dark:text-white">
                          ${receipt.totalAmount.toFixed(2)}
                        </p>
                      </td>
                      <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                        <p className="text-dark dark:text-white">
                          {new Date(receipt.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="border-[#eee] px-4 py-4 dark:border-dark-3 xl:pr-7.5">
                        <div className="flex items-center justify-end space-x-3.5">
                          <Link href={`/receipts/edit/${receipt.id}`}>
                            <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:border-primary hover:bg-primary hover:text-white">
                              <Edit fontSize="small" />
                            </button>
                          </Link>
                          <button
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:border-primary hover:bg-primary hover:text-white"
                            onClick={() => handleDeleteClick(receipt.id)}
                          >
                            <Delete fontSize="small" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalItems={receipts.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </>
      ) : (
        <div className="py-10 text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            No receipts to show
          </p>
        </div>
      )}
      <DeleteAlert
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Delete"
        message="Are you sure you want to delete this receipt? This action cannot be undone."
      />
    </>
  );
};

export default ReceiptList;
