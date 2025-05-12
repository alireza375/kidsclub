import React, { useEffect, useState } from "react";
import {
    FaBloggerB,
} from "react-icons/fa6";
import {
    IoMdMenu,
    IoMdClose,
} from "react-icons/io";
import {
    MdNotificationsNone,
    MdOutlineDashboard,
} from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import { NavLink, useNavigate, Outlet, Link } from "react-router-dom";
import { useI18n } from "../providers/i18n";
import { CiCircleList } from "react-icons/ci";
import CoachDashboardSkeleton from "../components/common/skeleton/CoachDashboardSkeleton";
import { useUser } from "../context/user";
import Avatar from "../components/common/Avatar";
import { FaUser, FaUserAltSlash } from "react-icons/fa";
import { message } from "antd";

const CoachDashboardLayout = () => {
    const i18n = useI18n();
    const { user, userLoading, setUser } = useUser();
    const navigate = useNavigate();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };
    useEffect(() => {
        if(location.pathname === '/coach') {
            navigate('/coach/dashboard')
        }
        
    }, [user, userLoading, navigate]);
    useEffect(() => {
        if (!userLoading && user?.role !== 'coach') {
            navigate("/");
        }
    }, [user, userLoading, navigate]);
    const menuItems = [
        {
            id: 1,
            name: i18n?.t("Dashboard"),
            href: "/coach/dashboard",
            icon: <MdOutlineDashboard />,
        },
        {
            id: 2,
            name: i18n?.t("Members"),
            href: "/coach/members",
            icon: <CiCircleList />,
        },
        {
            id: 3,
            name: i18n?.t("Service List"),
            href: "/coach/services",
            icon: <MdNotificationsNone />,
        },
        {
            id: 5,
            name: i18n?.t("Blog"),
            href: "/coach/blogs",
            icon: <FaBloggerB />,
        },
        {
            id: 6,
            name: i18n?.t("Profile Settings"),
            href: "/coach/profile",
            icon: <FaUser />,
        },
    ];

    return (
        user?.role !== "coach" ? <CoachDashboardSkeleton /> : <section className="bg-coralred min-h-screen">
            <div className="custom-container mx-auto px-10 sm:px-6 lg:px-8 py-10">
                {/* Header Section */}
                <header className="mb-8 flex justify-between items-center md:items-start">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-secondary font-nunito pb-2">
                            {i18n?.t("Welcome")},{" "}
                            <span className="text-2xl sm:text-3xl font-extrabold">
                                {i18n?.t("Coach")}
                            </span>
                        </h1>
                        <p className="text-base sm:text-lg font-light text-secondary md:max-w-2xl">
                            {i18n?.t(
                                "We're so excited to have you here! This is your special space to explore, play, and keep track of all the cool things you're doing."
                            )}
                        </p>
                    </div>

                    {/* Hamburger Button for Small Screens */}
                    <button
                        className="block md:hidden bg-secondary text-white p-2 rounded-lg text-2xl"
                        onClick={toggleSidebar}
                        aria-label="Toggle Sidebar"
                    >
                        {isSidebarOpen ? <IoMdClose /> : <IoMdMenu />}
                    </button>
                </header>

                {/* Main Content */}
                <div className="relative flex flex-col md:flex-row bg-white rounded-2xl">
                    {/* Sidebar */}
                    <aside
                        className={`bg-white rounded-lg shadow-dashboard w-full md:w-[300px] flex-shrink-0 fixed md:static z-[1000] h-full transition-all duration-300 ease-in-out ${
                            isSidebarOpen
                                ? "left-0 top-0 h-full"
                                : "-left-full md:left-0"
                        } md:h-[calc(100vh-8rem)] flex flex-col justify-between overflow-y-auto no-scrollbar`}
                    >
                        {/* Close button for mobile */}
                        <button
                            className="md:hidden absolute cursor-pointer top-4 right-4 text-secondary p-2 z-50"
                            onClick={toggleSidebar}
                            aria-label="Close Sidebar"
                        >
                            <IoMdClose className="text-2xl" />
                        </button>
                        <div className="flex flex-col items-center py-10 relative">
                            {/* Profile Image */}
                            <div className="md:size-[120px] size-[100px] rounded-full p-1 border-secondary border-2">
                            {user?.image ? <img
                                className="h-full w-full rounded-full object-cover"
                                src={user?.image}
                                alt="User"
                            /> : <Avatar classes="w-full h-full rounded-full lg:text-[50px] text-[30px]" name="John Doe"></Avatar>}
                            </div>
                            <h1 className="lg:text-xl font-semibold font-nunito text-secondary py-2">
                                {i18n?.t("Hi") }, {user?.name}
                            </h1>
                            <p className=" font-semibold font-nunito text-secondary">{i18n?.t("Coach") }</p>
                           
                        </div>

                        {/* Main Menu Items */}
                        <ul className="space-y-4 p-6 md:p-5 mt-0 md:mt-0 ">
                            {menuItems.map((item) => (
                                <li key={item.id}>
                                    <NavLink
                                        to={item.href}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 p-4 text-lg font-semibold rounded-lg ${
                                                isActive
                                                    ? "bg-secondary text-white"
                                                    : "text-secondary hover:bg-secondary hover:text-white"
                                            } transition duration-300`
                                        }
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <span className="text-2xl">
                                            {item.icon}
                                        </span>
                                        <span>{item.name}</span>
                                    </NavLink>
                                </li>
                            ))}
                        </ul>

                        {/* Sidebar Footer Links */}
                        <div className="space-y-4 p-6 md:p-10">
                            <button
                                onClick={() => {
                                    localStorage?.removeItem("token");
                                    setUser({});
                                    message?.success("Logged out successfully");
                                    navigate("/");
                                }}
                                className="flex items-center gap-3 text-secondary hover:text-primary transition duration-150"
                                aria-label="Logout"
                            >
                                <span className="text-2xl">
                                    <IoLogOutOutline />
                                </span>
                                <span className="text-lg font-semibold">
                                    {i18n?.t("Logout")}
                                </span>
                            </button>
                        </div>
                    </aside>

                    {/* Backdrop for Small Screens */}
                    {isSidebarOpen && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
                            onClick={toggleSidebar}
                        ></div>
                    )}

                    {/* Content Section */}
                    <main className="flex-1 md:p-5 p-0 overflow-scroll bg-white rounded-lg  max-h-[calc(100vh-9rem)] no-scrollbar">
                        <Outlet />
                    </main>
                </div>
            </div>
        </section>
    );
};

export default CoachDashboardLayout;
