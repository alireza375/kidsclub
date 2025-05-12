import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../providers/i18n";
import {
    FaCoffee,
    FaHome,
    FaMailBulk,
    FaBars,
    FaTimes,
    FaWrench,
    FaPen,
    FaFileAlt,
    FaCog,
    FaImages,
    FaQuestionCircle,
    FaComment,
    FaPhoneAlt,
    FaDollarSign,
    FaTag,
    FaEnvelope,
    FaCalendarAlt,
    FaShoppingCart,
    FaBoxOpen,
} from "react-icons/fa";
import { FaLanguage, FaQuestion, FaUsers } from "react-icons/fa6";
import { MdLocalActivity, MdOutlineDashboard, MdOutlinePayments, MdSmartToy } from "react-icons/md";
import { useSite } from "../../context/site";
import { PiNewspaperClipping } from "react-icons/pi";

const Sidebar = ({ collapsed, setCollapsed }) => {
    const i18n = useI18n();
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const { sitedata } = useSite();
    // Dynamic menu items for the sidebar (same as previous implementation)
    const menuItems = [
        {
            key: 1,
            label: i18n?.t("Overview"),
            path: "/admin/dashboard",
            icon: <MdOutlineDashboard />,
        },
        {
            key: 2,
            label: i18n?.t("Service"),
            path: "/admin/service",
            icon: <MdLocalActivity />,
        },
        {
            key: 3,
            label: i18n?.t("Package"),
            path: "/admin/packages",
            icon: <FaBoxOpen />,
        },
        {
            key: 4,
            label: i18n?.t("Coach"),
            path: "/admin/coachs",
            icon: <FaUsers />,
        },
        {
            key: 5,
            label: i18n?.t("Users"),
            path: "/admin/users",
            icon: <FaUsers />,
        },
        {
            key: 6,
            label: i18n?.t("Product"),
            path: "/admin/product",
            icon: <MdSmartToy />,
        },
        {
            key: 7,
            label: i18n?.t("Coupons"),
            path: "/admin/coupons",
            icon: <FaTag />,
        },
        {
            key: 8,
            label: i18n?.t("Orders"),
            path: "/admin/orders",
            icon: <FaShoppingCart />,
        },
        {
            key: 9,
            label: i18n?.t("Events"),
            path: "/admin/events",
            icon: <FaCalendarAlt />,
        },
        {
            key: 10,
            label: i18n?.t("Blog"),
            path: "/admin/blogs",
            icon: <FaPen />,
        },
        
        {
            key: 11,
            label: i18n?.t("Contact"),
            path: "/admin/contacts",
            icon: <FaPhoneAlt />,
        },
        {
            key: 12,
            label: i18n?.t("Testimonial"),
            path: "/admin/testimonials",
            icon: <FaComment />,
        },
        {
            key: 13,
            label: i18n?.t("Gallery"),
            path: "/admin/gallery",
            icon: <FaImages />,
        },
        {
            key: 14,
            label: i18n?.t("FAQ"),
            path: "/admin/faq",
            icon: <FaQuestionCircle />,
        },
        {
            key:15,
            label:i18n.t("NewsLetter"),
            path:"/admin/newsletter",
            icon:<PiNewspaperClipping/>

        },
        {
            key: 16,
            label: i18n?.t("Currency"),
            path: "/admin/currencies",
            icon: <FaDollarSign />,
        },
        {
            key: 17,
            label: i18n?.t("Payment Methods"),
            path: "/admin/payment-methods",
            icon: <MdOutlinePayments />,
        },
       
        {
            key: 18,
            label: i18n?.t("Language"),
            path: "/admin/languages",
            icon: <FaLanguage />,
        },
        {
            key: 19,
            label: i18n?.t("Mail Settings"),
            path: "/admin/mail-settings",
            icon: <FaEnvelope />,
        },
        {
            key: 20,
            label: i18n?.t("Settings"),
            path: "/admin/settings",
            icon: <FaCog />,
        },

        {
            key: 21,
            label: i18n?.t("Advertisement"),
            path: "/admin/advertisement",
            icon: <FaWrench />,
        },
        {
            key: 22,
            label: i18n?.t("Page Settings"),
            path: "/admin/page-settings",
            icon: <FaFileAlt />,
        },
    ];

    // Render desktop sidebar
    const renderDesktopSidebar = () => (
        <div
            className={`transition-all duration-500 ease-in-out text-white h-screen ${
                collapsed ? "w-20" : "w-60"
            } bg-teal-blue flex flex-col md:-w-20 hidden md:flex`}
        >
            {/* Logo Section */}
            <div className="text-center relative font-bold py-3 min-h-[70px]">
                <div
                    className={`absolute flex justify-center items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full transition-opacity duration-500 ease-in-out ${
                        collapsed ? "opacity-100" : "opacity-0"
                    }`}
                >
                   {sitedata?.logo ? <img
                        className="w-16 ml-5"
                        src={sitedata?.logo}
                        alt="Logo"
                    />
                    :
                    <h1 className="text-sm">{sitedata?.title}</h1>
                    }
                </div>
                <div
                    className={`absolute flex justify-center items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full transition-opacity duration-500 ease-in-out ${
                        collapsed ? "opacity-0" : "opacity-100"
                    }`}
                >
                   {sitedata?.logo ? <img
                        className="w-20 ml-5"
                        src={sitedata?.logo}
                        alt="Logo"
                    />
                    :
                    <h1 className="text-xl">{sitedata?.title}</h1>
                    }
                </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
                {menuItems.map((item) => (
                    <Link
                        to={item.path}
                        key={item.key}
                        className={`relative flex items-center space-x-4 text-lg px-5 ml-1 py-4 rounded-lg transition-all rounded-s-full ease-in-out ${
                            location.pathname === item.path
                                ? "bg-white text-teal-blue active-link"
                                : "text-white hover:bg-white hover:text-teal-blue"
                        } group`}
                    >
                        <div className="text-xl">{item.icon}</div>
                        <span
                            className={`whitespace-nowrap font-nunito ${
                                collapsed
                                    ? "opacity-0 w-0 overflow-hidden"
                                    : "opacity-100 w-auto"
                            } transition-all ease-in-out`}
                        >
                            {item?.label}
                        </span>
                        <>
                            <span
                                className={`absolute top-[-20px] right-0 w-5 h-5 bg-transparent rounded-br-full transition-all ease-in-out ${
                                    location.pathname === item.path
                                        ? "opacity-100"
                                        : "opacity-0 group-hover:opacity-100"
                                }`}
                                style={{
                                    boxShadow: "3.5px 3.5px 0 3.5px white",
                                }}
                            ></span>
                            <span
                                className={`absolute bottom-[-20px] right-0 w-5 h-5 bg-transparent rounded-tr-full transition-all ease-in-out ${
                                    location.pathname === item.path
                                        ? "opacity-100"
                                        : "opacity-0 group-hover:opacity-100"
                                }`}
                                style={{
                                    boxShadow: "3.5px -3.5px 0 3.5px white",
                                }}
                            ></span>
                        </>
                    </Link>
                ))}
            </div>
        </div>
    );

    // Render mobile drawer
    const renderMobileDrawer = () => (
        <>
            {/* Mobile Hamburger Button */}
            <button
                onClick={() => setMobileDrawerOpen(true)}
                className="md:hidden fixed top-4 left-4 z-50 text-white"
            >
                <FaBars size={24} />
            </button>

            {/* Mobile Drawer Overlay */}
            {mobileDrawerOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setMobileDrawerOpen(false)}
                />
            )}

            {/* Mobile Drawer */}
            <div
                className={`fixed top-0 bottom-0 left-0 h-full w-64 bg-teal-blue text-white transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
                    mobileDrawerOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Close Button */}
                <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className=" text-white"
                >
                    <FaTimes size={24} />
                </button>

                {/* Logo */}
                <div className="text-center py-4 font-bold">
                {sitedata?.logo ? <img
                        className="w-20 ml-5"
                        src={sitedata?.logo}
                        alt="Logo"
                    />
                    :
                    <h1 className="text-xl">{sitedata?.title}</h1>
                    }
                </div>

                {/* Mobile Menu Items */}
                <div className=" overflow-y-auto h-full pb-20 no-scrollbar">
                    {menuItems.map((item) => (
                        <Link
                            to={item.path}
                            key={item.key}
                            onClick={() => setMobileDrawerOpen(false)}
                            className={`flex items-center space-x-4 text-lg px-5 py-4 transition-colors ${
                                location.pathname === item.path
                                    ? "bg-white text-teal-blue"
                                    : "hover:bg-white hover:text-teal-blue"
                            }`}
                        >
                            <div className="text-xl">{item.icon}</div>
                            <span className="whitespace-nowrap font-nunito">
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );

    return (
        <>
            {renderDesktopSidebar()}
            {renderMobileDrawer()}
        </>
    );
};

export default Sidebar;
