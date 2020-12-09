import Dashboard from "views/Dashboard.js";
import Products from "views/Products.js";
import Suppliers from "views/supplierOrders.js";
import Notifications from "views/Notifications.js";
import TableList from "views/TableList.js";
import Typography from "views/Typography.js";
import UserProfile from "views/UserProfile.js";

var shopRoutes = [
    {
      path: "/dashboard",
      name: "Dashboard",
      rtlName: "لوحة القيادة",
      icon: "tim-icons icon-chart-pie-36",
      component: Dashboard,
      layout: "/shop"
    },
    {
      path: "/icons",
      name: "Products",
      rtlName: "الرموز",
      icon: "tim-icons icon-atom",
      component: Products,
      layout: "/shop"
    },
    {
      path: "/map",
      name: "Suppliers",
      rtlName: "خرائط",
      icon: "tim-icons icon-pin",
      component: Suppliers,
      layout: "/shop"
    },
    {
      path: "/notifications",
      name: "Notifications",
      rtlName: "إخطارات",
      icon: "tim-icons icon-bell-55",
      component: Notifications,
      layout: "/shop"
    },
    {
      path: "/user-profile",
      name: "User Profile",
      rtlName: "ملف تعريفي للمستخدم",
      icon: "tim-icons icon-single-02",
      component: UserProfile,
      layout: "/shop"
    },
    {
      path: "/tables",
      name: "Table List",
      rtlName: "قائمة الجدول",
      icon: "tim-icons icon-puzzle-10",
      component: TableList,
      layout: "/shop"
    },
    {
      path: "/typography",
      name: "Typography",
      rtlName: "طباعة",
      icon: "tim-icons icon-align-center",
      component: Typography,
      layout: "/shop"
    },
  ];
  export default shopRoutes;