"use client";
import React, { useState, useEffect } from "react";
import {
  RiMoneyDollarCircleLine,
  RiShoppingCart2Line,
  RiUserLine,
} from "react-icons/ri";
import { Receipt } from "../Receipt/interface";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUser } from "@/context/UserContext";
import { showToast } from "../Toast";
import Loader from "../Loader/Subtle";
import StatCard from "../Cards/DataStatsCard";
import SalesChart from "../Charts/SalesChart";
import { Card } from "../Cards";

const Dashboard: React.FC = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    fetchReceipts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchReceipts = async () => {
    if (!user?.id) return;

    try {
      const q = query(
        collection(db, "receipts"),
        where("userId", "==", user.id),
      );
      const snapshot = await getDocs(q);
      const fetchedReceipts: Receipt[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: new Date(doc.data().createdAt),
      })) as Receipt[];

      setReceipts(fetchedReceipts);
    } catch (error) {
      console.error("Error fetching receipts: ", error);
      showToast("error", "Failed to fetch receipts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalSales = () =>
    receipts.reduce((total, receipt) => total + receipt.totalAmount, 0);
  const calculateAverageOrderValue = () =>
    receipts.length ? calculateTotalSales() / receipts.length : 0;
  const calculateTotalCustomers = () =>
    new Set(receipts.map((receipt) => receipt.customerName)).size;

  const dataStats = [
    {
      icon: RiMoneyDollarCircleLine,
      color: "bg-green-500",
      title: "Total Sales",
      value: `₹${calculateTotalSales().toFixed(2)}`,
    },
    {
      icon: RiShoppingCart2Line,
      color: "bg-orange-500",
      title: "Avg. Order Value",
      value: `₹${calculateAverageOrderValue().toFixed(2)}`,
    },
    {
      icon: RiUserLine,
      color: "bg-blue-500",
      title: "Total Customers",
      value: calculateTotalCustomers().toString(),
    },
  ];

  const prepareChartData = () => {
    return receipts
      .map((receipt) => ({
        date: receipt.createdAt,
        amount: receipt.totalAmount,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  return (
    <Card className="space-y-6">
      <h2 className="text-title-md2 mb-6 font-bold text-black dark:text-white">
        Dashboard
      </h2>

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {dataStats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
          <SalesChart data={prepareChartData()} />
        </>
      )}
    </Card>
  );
};

export default Dashboard;
