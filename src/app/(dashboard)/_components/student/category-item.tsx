import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { IconType } from "react-icons";
import qs from "query-string";

const CategoryItem = ({
  name,
  icon: Icon,
  id,
}: {
  name: string;
  icon: IconType;
  id: string;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currnetCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");
  const isSelected = id == currnetCategoryId;

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          // title: name,
          title: isSelected ? null : name,
          categoryId: isSelected ? null : id,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  };

  return (
    <Button
      onClick={onClick}
      variant={"outline"}
      className={cn(
        "flex items-center gap-1 justify-center rounded-lg ",
        isSelected && "bg-accent "
      )}
    >
      <Icon className="w-4 h-4" />
      {name}
    </Button>
  );
};

export default CategoryItem;
