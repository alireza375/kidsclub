import Notice from "../components/admin/service/Notice";
import Blog from "../components/coach/Blogs";
import Dashboard from "../components/coach/Dashboard";
import Events from "../components/coach/Events";
import Members from "../components/coach/Members";
import Profile from "../components/coach/Profile";
import ServiceList from "../components/coach/ServiceList";


export const CoachRoutes = [
    {
        path: "dashboard",
        component: Dashboard
    },
    {
        path: "blogs",
        component: Blog
    },
    {
        path: "services",
        component: ServiceList
    },
    {
        path: "profile",
        component: Profile
    },
    {
        path: "members",
        component: Members
    },
    {
        path: "notice/:id",
        component: Notice
    }
    
    
]