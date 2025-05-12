import React, { useEffect, useState, useRef } from "react";
import { RiMenuFold3Line, RiMenuFold4Line } from "react-icons/ri";
import { useI18n } from "../../providers/i18n";
import Avatar from "../../components/common/Avatar";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import { FaCog, FaSignOutAlt } from "react-icons/fa";

const Header = ({ collapsed, setCollapsed, user, setUser }) => {
    const navigate = useNavigate();
    const i18n = useI18n();
    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const [defaultLang, setDefaultLang] = useState(null);
    const [lang, setLangId] = useState(null);
    const [openProfile, setOpenProfile] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpenProfile(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        let langId = localStorage.getItem("lang");
        setLangId(langId);
        if (langId) {
            let findLang = i18n?.languages?.docs.find(
                (lang) => lang?._id === langId
            );
            if (findLang) {
                setDefaultLang(findLang?.name);
            }
        } else {
            if (i18n?.languages?.docs?.length > 0) {
                const defaultLanguage = i18n?.languages?.docs.find(
                    (lang) => lang?.default
                );
                setDefaultLang(
                    defaultLanguage?.name || i18n.languages.docs[0]?.name
                );
            }
        }
    }, [i18n?.languages?.docs]);

    // Logout
    const handelLogout = () => {
        setUser({});
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="flex justify-end md:justify-between items-center py-4 pl-4 pr-12 border-b border-[#ddd] bg-teal-blue h-[71px]">
            {/* Sidebar Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="text-2xl duration-300 md:block hidden p-1 text-white bg-transparent cursor-pointer border-[#b7dcff] hover:border-[1px]"
            >
                {collapsed ? <RiMenuFold4Line /> : <RiMenuFold3Line />}
            </button>

            {/* Header Right Section */}
            <div className="flex items-center  justify-center  md:gap-6">
            {/* <Notification user={user} layout={"admin"}/> */}
                <select
                    value={lang || ""}
                    onChange={(e) => {
                        const selectedLang = e.target.value;
                        i18n.changeLanguage(selectedLang); // Update language in i18n
                        localStorage.setItem("lang", selectedLang); // Save to localStorage
                        setLangId(selectedLang); // Update local state
                    }}
                    className="p-2 md:pr-8 border border-gray-300 rounded-lg shadow-md outline-none transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gradient-to-r from-blue-100 to-white hover:bg-blue-50"
                >
                    {i18n?.languages?.docs?.map((lang, index) => (
                        <option key={index} value={lang.id}>
                            {lang.name}
                        </option>
                    ))}
                </select>

                <button className="text-xl p-2 bg-transparent border-none cursor-pointer">
                    <i className="fas fa-bell"></i>
                </button>

                <div className="relative" ref={dropdownRef}>
                    <button
                        className="flex items-center space-x-2 border-none bg-transparent cursor-pointer"
                        onClick={() => setOpenProfile((prev) => !prev)}
                    >
                        {user?.image ? (
                            <img
                                src={user?.image}
                                alt={user?.name}
                                className="w-10 h-10 rounded-full"
                            />
                        ) : (
                            <Avatar
                                name={user?.name}
                                classes="w-10 h-10 rounded-full"
                            />
                        )}
                        <span className="font-medium text-white">
                            {user?.name}
                        </span>
                    </button>

                    <div
                        className={`absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50 ${
                            openProfile ? "block" : "hidden"
                        }`}
                    >
                        <ul className="py-2">
                            <li>
                                <Link
                                    to="/admin/profile"
                                    className="flex items-center gap-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <span>
                                        <FaUser />
                                    </span>{" "}
                                    <span>{i18n?.t("Profile")}</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/settings"
                                    className="flex items-center gap-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <span>
                                        <FaCog />
                                    </span>{" "}
                                    <span>{i18n?.t("Settings")}</span>
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={handelLogout}
                                    className="flex items-center gap-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <span>
                                        <FaSignOutAlt />
                                    </span>{" "}
                                    <span>{i18n?.t("Logout")}</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
