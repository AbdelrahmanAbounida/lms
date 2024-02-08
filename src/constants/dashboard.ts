import { FiHome } from "react-icons/fi";
import { IconType } from "react-icons";
import { FaChartSimple } from "react-icons/fa6";
import { FaList } from "react-icons/fa6";
import { FaRegChartBar } from "react-icons/fa";

export interface SidebarItemProps {
  title: string;
  icon: IconType;
  href: string;
}
export const sidebarTeacherItems: SidebarItemProps[] = [
  {
    title: "Browse",
    href: "/teacher/courses",
    icon: FaList,
  },
  {
    title: "Analytics",
    href: "/teacher/analytics",
    icon: FaChartSimple,
  },
];

export const sidebarStudentItems: SidebarItemProps[] = [
  {
    title: "Home",
    href: "/",
    icon: FiHome,
  },
  {
    title: "Courses",
    href: "/student/courses",
    icon: FaList,
  },
];
