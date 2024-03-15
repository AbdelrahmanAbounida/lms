import { FiHome } from "react-icons/fi";
import { IconType } from "react-icons";
import { FaChartSimple } from "react-icons/fa6";
import { FaList } from "react-icons/fa6";
import { FaRegChartBar } from "react-icons/fa";
import { IoMdCreate } from "react-icons/io";

export interface SidebarItemProps {
  title: string;
  icon: IconType;
  href: string;
}
export const sidebarTeacherItems: SidebarItemProps[] = [
  {
    title: "My Courses",
    href: "/teacher/all",
    icon: FaList,
  },
  {
    title: "New Course",
    href: "/teacher/course/create",
    icon: IoMdCreate,
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
    href: "/student/browse",
    icon: FaList,
  },
];
