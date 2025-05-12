import React, { useState, useEffect } from "react";
import { Form, Input, Select, Switch } from "antd";
const { Option } = Select;

import { useI18n } from "../../../providers/i18n";
import { Loader } from "../../common/loader";
import FormInput, { HiddenInput } from "../../common/form/input";
import FormButton from "../../common/form/form-button";
import { useAction } from "../../../helpers/hooks";
import { postEmailSettings } from "../../../helpers/backend";

const OtherProviderManageEmail = ({
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
                other: {
                    address: settings?.other?.address,
                    host: settings?.other?.host,
                    password: settings?.other?.password,
                    port: settings?.other?.port,
                    provider_name: settings?.other?.provider_name,
                },
            });

            if (settings?.default === "other") {
                setDefaultEmail("other");
                form.setFieldsValue({ default: "other" });
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
            other: {
                address: values?.other?.address,
                host: values?.other?.host,
                password: values?.other?.password,
                port: values?.other?.port,
                provider_name: values?.other?.provider_name,
            },
            default: defaultEmail,
            sendgrid: {
                host: settings?.sendgrid?.host,
                port: settings?.sendgrid?.port,
                username: settings?.sendgrid?.username,
                password: settings?.sendgrid?.password,
                sender_email: settings?.sendgrid?.sender_email,
            },
            gmail: {
                auth_email: settings?.gmail?.auth_email,
                password: settings?.gmail?.password,
                service_provider: settings?.gmail?.service_provider,
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
                        name={["other", "host"]}
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
                        name={["other", "port"]}
                        label={"Email Port"}
                        rules={[
                            {
                                required: true,
                                message: i18n?.t("Please input email port!"),
                            },
                        ]}
                        className="mt-1"
                    ></FormInput>

                    <FormInput
                        name={["other", "address"]}
                        label={"Email Address"}
                        rules={[
                            {
                                required: true,
                                message: i18n?.t("Please input email address!"),
                            },
                        ]}
                        className="mt-1"
                    ></FormInput>

                    <FormInput
                        name={["other", "password"]}
                        label={"Email Password"}
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

                    <Form.Item
                        name={["other", "provider_name"]}
                        label={i18n?.t("Service Provider")}
                        rules={[
                            {
                                required: true,
                                message: i18n?.t(
                                    "Please select a service provider!"
                                ),
                            },
                        ]}
                    >
                        <Select
                            placeholder={i18n?.t(
                                "Please select a service provider"
                            )}
                            allowClear
                            className="w-full mb-10"
                        >
                            <Option value="gmail">{i18n?.t("Gmail")}</Option>
                            <Option value="sendgrid">
                                {i18n?.t("SendGrid")}
                            </Option>
                            <Option value="mailgun">
                                {i18n?.t("Mailgun")}
                            </Option>
                            <Option value="sparkpost">
                                {i18n?.t("Sparkpost")}
                            </Option>
                            <Option value="other">{i18n?.t("Other")}</Option>
                        </Select>
                    </Form.Item>

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
                            checked={defaultEmail === "other"}
                            onChange={(checked) => {
                                if (checked) {
                                    setDefaultEmail("other");
                                    form.setFieldsValue({
                                        default: "other",
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

export default OtherProviderManageEmail;
