import { HomeIcon, Users, Mail, FileText, BarChart3, Handshake, Package } from "lucide-react";
import Index from "./pages/Index.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Customers from "./pages/Customers.jsx";
import Inquiries from "./pages/Inquiries.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Profile from "./pages/Profile.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";
import PublicPool from "./pages/PublicPool.jsx";
import Products from "./pages/Products.jsx";
import Quotations from "./pages/Quotations.jsx";

/**
* Central place for defining the navigation items. Used for navigation components and routing.
*/
export const navItems = [
{
    title: "首页",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
},
{
    title: "仪表盘",
    to: "/dashboard",
    icon: <BarChart3 className="h-4 w-4" />,
    page: <Dashboard />,
    protected: true
},
{
    title: "客户管理",
    to: "/customers",
    icon: <Users className="h-4 w-4" />,
    page: <Customers />,
    protected: true
},
{
    title: "公海",
    to: "/public-pool",
    icon: <Handshake className="h-4 w-4" />,
    page: <PublicPool />,
    protected: true
},
{
    title: "询盘管理",
    to: "/inquiries",
    icon: <Mail className="h-4 w-4" />,
    page: <Inquiries />,
    protected: true
},
{
    title: "产品管理",
    to: "/products",
    icon: <Package className="h-4 w-4" />,
    page: <Products />,
    protected: true
},
{
    title: "报价单管理",
    to: "/quotations",
    icon: <FileText className="h-4 w-4" />,
    page: <Quotations />,
    protected: true
},
{
    title: "登录",
    to: "/login",
    page: <Login />,
},
{
    title: "注册",
    to: "/register",
    page: <Register />,
},
{
    title: "忘记密码",
    to: "/forgot-password",
    page: <ForgotPassword />,
},
{
    title: "个人信息",
    to: "/profile",
    page: <Profile />,
    protected: true
},
{
    title: "修改密码",
    to: "/change-password",
    page: <ChangePassword />,
    protected: true
},
];
