"use client";
import { Category } from "@prisma/client";
import React from "react";
import { IconType } from "react-icons";
import CategoryItem from "./category-item";
import {
  FcCalculator,
  FcCapacitor,
  FcCommandLine,
  FcCustomerSupport,
  FcEngineering,
  FcGallery,
  FcRadarPlot,
  FcSettings,
  FcVoicemail,
} from "react-icons/fc";

interface CategoriesProps {
  items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
  "Computer Science": FcEngineering,
  Math: FcCalculator,
  "Artificial Intelligence": FcCustomerSupport,
  "Game Development": FcGallery,
  "Model Design": FcSettings,
  "Software Development": FcCommandLine,
  Robotics: FcCapacitor,
  Fitness: FcVoicemail,
  Language: FcRadarPlot,
};

const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className="w-full flex gap-x-3 p-2 overflow-x-auto items-center ml-3 mt-3">
      {items.map((item, index) => (
        <CategoryItem key={index} {...item} icon={iconMap[item.name]} />
      ))}
    </div>
  );
};

export default Categories;
