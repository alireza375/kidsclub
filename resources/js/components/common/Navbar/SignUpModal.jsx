import React, { useState } from "react";
import { motion } from "framer-motion";
import { RxCross2 } from "react-icons/rx";
import { Form, message } from "antd";
import FormInput from "../form/input";
import PhoneNumberInput from "../form/phoneNumberInput";
import Logo from "./../../../../images/logo.png";
import { useI18n } from "../../../providers/i18n";
import { sendOtp } from "../../../helpers/backend";
import FormPassword from "../form/password";

const SignUpModal = ({setIsSignupModalOpen,openLoginModal,setIsOtpModalOpen,setEmail,setGetEmail,value,setRegistrationValues
}) => {
    const i18n = useI18n();
    const [loading, setLoading] = useState(false);

    const handleSignup = async (values) => {
        setLoading(true);
        if (!!values?.email) {
            setEmail(values?.email);
            const {
                success,
                message: msg,
                data,
            } = await sendOtp({
                email: values?.email,
                phone: values?.phone,
                role: value || "user",
                action: "registration",
            });
            if (success !== true) {
                setLoading(false);
                return message.error(msg);
            } else {
                setLoading(false);
                message.success(`${"OTP sent to"} ${values?.email} `);
                setIsOtpModalOpen(true);
                setGetEmail(values?.email);
                values.role = value || "user";
                setRegistrationValues(values);
            }
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
        w-[90%] max-w-[648px] sm:w-[80%] md:w-[70%] lg:w-[648px]"
        initial={{ scale: 0.8 }} // Modal starts small
        animate={{ scale: 1 }} // Modal scales to full size
        exit={{ scale: 0.8 }} // Modal shrinks when closing
        transition={{ duration: 0.3 }} // Animation duration
    >
                <button
                    onClick={() => setIsSignupModalOpen(false)}
                    className="absolute sm:-top-4 -top-2 right-2  md:-right-4 sm:right-[50%] transform md:translate-x-0 translate-x-1/2 text-xl duration-300 text-white hover:bg-red-600 cursor-pointer p-1 rounded-full bg-red-400 z-10"
                >
                    <RxCross2 />
                </button>
                <div className="signUpFrom">
                    <div className="flex justify-center">
                        <img
                            src={Logo}
                            alt="logo"
                            className="sm:ml-4 ml-2 object-cover md:w-32 w-24 sm:block hidden"
                        />
                    </div>
                    <h1 className="md:text-2xl text-xl  font-bold text-gray-800 sm:my-6 my-2 text-center">
                        {i18n.t("Hey! Let’s get started")}
                    </h1>
                    <Form onFinish={handleSignup}>

                        <div>
                            <h1 className="block font-medium mb-2">
                                {i18n.t("Name")}
                            </h1>
                            <FormInput
                                name="name"
                                placeholder="Name"
                                type="text"
                                className="!p-0"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your Name!",
                                    },
                                ]}
                            />
                        </div>
                        <div>
                            <h1 className="block font-medium mb-2">
                                {i18n.t("Email")}
                            </h1>
                            <FormInput
                                name="email"
                                placeholder="Email"
                                type="email"
                                className=""
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your Email!",
                                    },
                                    {
                                        type: "email",
                                        message:
                                            "Please enter a valid email address",
                                    },
                                ]}
                            />
                        </div>
                        <div>
                            <h1 className="block font-medium mb-2 ">
                                {i18n.t("Phone Number")}
                            </h1>
                            <PhoneNumberInput name="phone" required={true} />
                        </div>
                        <div>
                            <h1 className="block font-medium mb-2">
                                {i18n.t("Password")}
                            </h1>
                            <FormPassword
                                name="password"
                                placeholder="Password"
                                type="password"

                                className=""
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your password!",
                                    },
                                    {
                                        min: 6,
                                        message:
                                            "Password must be at least 6 characters long!",
                                    },
                                ]}
                                hasFeedback
                            />
                        </div>
                        <div>
                            <h1 className="block font-medium mb-2">
                                {i18n?.t("Confirm Password")}
                            </h1>
                            <FormPassword
                                confirm
                                name="confirm_password"
                                placeholder="Confirm Password"
                                type="password"
                                className="border custom-input !mb-10 text-white border-[#D9D9D9] w-full p-4 rounded bg-primary"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please confirm your password!",
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (
                                                !value ||
                                                getFieldValue("password") ===
                                                    value
                                            ) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(
                                                new Error(
                                                    "The passwords do not match!"
                                                )
                                            );
                                        },
                                    }),
                                ]}
                                hasFeedback
                            />
                        </div>
                        <div className="text-center">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-secondary hover:bg-primary duration-300 ease-in-out text-white px-2 sm:px-4 py-2 sm:py-4 rounded-md w-full sm:mb-6 mb-3"
                            >
                                {loading
                                    ? i18n?.t("Loading...")
                                    : i18n?.t("Sign up")}
                            </button>
                            <p className="text-sm text-primary text-center ">
                                {i18n?.t("Already have an account?")}
                                {""}
                                <span
                                    className="text-secondary ms-1 hover:text-primary cursor-pointer"
                                    onClick={async () => {
                                        try {
                                          setIsSignupModalOpen(false);
                                            openLoginModal(true);
                                        } catch (error) {
                                            console.error(
                                                "Error closing signup modal:",
                                                error
                                            );
                                        }
                                    }}
                                >
                                    {i18n?.t("Sign in")}
                                </span>
                            </p>
                        </div>
                    </Form>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default SignUpModal;
