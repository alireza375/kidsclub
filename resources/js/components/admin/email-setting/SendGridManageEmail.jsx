import React, { useState, useEffect } from "react";
import { Form, Input, Switch } from "antd";
import { useAction } from "../../../helpers/hooks";
import { postEmailSettings } from "../../../helpers/backend";
import { Loader } from "../../common/loader";
import { useI18n } from "../../../providers/i18n";
import FormInput, { HiddenInput } from "../../common/form/input";
import FormButton from "../../common/form/form-button";

const SendGridManageEmail = ({
    settings,
    getSettings,
    loading,
    setCheckedValue,
}) => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [defaultEmail, setDefaultEmail] = useState("");

    useEffect(() => {
        if (settings?.id) {
            form.resetFields();
            form.setFieldsValue({
                ...settings,
                sendgrid: {
                    host: settings?.sendgrid?.host,
                    port: settings?.sendgrid?.port,
                    username: settings?.sendgrid?.username,
                    password: settings?.sendgrid?.password,
                    sender_email: settings?.sendgrid?.sender_email,
                },
            });

            if (settings?.default === "sendgrid") {
                setDefaultEmail("sendgrid");
                form.setFieldsValue({ default: "sendgrid" });
                setCheckedValue(true);
            } else {
                setDefaultEmail("");
                form.setFieldsValue({ default: "" });
                setCheckedValue(false);
            }
        }
    }, [settings]);

    const onFinish = async (values) => {
        const postData = {
            id: values.id,
            sendgrid: {
                host: values?.sendgrid?.host,
                port: values?.sendgrid?.port,
                username: values?.sendgrid?.username,
                password: values?.sendgrid?.password,
                sender_email: values?.sendgrid?.sender_email,
            },
            default: defaultEmail,
            gmail: {
                auth_email: settings?.gmail?.auth_email,
                password: settings?.gmail?.password,
                service_provider: settings?.gmail?.service_provider,
            },
            other: {
                host: settings?.other?.host,
                port: settings?.other?.port,
                address: settings?.other?.address,
                password: settings?.other?.password,
                provider_name: settings?.other?.provider_name,
            },
        };
        return useAction(postEmailSettings, { ...postData }, () => {
            getSettings();
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[300px]">
                <Loader />
            </div>
        );
    }

    return (
        <div className="pt-0">
            <Form
                form={form}
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
            >
                <div className="p-3">
                    <HiddenInput name="id" />
                    <FormInput
                        name={["sendgrid", "host"]}
                        label={i18n?.t("Email Host")}
                        rules={[
                            {
                                required: true,
                                message: i18n?.t("Please input email host!"),
                            },
                        ]}
                        className="mt-1"
                    ></FormInput>
                    <FormInput
                        name={["sendgrid", "port"]}
                        label={i18n?.t("Email Port")}
                        rules={[
                            {
                                required: true,
                                message: i18n?.t("Please input email port!"),
                            },
                        ]}
                        className="mt-1"
                    ></FormInput>
                    <FormInput
                        name={["sendgrid", "username"]}
                        label={i18n?.t("Email Username")}
                        rules={[
                            {
                                required: true,
                                message: i18n?.t(
                                    "Please input email username!"
                                ),
                            },
                        ]}
                        className="mt-1"
                    ></FormInput>
                    <FormInput
                        name={["sendgrid", "password"]}
                        label={i18n?.t("Email Password")}
                        type={"password"}
                        rules={[
                            {
                                required: true,
                                message: i18n?.t(
                                    "Please input email password!"
                                ),
                            },
                        ]}
                        className="mt-1"
                    ></FormInput>
                    <FormInput
                        name={["sendgrid", "sender_email"]}
                        label={i18n?.t("Sender Email")}
                        rules={[
                            {
                                required: true,
                                message: i18n?.t("Please input sender email!"),
                            },
                        ]}
                        className="mt-1"
                    ></FormInput>

                    <Form.Item
                        name="default"
                        valuePropName="checked"
                        rules={[
                            {
                                validator: (_, value) =>
                                    value
                                        ? Promise.resolve()
                                        : Promise.reject(
                                              new Error(
                                                  "Please toggle the switch!"
                                              )
                                          ),
                            },
                        ]}
                    >
                        <Switch
                            checked={defaultEmail === "sendgrid"}
                            onChange={(checked) => {
                                if (checked) {
                                    setDefaultEmail("sendgrid");
                                    form.setFieldsValue({
                                        default: "sendgrid",
                                    });
                                    setCheckedValue(true);
                                } else {
                                    setDefaultEmail("");
                                    form.setFieldsValue({ default: "" });
                                    setCheckedValue(false);
                                }
                            }}
                            checkedChildren={
                                <span className="text-white">
                                    {i18n?.t("On")}
                                </span>
                            }
                            unCheckedChildren={
                                <span className="text-white">
                                    {i18n?.t("Off")}
                                </span>
                            }
                        />
                    </Form.Item>

                    <div className="relative">
                        <button type="submit" className="mt-2.5 admin-btn">
                            {i18n?.t("Submit")}
                        </button>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default SendGridManageEmail;
