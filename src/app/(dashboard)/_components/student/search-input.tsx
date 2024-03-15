"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import qs from "query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SearchInput = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currnetCategoryId = searchParams.get("categoryId");

  const handleSubmit = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: query,
          categoryId: currnetCategoryId,
          search: true,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  };

  const [query, setquery] = useState("");

  return (
    <div className=" flex w-full items-center space-x-0">
      <Input
        onChange={(e) => setquery(e.target.value)}
        className="w-full rounded-r-none border-r-none"
        type="email"
        placeholder="Search for a course"
      />
      <Button
        onClick={handleSubmit}
        className="hover:bg-green-500 bg-green-600 w-16 rounded-l-none border-l-none"
        variant={"outline"}
        size={"icon"}
        type="submit"
      >
        <Search className="w-5 h-5 text-white " />
      </Button>
    </div>
  );
};

export default SearchInput;
