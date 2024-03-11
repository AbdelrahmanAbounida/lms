"use client";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.bubble.css";

interface PreviewrProps {
  value: string;
}

const Preview = ({ value }: PreviewrProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );
  return (
    <ReactQuill
      className="bg-white/50 rounded-md p-2"
      theme="bubble"
      value={value}
      readOnly
    />
  );
};

export default Preview;
