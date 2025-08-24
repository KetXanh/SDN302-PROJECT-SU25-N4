import { FaChartBar, FaCartPlus, FaBox,FaUser} from "react-icons/fa";
import { MdOutlineCategory, MdOutlineManageAccounts  } from "react-icons/md";

export const links = [
  {
    href: "/",
    icon: FaChartBar,
    text: "Trang chủ",
  },
  {
    href: "/category",
    icon: MdOutlineCategory,
    text: "Danh mục",
  },
  {
    href: "/order",
    icon: FaCartPlus,
    text: "Đơn hàng",
  },
  {
    href: "/products",
    icon: FaBox,
    text: "Sản phẩm",
  },
  {
    href: "/customers",
    icon: FaUser,
    text: "Khách Hàng",
  },
  {
    href: "/employee-manager",
    icon: MdOutlineManageAccounts,
    text: "Quản lý nhân viên",
  },
];
