import React from "react";
import { useI18n } from "../../providers/i18n";
import { Button, Form, Input, message } from "antd";
import { changePassword } from "../../helpers/backend";
import { useNavigate } from "react-router-dom";
import { useSite } from "../../context/site";
import { useTitle } from "../../helpers/hooks";
import { useModal } from "../../context/modalContext";
import { useUser } from "../../context/user";

const ChangePassword = () => {
    const navigate  = useNavigate();
    const {user,setUser} = useUser();
    const { openLoginModal } = useModal();
    const i18n = useI18n();
    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("Change Password") + " - " + i18n.t("User"));
    const onFinish = async (values) => {
        const data = {
            old_password: values.current_password,
            new_password: values.new_password,
            confirm_password: values.confirm_password,
        }
       const {message : msg,success} = await changePassword(data);                                                   
       if (success === true) {
        message.success(msg);
        localStorage.removeItem("token");
        navigate("/");
        setUser(null);
        openLoginModal();
        }else{
            message.error(msg);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Password Change Failed:", errorInfo);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-secondary mb-6">
                {i18n?.t("Change Password")}
            </h1>

            <Form
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                className="space-y-6 adminForm antform"
            >
                <div className="mb-8">
                    {/* Current Password */}
                    <div>
                        <label className="block text-sm font-medium text-secondary mb-2">
                            {i18n?.t("Current Password")}
                        </label>
                        <Form.Item
                            name="current_password"
                            rules={[
                                {
                                    required: true,
                                    message: i18n?.t(
                                        "Please input your current password!"
                                    ),
                                },
                            ]}
                        >
                            <Input.Password
                                placeholder={i18n?.t("Enter your current password")}
                                className="w-full border rounded-md p-3"
                            />
                        </Form.Item>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium text-secondary mb-2">
                            {i18n?.t("New Password")}
                        </label>
                        <Form.Item
                            name="new_password"
                            rules={[
                                {
                                    required: true,
                                    message: i18n?.t(
                                        "Please input your new password!"
                                    ),
                                },
                                {
                                    min: 6,
                                    message: i18n?.t("Password must be at least 6 characters"),
                                },
                            ]}
                        >
                            <Input.Password
                                placeholder={i18n?.t("Enter your new password")}
                                className="w-full border rounded-md p-3"
                            />
                        </Form.Item>
                    </div>

                    {/* Confirm New Password */}
                    <div>
                        <label className="block text-sm font-medium text-secondary mb-2">
                            {i18n?.t("Confirm New Password")}
                        </label>
                        <Form.Item
                            name="confirm_password"
                            dependencies={['new_password']}
                            rules={[
                                {
                                    required: true,
                                    message: i18n?.t(
                                        "Please confirm your new password!"
                                    ),
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('new_password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error(i18n?.t("The two passwords do not match!"))
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                placeholder={i18n?.t("Confirm your new password")}
                                className="w-full border rounded-md p-3"
                            />
                        </Form.Item>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6 text-center">
                    <button
                        type="primary"
                        className="w-full py-3 rounded-md text-white font-semibold bg-secondary hover:bg-primary/80 duration-200"
                    >
                        {i18n?.t("Change Password")}
                    </button>
                </div>
            </Form>
        </div>
    );
};

export default ChangePassword;
