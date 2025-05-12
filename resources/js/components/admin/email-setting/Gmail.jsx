import React, { useState, useEffect } from "react";
import { Form, Input, Switch } from "antd";
import { useAction } from "../../../helpers/hooks";
import { postEmailSettings } from "../../../helpers/backend";
import { useI18n } from "../../../providers/i18n";
import { Loader } from "../../common/loader";
import FormInput, { HiddenInput } from "../../common/form/input";
import FormButton from "../../common/form/form-button";

const GmailEmailProvider = ({
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
                gmail: {
                    auth_email: settings.gmail?.auth_email,
                    password: settings.gmail?.password,
                    service_provider: settings.gmail?.service_provider,
                },
            });

            if (settings?.default === "gmail") {
                setDefaultEmail("gmail");
                form.setFieldsValue({ default: "gmail" });
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
                host: settings?.sendgrid?.host,
                port: settings?.sendgrid?.port,
                username: settings?.sendgrid?.username,
                password: settings?.sendgrid?.password,
                sender_email: settings?.sendgrid?.sender_email,
            },
            default: defaultEmail,
            gmail: {
                auth_email: values?.gmail?.auth_email,
                password: values?.gmail?.password,
                service_provider: values?.gmail?.service_provider,
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
                        name={["gmail", "auth_email"]}
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
                        name={["gmail", "password"]}
                        label={i18n?.t("Email Password")}
                        className="mt-1"
                        type={"password"}
                        rules={[
                            {
                                required: true,
                                message: i18n?.t(
                                    "Please input email password!"
                                ),
                            },
                        ]}
                    ></FormInput>

                    <FormInput
                        className="mt-1"
                        name={["gmail", "service_provider"]}
                        label={i18n?.t("Service Provider")}
                        rules={[
                            {
                                required: true,
                                message: "Please input service provider!",
                            },
                        ]}
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
                                          <Form.Item
                        name="default"
                        valuePropName="checked"
                    >
                        <Switch
                            checked={defaultEmail === "gmail"}
                            onChange={(checked) => {
                                if (checked) {
                                    setDefaultEmail("gmail");
                                    form.setFieldsValue({
                                        default: "gmail",
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
                    </Form.Item>

                    <div className="relative mt-2">
                        <button type="submit" className="mt-2.5 admin-btn">
                            {i18n?.t("Submit")}
                        </button>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default GmailEmailProvider;
