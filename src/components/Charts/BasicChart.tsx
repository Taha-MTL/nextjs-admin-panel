"use client";

import React from "react";
import dynamic from "next/dynamic";
const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), {
  ssr: false,
});
const ChartFive = dynamic(() => import("@/components/Charts/ChartFive"), {
  ssr: false,
});

const BasicChart: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <ChartThree />
        <div className="col-span-12 xl:col-span-5">
          <ChartFive />
        </div>
      </div>
    </>
  );
};

export default BasicChart;
