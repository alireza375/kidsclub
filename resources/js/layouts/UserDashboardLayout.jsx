import React, { useEffect, useState } from "react";
import { FaHandsHoldingChild, FaPeopleGroup, FaTruckArrowRight } from "react-icons/fa6";
import { IoMdInformationCircleOutline, IoMdMenu, IoMdClose } from "react-icons/io";
import { MdEmojiEvents, MdLocalActivity, MdOutlineDashboard } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { IoLogOutOutline } from "react-icons/io5";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { useI18n } from "../providers/i18n";
import { useUser } from "../context/user";
import Skeleton from "react-loading-skeleton";
import UserDashboardSkeleton from "../components/common/skeleton/UserDashboardSkeleton";
import { SlBadge } from "react-icons/sl";
import { message } from "antd";
import { FaBell } from "react-icons/fa";

const UserDashboardLayout = () => {
    const i18n = useI18n();
    const navigate = useNavigate();
    const { user, userLoading, setUser } = useUser();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const menuItems = [
        {
            id: 1,
            name: i18n?.t("Dashboard"),
            href: "/user/dashboard",
            icon: <MdOutlineDashboard />,
        },
        {
            id: 2,
            name: i18n?.t("Services"),
            href: "/user/activity",
            icon: <MdLocalActivity/>,
        }
        ,
        {
            id: 3,
            name: i18n?.t("Service Notices"),
            href: "/user/service_notice",
            icon: <FaBell/>,
        }
        ,
        {
            id: 4,
            name: i18n?.t("Package"),
            href: "/user/user_package",
            icon: <SlBadge/>,
        }
        ,{
            id: 5,
            name: i18n?.t("Events"),
            href: "/user/events",
            icon: <MdEmojiEvents />,
        },
        {
            id: 6,
            name: i18n?.t("Order History"),
            href: "/user/order-history",
            icon: <FaTruckArrowRight />,
        },
        {
            id: 7,
            name: i18n?.t("Children"),
            href: "/user/children",
            icon: <FaHandsHoldingChild />,
        },
        {
            id: 8,
            name: i18n?.t("Profile Settings"),
            href: "/user/profile",
            icon: <ImProfile />,
        },
        {
            id: 9,
            name: i18n?.t("Change Password"),
            href: "/user/change-password",
            icon: <IoMdInformationCircleOutline />,
        },

    ];
    useEffect(() => {
        if (!userLoading && user?.role !== 'user') {
            navigate("/");
        }
    }, [user, userLoading, navigate]);

    return (
        user?.role !== 'user'  ? <UserDashboardSkeleton/> : ( <section className="bg-coralred">
            <div className="custom-container mx-auto px-2 md:px-10 py-10">
                {/* Header Section */}
                <header className="mb-8 flex justify-between items-center md:items-start">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-secondary font-nunito pb-2">
                            {i18n?.t("Welcome")},{" "}
                            <span className="text-2xl sm:text-3xl font-extrabold">
                                { user?.name }
                            </span>
                        </h1>
                        <p className="text-base sm:text-lg font-light text-secondary max-w-2xl">
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
                <div className="relative flex flex-col md:flex-row gap-x-5 bg-white rounded-2xl md:p-5 p-0" >
                    {/* Sidebar */}
                    <aside
                        className={`bg-white rounded-lg shadow-dashboard w-full md:w-[300px] flex-shrink-0 fixed md:static z-[1000] h-full transition-all duration-300 ease-in-out ${
                            isSidebarOpen
                                ? "left-0 top-0 h-full"
                                : "-left-full md:left-0"
                        } flex flex-col justify-between overflow-y-auto no-scrollbar`}
                    >
                        {/* Close button for mobile */}
                        <button
                            className="md:hidden absolute top-4 right-4 text-secondary p-2"
                            onClick={toggleSidebar}
                            aria-label="Close Sidebar"
                        >
                            <IoMdClose className="text-2xl" />
                        </button>

                        {/* Main Menu Items */}
                        <ul className="space-y-4 p-6 md:p-10 mt-10 md:mt-0 ">
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
                                    localStorage.removeItem("token");
                                    message.success("Logged out successfully");
                                    navigate("/");
                                    setUser({});
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
                    <div className="flex-1 overflow-scroll no-scrollbar rounded-2xl shadow-dashboard ">
                        <Outlet />
                    </div>
                </div>
            </div>
        </section>
         )
    );
};

export default UserDashboardLayout;

