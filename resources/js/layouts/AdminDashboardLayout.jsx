import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/user";
import { CiLogout } from "react-icons/ci";

import AdminDashboardSkeleton from "../components/common/skeleton/AdminDashboardSkeleton";
import Sidebar from "./admins/Sidebar";
import Header from "./admins/Header";
import { BiCameraHome } from "react-icons/bi";
import { IoHomeOutline } from "react-icons/io5";

export default function AdminDashboardLayout() {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const { getUser, user, setUser, userLoading } = useUser();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (location.pathname === "/admin") {
            navigate("/admin/dashboard");
        }
        if (!userLoading && user?.role !== "admin") {
            navigate("/");
        }
    }, [user, userLoading, navigate]);

    return user?.role !== "admin" ? (
        <AdminDashboardSkeleton />
    ) : (
        <div className="flex h-screen overflow-hidden">
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                user={user}
            />
            {/* Main Layout */}
            <div className="flex-1 flex flex-col min-w-0 h-full">
                <Header
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    user={user}
                    setUser={setUser}
                />
                {/* Main Content */}
                <div className="flex-1 p-6 bg-white h-full w-full overflow-auto adminForm">
                    <Outlet />
                </div>
                <div className="fixed bottom-6 right-6">
                    <button
                        onClick={() => window.open("/", "_blank")}
                        className="w-14 h-14 rounded-full bg-[#ac918e] text-white text-2xl flex items-center justify-center shadow-lg hover:bg-[#e04d3d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FE5C45]"
                    >
                        <IoHomeOutline />
                    </button>
                </div>
            </div>
        </div>
    );
}
