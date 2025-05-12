import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { FaRegHeart, FaRegUser, FaTimes } from "react-icons/fa";
import { message, Skeleton } from "antd";
import { useI18n } from "../../providers/i18n";
import { useUser } from "../../context/user";
import { FiLogOut, FiSettings, FiShoppingCart } from "react-icons/fi";
import { IoMdMenu } from "react-icons/io";
import FloatingLanguageSelector from "./FloatingSettingsPanel";
import Avatar from "./Avatar";
import { useSite } from "../../context/site";
import { useModal } from "../../context/modalContext";
import LoginModal from "./Navbar/LoginModal";
import SignUpModal from "./Navbar/SignUpModal";
import OtpModal from "./Navbar/OtpModal";

const navLinks = [
    {
        title: "Home",
        link: "/",
    },
    { title: "Service", link: "/service" },
    { title: "Shop", link: "/shop" },
    { title: "Events", link: "/event" },
    { title: "Package", link: "/package" },
    {
        title: "More",
        subLists: [
            { title: "Blog", link: "/blog" },
            { title: "About", link: "/about" },
            { title: "Gallery", link: "/gallery" },
            { title: "Contact", link: "/contact" },
            { title: "Privacy Policy", link: "/privacy-policy" },
            { title: "Terms & Conditions", link: "/terms-and-conditions" },
        ],
    },
];
const Navbar = () => {
    const { openLoginModal, isLoginModalOpen, closeLoginModal } = useModal();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [value, setValue] = useState("user");
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const { getUser, user, userLoading } = useUser();
    const [email, setEmail] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [getEmail, setGetEmail] = useState("");
    const [registrationValues, setRegistrationValues] = useState({});
    const i18n = useI18n();
    const { languages } = i18n;
    const {
        cartdata,
        currencies,
        currency,
        changeCurrency,
        wishlistQuantity,
        sitedata,
    } = useSite();
    const handleDropdownToggle = (index) => {
        setOpenDropdown(openDropdown === index ? null : index);
    };

    const handleSignupModalOpen = () => {
        setIsSignupModalOpen(true);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".dropdown-container")) {
                setIsDropdownOpen(false);
            }
        };
        document?.addEventListener("click", handleClickOutside);
        return () => document?.removeEventListener("click", handleClickOutside);
    }, []);

    const handleLogout = () => {
        try {
            localStorage?.removeItem("token");
            message?.success("Logged out successfully");
            getUser();
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <nav className="relative py-3 bg-opacity-50 shadow-md bg-navbar z-[999]">
            <FloatingLanguageSelector
                currencies={currencies}
                currentCurrency={currency}
                onCurrencySelect={(c) => {
                    changeCurrency(c);
                }}
                languages={languages}
                currentLanguage={i18n?.lang}
                onLanguageSelect={(langCode) => {
                    i18n.changeLanguage(langCode);
                }}
            />

            <div className="mx-auto custom-container ">
                <div className="flex items-center justify-between h-16">
                    <div className="flex">
                        <Link
                            className="flex items-center flex-shrink-0"
                            to="/"
                        >
                            {/* Replace with your logo */}
                            <img
                                src={sitedata?.logo}
                                className="sm:w-[100px] w-[80px]"
                            />
                        </Link>
                    </div>
                    <div className="hidden lg:ml-6 lg:flex lg:space-x-8 font-poppins">
                        {navLinks.map((item) => (
                            <div key={item.title} className="relative group">
                                {item?.subLists ? (
                                    <button className="inline-flex items-center px-1 pt-1 text-lg font-semibold text-secondary hover:text-primary font-nunito">
                                        {i18n?.t(item?.title)}
                                        <svg
                                            className="w-4 h-4 ml-2"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </button>
                                ) : (
                                    <Link
                                        to={item?.link}
                                        className={`relative hover:text-primary inline-flex items-center px-1 pt-1 text-lg font-semibold font-nunito before:content-[''] before:absolute before:left-0 before:bottom-0 before:w-0 before:h-[2px] before:bg-primary before:transition-all before:duration-300 hover:before:w-full ${
                                            location?.pathname === item?.link
                                                ? "text-primary before:w-full"
                                                : "text-secondary"
                                        }`}
                                    >
                                        {i18n?.t(item?.title)}
                                    </Link>
                                )}
                                {item?.subLists && (
                                    <div className="absolute left-0 z-10 invisible w-48 mt-2 transition-all duration-300 bg-white rounded-md shadow-lg opacity-0 ring-1 ring-black ring-opacity-5 group-hover:opacity-100 group-hover:visible">
                                        <div
                                            className="py-1"
                                            role="menu"
                                            aria-orientation="vertical"
                                            aria-labelledby="options-menu"
                                        >
                                            {item?.subLists.map((subItem) => (
                                                <Link
                                                    key={subItem?.title}
                                                    to={subItem.link}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                                    role="menuitem"
                                                >
                                                    {i18n?.t(subItem.title)}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-1 sm:gap-3">
                        {!user ? (
                            userLoading ? (
                                <div className="flex items-center gap-2">
                                    {" "}
                                    <Skeleton.Avatar
                                        active={true}
                                        size={"large"}
                                        shape={"circle"}
                                    />
                                    <Skeleton.Avatar
                                        active={true}
                                        size={"large"}
                                        shape={"circle"}
                                    />
                                    <Skeleton.Avatar
                                        active={true}
                                        size={"large"}
                                        shape={"circle"}
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <button
                                        className="border-secondary  hover:bg-secondary duration-300 ease-in-out hover:text-white border-[2px] font-nunito sm:text-lg text-md   text-secondary sm:px-4  px-2 py-1 font-medium flex items-center"
                                        onClick={openLoginModal} // Open Modal on click
                                    >
                                        {i18n?.t("Login")}
                                    </button>
                                    <button
                                        className=" border-secondary  hover:bg-secondary duration-300 ease-in-out hover:text-white border-[2px] font-nunito sm:text-lg text-md text-secondary  sm:px-4  px-2 py-1 font-medium flex items-center"
                                        onClick={handleSignupModalOpen}
                                    >
                                        {i18n?.t("Signup")}
                                    </button>
                                </div>
                            )
                        ) : (
                            <div className="relative flex items-center ml-3 gap-x-4">
                                {user?.role !== "coach" &&
                                    user?.role !== "admin" && (
                                        <>
                                            <ActionIcon
                                                to="/wishlist"
                                                icon={<FaRegHeart />}
                                                label="Wishlist"
                                                count={wishlistQuantity}
                                            />
                                            <ActionIcon
                                                to="/cart"
                                                icon={<FiShoppingCart />}
                                                label="Cart"
                                                count={
                                                    cartdata?.products.length ||
                                                    0
                                                }
                                            />
                                        </>
                                    )}

                                {/* User Profile Dropdown */}
                                <div className="relative dropdown-container">
                                    <div
                                        className="cursor-pointer"
                                        aria-label="User Profile"
                                        onClick={() =>
                                            setIsDropdownOpen((prev) => !prev)
                                        }
                                    >
                                        {user?.image ? (
                                            <img
                                                src={user?.image}
                                                alt="User"
                                                className="object-cover w-10 h-10 rounded-full"
                                            />
                                        ) : (
                                            <Avatar
                                                name={user?.name}
                                                classes="w-10 h-10"
                                                bgColor="bg-secondary"
                                            />
                                        )}
                                    </div>

                                    {/* Dropdown Menu */}
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 z-50 w-48 mt-2 transition-all duration-300 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                            <div
                                                className="py-2"
                                                role="menu"
                                                aria-orientation="vertical"
                                            >
                                                {/* Profile */}
                                                <Link
                                                    to={
                                                        user?.role === "admin"
                                                            ? "/admin/profile"
                                                            : user?.role ===
                                                              "coach"
                                                            ? "/coach/profile"
                                                            : "/user/profile"
                                                    }
                                                    className="block px-4 py-2 text-sm text-gray-700 transition duration-200 rounded-md hover:bg-gray-100 hover:text-gray-900"
                                                    role="menuitem"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <FaRegUser className="text-gray-500" />
                                                        <span>
                                                            {i18n.t("Profile")}
                                                        </span>
                                                    </div>
                                                </Link>

                                                {/* Dashboard */}
                                                <Link
                                                    to={
                                                        user?.role === "admin"
                                                            ? "/admin/dashboard"
                                                            : user?.role ===
                                                              "coach"
                                                            ? "/coach/dashboard"
                                                            : "/user/dashboard"
                                                    }
                                                    className="block px-4 py-2 text-sm text-gray-700 transition duration-200 rounded-md hover:bg-gray-100 hover:text-gray-900"
                                                    role="menuitem"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <FiSettings className="text-gray-500" />
                                                        <span>
                                                            {i18n.t(
                                                                "Dashboard"
                                                            )}
                                                        </span>
                                                    </div>
                                                </Link>

                                                {/* Logout */}
                                                <div
                                                    onClick={handleLogout}
                                                    className="block px-4 py-2 text-sm text-gray-700 transition duration-200 rounded-md cursor-pointer hover:bg-gray-100 hover:text-gray-900"
                                                    role="menuitem"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <FiLogOut className="text-gray-500" />
                                                        <span>
                                                            {i18n?.t("Logout")}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        <div className="flex items-center -mr-2 lg:hidden">
                            <button
                                onClick={() =>
                                    setMobileMenuOpen(!mobileMenuOpen)
                                }
                                className="inline-flex items-center justify-center p-2 rounded-md text-secondary ring-secondary hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Open main menu</span>
                                {mobileMenuOpen ? (
                                    <FaTimes className="text-2xl" />
                                ) : (
                                    <IoMdMenu className="text-2xl" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="lg:hidden">
                    <div className="pt-2 pb-3 space-y-1 custom-container">
                        {navLinks.map((item, index) => (
                            <div key={item.title}>
                                {item.subLists ? (
                                    <>
                                        <button
                                            onClick={() =>
                                                handleDropdownToggle(index)
                                            }
                                            className="flex justify-between w-full px-3 py-2 text-base font-medium text-left text-gray-700 rounded-md hover:text-primary"
                                        >
                                            {i18n?.t(item.title)}
                                            <svg
                                                className="w-4 h-4 ml-2"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </button>
                                        {openDropdown === index && (
                                            <div className="pl-10">
                                                {item.subLists.map(
                                                    (subItem) => (
                                                        <Link
                                                            onClick={() =>
                                                                setMobileMenuOpen(
                                                                    false
                                                                )
                                                            }
                                                            key={subItem.title}
                                                            to={subItem.link}
                                                            className="block px-3 py-2 text-sm text-gray-600 rounded-md hover:text-primary"
                                                        >
                                                            {subItem.title}
                                                        </Link>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        onClick={() => setMobileMenuOpen(false)}
                                        to={item.link || "#"}
                                        className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-primary"
                                    >
                                        {item.title}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {isLoginModalOpen && (
                <LoginModal
                    closeLoginModal={closeLoginModal}
                    handleSignupModalOpen={handleSignupModalOpen}
                />
            )}
            {isOtpModalOpen && (
                <OtpModal
                    setIsOtpModalOpen={setIsOtpModalOpen}
                    setIsSignupModalOpen={setIsSignupModalOpen}
                    getEmail={getEmail}
                    registrationValues={registrationValues}
                    openLoginModal={openLoginModal}
                />
            )}

            {isSignupModalOpen && (
                <SignUpModal
                    setIsSignupModalOpen={setIsSignupModalOpen}
                    openLoginModal={openLoginModal}
                    setIsOtpModalOpen={setIsOtpModalOpen}
                    setGetEmail={setGetEmail}
                    setEmail={setEmail}
                    setRegistrationValues={setRegistrationValues}
                    value={value}
                />
            )}
        </nav>
    );
};

export default Navbar;
const ActionIcon = ({ to, icon, label, count }) => (
    <Link to={to} className="relative" aria-label={label}>
        <div className="text-white text-lg bg-secondary rounded-full p-[10px] cursor-pointer hover:bg-primary transition-all duration-300">
            {icon}
        </div>
        {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary !text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {count}
            </span>
        )}
    </Link>
);
