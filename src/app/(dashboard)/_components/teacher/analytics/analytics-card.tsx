import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import React from "react";

const AnalyticsCard = ({
  title,
  value,
  shouldFormat,
}: {
  title: string;
  value: number;
  shouldFormat: boolean;
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {shouldFormat ? formatPrice(value) : value}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;
