import { Children } from "react";
import ActivitiesList from "../components/user/Activity";
import ChangePassword from "../components/user/ChangePassword";
import Dashboard from "../components/user/Dashboard";
import Events from "../components/user/Events";
import Orders from "../components/user/Orders";
import Profile from "../components/user/Profile";
import Child from "../components/user/Child";
import BuyPackages from "../components/user/buyPackes";
import Notice from "../components/user/notice";

export const UserRoutes = [
    {
        path: "dashboard",
        component: Dashboard
    },
    {
        path: "profile",
        component: Profile
    },
    {
        path: "children",
        component: Child
    },
    {
        path: "address",
        component: Profile
    },
    {
        path: "order-history",
        component: Orders
    },
    {
        path: "change-password",
        component: ChangePassword
    },
    {
        path: "events",
        component: Events
    },
    {
        path: "activity",
        component: ActivitiesList
    },
    {
        path: "service_notice",
        component: Notice
    },
    {
        path:'user_package',
        component:BuyPackages
    }

]
