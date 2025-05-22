import { qna } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import React, { useState } from "react";

const QnA = () => {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <div className="space-y-6 py-9">
      <h1 className="capitalize text-center font-semibold text-xl sm:text-3xl md:text-4xl">
        All About you need to know
      </h1>
      {qna.map((item: any, index: number) => {
        return (
          <div key={index} className="w-full">
            <div className="flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <span className="rounded-lg p-2 border-2 text-center">
                  {item.id}
                </span>
                <div
                  className="cursor-pointer  font-semibold text-sm sm:text-xl"
                  onClick={() =>
                    setOpenIndex((prev) => {
                      if (prev == item.id) return null;
                      return item.id;
                    })
                  }
                >
                  {item.question}
                </div>
              </div>
              {openIndex == item.id ? (
                <Minus
                  onClick={() =>
                    setOpenIndex((prev) => {
                      if (prev == item.id) return null;
                      return item.id;
                    })
                  }
                  className={`rotate-0 hover:bg-red-600 rounded-full cursor-pointer hover:scale-110 transition-all`}
                />
              ) : (
                <Plus
                  onClick={() =>
                    setOpenIndex((prev) => {
                      if (prev == item.id) return null;
                      return item.id;
                    })
                  }
                  className={`rotate-0 hover:bg-green-600 rounded-full cursor-pointer hover:scale-110 transition-all`}
                />
              )}
            </div>
            <div
              className={`transition-all text-wrap duration-300 ease-in-out transform 
                ${
                  openIndex == index + 1
                    ? "opacity-100 translate-y-0 max-h-96 overflow-scroll"
                    : "opacity-0 -translate-y-4 max-h-0 overflow-scroll"
                } 
                md:pl-10 sm:pl-8 text-lg dark:text-slate-400 text-slate-600`}
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QnA;
