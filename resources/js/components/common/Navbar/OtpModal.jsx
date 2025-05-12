import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RxCross2 } from "react-icons/rx";
import { Form, message, notification } from "antd";
import { registration, sendOtp, verifyOtp } from "../../../helpers/backend";
import { useI18n } from "../../../providers/i18n";
import OTPInput from "react-otp-input";
import { useTimer } from "use-timer";
import { useNavigate } from "react-router-dom";

const OtpModal = ({
    setIsOtpModalOpen,
    setIsSignupModalOpen,
    getEmail,
    registrationValues,
    openLoginModal,
    forgetAction,
}) => {
    const [loading, setLoading] = useState(false);
    const i18n = useI18n();
    const navigate = useNavigate();
    // For OTP Timer
    const { time, start, pause, reset } = useTimer({
        initialTime: 120,
        timerType: "DECREMENTAL",
    });

    useEffect(() => {
        if (getEmail) {
            start();
        }
        if (time === 0) pause();
    }, [time, start, pause, getEmail]);

    return (
        <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                className="bg-coralred p-10 rounded-lg shadow-lg border-dashed border-2 border-primary font-nunito text-secondary md:p-14 relative"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                transition={{ duration: 0.3 }}
            >
                <button
                    onClick={() => setIsOtpModalOpen(false)}
                    className="absolute -top-4 md:-right-4 right-[50%] transform md:translate-x-0 translate-x-1/2 text-xl duration-300 text-white hover:bg-red-600 cursor-pointer p-1 rounded-full bg-red-400 z-10"
                >
                    <RxCross2 />
                </button>
                <div className="md:flex">
                    <Form
                        name="basic"
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={async (values) => {

                            setLoading(true);
                            if (values?.otp) {
                                const payload = {
                                    ...registrationValues,
                                    otp: values.otp,
                                };
                                if (forgetAction) {
                                    payload.action = "forgot_password";
                                }
                                const postMethod = forgetAction
                                    ? verifyOtp
                                    : registration;
                                const {
                                    success,
                                    message: msg,
                                    message,
                                    data,
                                } = await postMethod(payload);
                                if (!success) {
                                    setLoading(false);
                                    return notification.error({
                                        message: msg || message,
                                    });
                                }
                                if (success && !data?.role) {
                                    navigate(
                                        `/reset-password?token=${data?.token}`
                                    );
                                    notification.success({ message: message });
                                } else {
                                    setLoading(false);
                                    setIsOtpModalOpen(false);
                                    setIsSignupModalOpen(false);
                                    notification.success({ message: message });

                                    // Redirect based on role
                                    const { role, token } = data;
                                    localStorage.setItem("token", token);
                                    if (role === "coach") navigate("/coach");
                                    else if (role === "admin")
                                        navigate("/admin/dashboard");
                                    else {
                                        navigate("/");
                                        getUser();
                                    }
                                }
                            }else{
                                setLoading(false);
                                return message.error("Please enter OTP");
                            }

                        }}
                    >
                        <div className="w-full flex flex-col items-center">
                            <h1 className="text-2xl font-bold text-center">
                                {i18n?.t("Check your email")}
                                <span className="text-primary ms-1">
                                    {getEmail}
                                </span>
                            </h1>
                            <Form.Item name="otp" className="my-8">
                                <OTPInput
                                    numInputs={4}
                                    renderInput={(props) => (
                                        <input {...props} />
                                    )}
                                    inputStyle={{
                                        width: "50px",
                                        height: "48px",
                                        marginRight: "1rem",
                                        fontSize: "20px",
                                        border: "1px solid #F79C39",
                                        outline: "none",
                                        borderRadius: "8px",
                                    }}
                                />
                            </Form.Item>
                            <p className="dark:text-White_Color capitalize mt-6 mb-2 md:text-sm text-xs font-poppins">
                                {i18n?.t("Didn't receive the code?")}{" "}
                                {time === 0 ? (
                                    <span
                                        className={`text-primary cursor-pointer ${
                                            loading
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                        }`}
                                        onClick={async () => {
                                            if (!loading) {
                                                setLoading(true);
                                                try {
                                                    const {
                                                        success,
                                                        message: msg,
                                                    } = await sendOtp({
                                                        email: getEmail,
                                                        action: forgetAction
                                                            ? forgetAction
                                                            : "registration",
                                                    });
                                                    if (success) {
                                                        message.success(msg);
                                                        reset();
                                                        start();
                                                    } else {
                                                        message.error(msg);
                                                    }
                                                } catch (error) {
                                                    console.error(
                                                        "Error resending OTP:",
                                                        error
                                                    );
                                                    message.error(
                                                        "Failed to resend OTP. Please try again."
                                                    );
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }
                                        }}
                                    >
                                        {loading
                                            ? i18n?.t("Resending...")
                                            : i18n?.t("Resend")}
                                    </span>
                                ) : (
                                    <span className="text-primary">
                                        {i18n?.t("Resend in")} {time} {"s"}
                                    </span>
                                )}
                            </p>
                            <button
                                disabled={loading}
                                className="bg-secondary text-white w-full !text-lg py-[14px] rounded-md mt-2 button_paragraph hover:bg-primary duration-300"
                            >
                                {loading
                                    ? i18n?.t("Verifying...")
                                    : i18n?.t("Verify")}
                            </button>
                            <p className="md:text-sm text-xs font-poppins mt-6">
                                {i18n.t("Already have an account?")}{" "}
                                <button
                                    className="text-primary cursor-pointer"
                                    onClick={async () => {
                                        try {

                                             setIsOtpModalOpen(false);
                                             setIsSignupModalOpen && setIsSignupModalOpen(false);
                                           openLoginModal(true);
                                        } catch (error) {
                                            console.error(
                                                "Error closing login modal:",
                                                error
                                            );
                                        }
                                    }}
                                >
                                    {i18n?.t("Sign in now")}
                                </button>
                            </p>
                        </div>
                    </Form>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default OtpModal;
