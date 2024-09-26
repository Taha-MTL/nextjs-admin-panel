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
  where,
} from "firebase/firestore";
import { Edit, Delete, Search } from "@mui/icons-material";
import { ChevronDown } from "lucide-react";
import DeleteAlert from "@/components/Alerts/Delete";
import Loader from "../Loader/Subtle";
import { showToast } from "../Toast";
import { Receipt } from "./interface";
import { useUser } from "@/context/UserContext";

const ReceiptList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [receiptToDelete, setReceiptToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const { user } = useUser();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReceipts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setItemsPerPage(itemsPerPage);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchReceipts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    filterReceipts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filterOption, dateFilter, receipts]);

  const fetchReceipts = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "receipts"),
        where("userId", "==", user.id),
        orderBy("createdAt", "desc"),
      );

      const snapshot = await getDocs(q);
      const fetchedReceipts: Receipt[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: new Date(data.createdAt),
        };
      }) as Receipt[];

      setReceipts(fetchedReceipts);
      setFilteredReceipts(fetchedReceipts);
    } catch (error) {
      console.error("Error fetching receipts: ", error);
      showToast("error", "Failed to fetch receipts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterReceipts = () => {
    let filtered = receipts;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((receipt) =>
        receipt.customerName.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply dropdown filter
    switch (filterOption) {
      case "highValue":
        filtered = filtered.filter((receipt) => receipt.totalAmount >= 1000);
        break;
      case "lowValue":
        filtered = filtered.filter((receipt) => receipt.totalAmount < 1000);
        break;
    }

    // Apply date filter
    const now = new Date();
    switch (dateFilter) {
      case "week":
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(
          (receipt) => receipt.createdAt >= oneWeekAgo,
        );
        break;
      case "month":
        const oneMonthAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate(),
        );
        filtered = filtered.filter(
          (receipt) => receipt.createdAt >= oneMonthAgo,
        );
        break;
      case "year":
        const oneYearAgo = new Date(
          now.getFullYear() - 1,
          now.getMonth(),
          now.getDate(),
        );
        filtered = filtered.filter(
          (receipt) => receipt.createdAt >= oneYearAgo,
        );
        break;
    }

    setFilteredReceipts(filtered);
    setCurrentPage(1);
  };

  const handleDeleteClick = (id: string) => {
    setReceiptToDelete(id);
    setIsAlertOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (receiptToDelete) {
      setLoading(true);
      try {
        await deleteDoc(doc(db, "receipts", receiptToDelete));
        setReceiptToDelete(null);
        showToast("success", "Receipt deleted successfully");
        fetchReceipts(); // Refresh the list after deletion
      } catch (error) {
        console.error("Error deleting receipt: ", error);
        showToast("error", "Failed to delete receipt");
      } finally {
        setIsAlertOpen(false);
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:space-x-4 ">
        <ButtonDefault
          label="Create Receipt"
          customClasses="border border-green text-green rounded-[5px] px-10 py-3.5 lg:px-8 xl:px-10"
          link="/receipts/add"
        />

        <div className="flex flex-col items-center space-y-4 sm:w-auto sm:flex-row sm:space-x-4 sm:space-y-0">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by customer name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-stroke bg-gray-100 py-3 pl-12 pr-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark dark:text-white"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>

          <div className="relative w-full sm:w-auto">
            <select
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
              className="w-full appearance-none rounded-md border border-stroke bg-gray-100 px-4 py-3 pr-8 outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark dark:text-white"
            >
              <option value="all">All Receipts</option>
              <option value="highValue">High Value (≥₹1000)</option>
              <option value="lowValue">Low Value (&lt;₹1000)</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>

          <div className="relative w-full sm:w-auto">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full appearance-none rounded-md border border-stroke bg-gray-100 px-4 py-3 pr-8 outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark dark:text-white"
            >
              <option value="all">All Time</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : filteredReceipts.length > 0 ? (
        <>
          <div className="mb-6 mt-6">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredReceipts.length}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
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
                          ₹ {receipt.totalAmount.toFixed(2)}
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
