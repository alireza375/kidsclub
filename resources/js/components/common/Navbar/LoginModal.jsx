import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useModal } from "../../../context/modalContext";
import { useI18n } from "../../../providers/i18n";
import loginImage from "./../../../../images/login.webp";
import { login } from "../../../helpers/backend";
import { useUser } from "../../../context/user";
import { message } from "antd";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginModal = ({ closeLoginModal, handleSignupModalOpen }) => {
    const navigate = useNavigate();
    const i18n = useI18n();
    const { getUser, user, userLoading } = useUser();
    const [showPassword, setShowPassword] = useState(false);
    // login user
    const [loading, setLoading] = useState(false);

    const [loginFormData, setLoginFormData] = useState({
        email: "",
        password: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginFormData({ ...loginFormData, [name]: value });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // check if email and password
        if (!loginFormData.email || !loginFormData.password) {
            message.error("Please enter email and password");
            setLoading(false);
        }
        const { success, message: msg, data } = await login(loginFormData);
        if (success) {
            closeLoginModal();
            if (data?.role === "coach") {
                localStorage.setItem("token", data?.token);
                setLoading(false);
                getUser();
                navigate("/coach/dashboard");
                message.success(msg);
            } else if (data?.role === "admin") {
                setLoading(false);
                localStorage.setItem("token", data?.token);
                getUser();
                navigate("/admin/dashboard");
                message.success(msg);
            } else {
                localStorage.setItem("token", data?.token);
                setLoading(false);
                getUser();
                navigate("/user/dashboard");
                message.success(msg);
            }
            setLoading(false);
        } else {
            message.error(msg);
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="fixed h-screen inset-0 z-[99] flex items-start justify-center bg-black bg-opacity-50 overflow-auto py-11"
            initial={{ opacity: 0 }} // Modal starts as invisible
            animate={{ opacity: 1 }} // Modal becomes visible
            exit={{ opacity: 0 }} // Modal fades out
            transition={{ duration: 0.3 }} // Animation duration
        >
            <motion.div
                className="bg-coralred rounded-lg  shadow-lg border-dashed border-2 border-primary font-nunito text-secondary
        p-3 md:p-10 lg:p-14 relative
        w-[90%] max-w-[872px] sm:w-[80%] md:w-[70%]"
                initial={{ scale: 0.8 }} // Modal starts small
                animate={{ scale: 1 }} // Modal scales to full size
                exit={{ scale: 0.8 }} // Modal shrinks when closing
                transition={{ duration: 0.3 }} // Animation duration
            >
                <button
                    onClick={() => closeLoginModal(true)}
                    className="absolute -top-4  md:-right-4 right-[50%] transform md:translate-x-0 translate-x-1/2 text-xl duration-300 text-white hover:bg-red-600 cursor-pointer p-1 rounded-full bg-red-400 z-10"
                >
                    <RxCross2 />
                </button>
                <div className="md:flex ">
                    <div className="md:w-1/2 relative z-10">
                        <h1 className="m:text-2xl text-xl font-bold  mb-4 md:mt-0 mt-5">
                            {i18n?.t("Welcome, Little Adventure")} !
                        </h1>
                        <h1 className="md:text-2xl font-bold text-gray-800 mb-6">
                            {i18n?.t(
                                "Please share your details to join the fun"
                            )}{" "}
                            !
                        </h1>
                        <form onSubmit={handleLoginSubmit}>
                            <div className="mb-4">
                                <label className="block font-medium mb-2">
                                    {i18n?.t("Email")}
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={loginFormData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border-2 border-transparent  focus:outline-none focus:ring-2 focus:ring-transparent focus:border-primary focus:border-dashed"
                                />
                            </div>
                            <div className="mb-4 relative">
                                <label className="block font-medium mb-2">
                                    {i18n?.t("Password")}
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={loginFormData.password}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border-transparent border-2  focus:outline-none focus:ring-2 focus:ring-transparent focus:border-primary focus:border-dashed"
                                />
                               <div className="absolute right-3 top-12 cursor-pointer text-gray-500 hover:text-gray-900">
                                {showPassword ? <FaEye onClick={() => setShowPassword(false)} /> : <FaEyeSlash onClick={() => setShowPassword(true)} />}
                               </div>
                            </div>
                            <div onClick={()=>{navigate('/forget-password');closeLoginModal(true)}} className=" flex justify-end w-full text-sm text-primary hover:opacity-[0.8] cursor-pointer mb-10">
                                {/* <Link
                                    to={"/forget-password"}

                                > */}
                                    {i18n?.t("Forget Password")}
                                {/* </Link> */}
                            </div>
                            <div className="development-button hidden gap-x-5">
                                <button
                                    type="button"
                                    className="bg-secondary hover:bg-primary duration-300 ease-in-out text-white px-4 py-3 rounded-md w-full mb-6"
                                    onClick={() =>
                                        setLoginFormData({
                                            email: "admin@gmail.com",
                                            password: "123456",
                                        })
                                    }
                                >
                                    {i18n?.t("Admin")}
                                </button>
                                <button
                                    type="button"
                                    className="bg-secondary hover:bg-primary duration-300 ease-in-out text-white px-4 py-3 rounded-md w-full mb-6"
                                    onClick={() =>
                                        setLoginFormData({
                                            email: "coach@gmail.com",
                                            password: "123456",
                                        })
                                    }
                                >
                                    {i18n?.t("Coach")}
                                </button>
                                <button
                                    type="button"
                                    className="bg-secondary hover:bg-primary duration-300 ease-in-out text-white px-4 py-3 rounded-md w-full mb-6"
                                    onClick={() =>
                                        setLoginFormData({
                                            email: "user@gmail.com",
                                            password: "123456",
                                        })
                                    }
                                >
                                    {i18n?.t("User")}
                                </button>
                            </div>

                            <div className="text-center">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`bg-secondary hover:bg-primary duration-300 ease-in-out text-white px-4 py-3 rounded-md w-full mb-6 ${
                                        loading
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    } `}
                                >
                                    {loading
                                        ? i18n.t("Loading")
                                        : i18n.t("Login")}
                                </button>
                                <a className="text-sm text-primary text-center">
                                    {i18n.t("Don't have an account?")}{" "}
                                    <span
                                        className="text-secondary ms-1 hover:text-primary cursor-pointer"
                                        onClick={async () => {
                                            try {
                                                closeLoginModal();
                                                handleSignupModalOpen();
                                            } catch (error) {
                                                console.error(
                                                    "Error closing signup modal:",
                                                    error
                                                );
                                            }
                                        }}
                                    >
                                        {i18n.t("Sign up")}
                                    </span>
                                </a>
                            </div>
                        </form>
                    </div>

                    <div className="md:block hidden absolute right-2 left-[30%] top-0 bottom-10">
                        <img
                            src={loginImage}
                            alt="Login"
                            className="ml-4 object-cover"
                        />
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default LoginModal;
