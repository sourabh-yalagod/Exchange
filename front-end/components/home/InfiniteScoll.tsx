"use client";
import { useRouter } from "next/navigation";
import React from "react";

const InfiniteScroller = ({ items }: any) => {
  // Duplicate items for infinite illusion
  const repeatedItems = [...items, ...items];
  const router = useRouter();
  return (
    <div className="overflow-hidden dark:bg-[#1e2329] text-white py-4 mt-14">
      <div className="scroll-wrapper flex animate-scroll-ltr">
        {repeatedItems.map((item, index) => (
          <div
            key={index}
            onClick={() => router.push(`/trade/${item.split("/").join("")}`)}
            className="flex-shrink-0 mx-6 cursor-pointer hover:scale-105 transition-all text-xl font-semibold"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteScroller;
