"use client";
import React from "react";
import ChatCard from "../Chat/ChatCard";
import TableOne from "../Tables/TableOne";
import DataStatsOne from "@/components/DataStats/DataStatsOne";
import dynamic from "next/dynamic";
const ChartOne = dynamic(() => import("@/components/Charts/ChartOne"), {
  ssr: false,
});
const ChartTwo = dynamic(() => import("@/components/Charts/ChartTwo"), {
  ssr: false,
});
const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), {
  ssr: false,
});
const MapOne = dynamic(() => import("../Maps/MapOne"), { ssr: false });

const ECommerce: React.FC = () => {
  return (
    <>
      <DataStatsOne />

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <ChartThree />
        <MapOne />
        <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
        <ChatCard />
      </div>
    </>
  );
};

export default ECommerce;
