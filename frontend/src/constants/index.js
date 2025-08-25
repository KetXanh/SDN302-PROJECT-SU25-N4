import { FaChartBar, FaCartPlus, FaBox,FaUser,FaTag} from "react-icons/fa";
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
    href: "/customer",
    icon: FaUser,
    text: "Khách Hàng",
  },
  {
    href: "/employee-manage",
    icon: MdOutlineManageAccounts,
    text: "Quản lý nhân viên",
    role: "Admin"
  },
  {
    href: "/statistic",
    icon: FaChartBar,
    text: "Thống kê",
    role: "Admin"
  },
  {
    href: "/discount",
    icon: FaTag,
    text: "Mã giảm giá",
  },
];
