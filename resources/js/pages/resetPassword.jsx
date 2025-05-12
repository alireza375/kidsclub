import React, { useState } from "react";
import { useI18n } from "../providers/i18n";
import { PageHeader } from "../components/common/upperSection";
import { Form, notification } from "antd";
import { useModal } from "../context/modalContext";
import { resetPassword } from "../helpers/backend";
import { useNavigate } from "react-router-dom";
import { useSite } from "../context/site";
import { useTitle } from "../helpers/hooks";
import FormPassword from "../components/common/form/password";

const ResetPassword = () => {

    const i18n = useI18n();
    const [continuing, setContinuing] = useState(false);
    const searchParams = new URLSearchParams(window.location.search);
    const token=searchParams.get('token')
    const { openLoginModal } = useModal();
    const navigate=useNavigate();
    const {sitedata} = useSite();
    useTitle(`${sitedata?.title || "KidStick"} | Reset Password`);
    const handleresetPasswordSubmit = async (value) => {
        try {
            setContinuing(true);
            const res=await resetPassword({
                token:token,
                password:value?.password
            })
            if(res?.success){
                notification.success({message:res?.message});
                await openLoginModal(true);
                navigate('/');
            }
            else{
                notification.error({message:res?.message})

            }
        } catch (error) {
            setContinuing(false);

            notification.error({ message: i18n?.t("Something went wrong") });
        } finally {
            setContinuing(false);
        }
    };

    return (
        <div className="bg-coralred">
            <PageHeader title="Reset-Password" />
            <div className="custom-container py-20 signUpFrom">
                <div className="md:flex flex-col justify-center items-center">
                    <div className="md:max-w-md relative z-10">
                        <h1 className="m:text-2xl text-2xl font-bold mb-4 md:mt-0 mt-5 text-center">
                            {i18n?.t("Reset your password")}?
                        </h1>
                        <p className="text-sm font-normal text-gray-800 mb-6 text-center">
                            {i18n?.t(
                                "Please enter your new password below and reset your password."
                            )}
                        </p>
                        <Form onFinish={handleresetPasswordSubmit}>
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
                                            message:
                                                "Please input your password!",
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
                                                    getFieldValue(
                                                        "password"
                                                    ) === value
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
                            <button
                                type="submit"
                                className="bg-secondary hover:bg-primary duration-300 ease-in-out text-white px-4 py-3 rounded-md w-full"
                                disabled={continuing}
                            >
                                {continuing
                                    ? i18n?.t("Loading")
                                    : i18n?.t("Reset")}
                            </button>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
