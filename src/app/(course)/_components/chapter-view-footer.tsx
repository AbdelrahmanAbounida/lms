import { handlePayment } from "@/actions/checkout/checkout";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { Purchase } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

const ChapterViewFooter = ({
  price,
  courseId,
  title,
  isFree,
  purchase,
}: {
  price: number;
  courseId: string;
  title: string;
  isFree: boolean;
  purchase: Purchase;
}) => {
  const [isLoading, setisLoading] = useState(false);

  const handleStripe = async () => {
    try {
      setisLoading(true);

      const resp = await handlePayment({ courseId });

      if (!resp || resp.error || !resp.url) {
        toast.error(resp.error || "Something went wrong");
      }
      if (resp.url) {
        window.location.assign(resp.url!);
      }
    } catch (error) {
      console.log({ error });
    } finally {
      setisLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between md:flex-row p-6 rounded-lg border mt-3 border-1 mb-3">
      <h2 className="text-2xl font-semibold text-slate-800">{title}</h2>

      {!isFree && !purchase ? (
        <Button
          disabled={isLoading}
          onClick={handleStripe}
          className=" w-full md:w-auto mt-3 md:mt-0 bg-slate-800 hover:bg-slate-700"
        >
          Enroll for {formatPrice(price)}
        </Button>
      ) : (
        <Button>
          Complete and continue <ArrowRight className="w-5 h-5" />{" "}
        </Button>
      )}
    </div>
  );
};

export default ChapterViewFooter;
