import { FiHome } from "react-icons/fi";
import { FaRegCompass } from "react-icons/fa6";
import { IconType } from "react-icons";

export interface SidebarItemProps {
  title: string;
  icon: IconType;
  href: string;
}
export const sidebarTeacherItems: SidebarItemProps[] = [
  {
    title: "Home",
    href: "/",
    icon: FiHome,
  },
  {
    title: "Browse",
    href: "/teacher/browse",
    icon: FaRegCompass,
  },
];

export const sidebarStudentItems: SidebarItemProps[] = [
  {
    title: "Home",
    href: "/",
    icon: FiHome,
  },
  {
    title: "Browse",
    href: "/student/browse",
    icon: FiHome,
  },
];
