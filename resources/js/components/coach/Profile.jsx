import React, { useEffect, useState } from "react";
import { useI18n } from "../../providers/i18n";
import { Button, DatePicker, Form, Input, message, Select } from "antd";
import CustomInput from "../common/form/CustomInput";
import FormInput, { HiddenInput } from "../common/form/input";
import MultipleImageInput from "../common/form/multiImage";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/user";
import { changePassword, postSingleImage, updateUser } from "../../helpers/backend";
import { useSite } from "../../context/site";
import { useTitle } from "../../helpers/hooks";
import { useModal } from "../../context/modalContext";

const Profile = () => {
    const i18n = useI18n();
    const {openLoginModal} = useModal();
    const {user, setUser} = useUser();
    const [isOther, setIsOther] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("Profile") + " - " + i18n.t("Coach"));
    const onPasswordFinish = async (values) => {
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
    const onFinish = async (values) => {
        if (values?.image?.length > 0) {
            if (values?.image?.[0]?.originFileObj) {
                let image = {
                    file: values?.image?.[0]?.originFileObj,
                    image_name: "user_image",
                };
                const { data } = await postSingleImage(image);
                values.image = data;
            }else{
                values.image = values?.image?.[0]?.url || "";
            }
        }

        // if (values?.children?.length > 0) {
        //     for (let i = 0; i < values?.children?.length; i++) {
        //         if (values?.children[i]?.image?.length > 0) {
        //             if (values?.children[i]?.image?.[0]?.originFileObj) {
        //                 let image = {
        //                     file: values?.children[i]?.image?.[0]
        //                         ?.originFileObj,
        //                     image_name: "user_image",
        //                 };
        //                 const { data } = await postSingleImage(image);
        //                 values.children[i].image = data;
        //             }else{
        //                 values.children[i].image = values?.children[i]?.image?.[0]?.url || "";
        //             }
        //         }
        //     }
        // }

        const respose = await updateUser(values);
        if (respose?.success) {
            message.success(respose?.message);
        } else {
            message.error(respose?.message);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };
    useEffect(() => {
        if (user) {
         // Set form values with processed data
            form.setFieldsValue({
                ...user,
                image: user.image
                    ? [
                          {
                              uid: "-1",
                              name: "image.png",
                              status: "done",
                              url: user.image,
                          },
                      ]
                    : [],
            });
        }
    }, [user]);
    return (
        <div className="max-w-4xl p-6 mx-auto">
            <h1 className="mb-6 text-2xl font-bold text-secondary">
                {i18n?.t("Profile Settings")}
            </h1>
            <Form
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                className="adminForm "
            >
                <HiddenInput name="id" />

                {/* Personal Information Section */}
                <div className="mb-8">
                    <h2 className="mb-4 text-xl font-bold text-secondary">
                        {i18n?.t("Personal Information")}
                    </h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-secondary">
                                {i18n?.t("Name")}
                            </label>
                            <FormInput
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: i18n?.t(
                                            "Please input your name!"
                                        ),
                                    },
                                ]}
                            ></FormInput>
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium text-secondary">
                                {i18n?.t("Email")}
                            </label>
                            <FormInput
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        type: "email",
                                        message: i18n?.t(
                                            "Please input your email!"
                                        ),
                                    },
                                ]}
                                readOnly={true}
                            ></FormInput>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-secondary">
                                {i18n?.t("Phone")}
                            </label>
                            <FormInput
                                name="phone"
                                rules={[
                                    {
                                        required: true,
                                        message: i18n?.t(
                                            "Please input your phone number!"
                                        ),
                                    },
                                ]}
                            ></FormInput>
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium text-secondary">
                                {i18n?.t("Image")}
                            </label>
                            <MultipleImageInput name="image" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-secondary">
                                {i18n?.t("Country")}
                            </label>
                            <FormInput
                                name={["address", "country"]}
                                rules={[
                                    {
                                        required: true,
                                        message: i18n?.t(
                                            "Please input your Country!"
                                        ),
                                    },
                                ]}
                            ></FormInput>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-secondary">
                                {i18n?.t("City")}
                            </label>
                            <FormInput name={["address", "city"]}></FormInput>
                        </div>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-secondary">
                            {i18n?.t("State")}
                        </label>
                        <FormInput name={["address", "state"]}></FormInput>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-secondary">
                            {i18n?.t("zip")}
                        </label>
                        <FormInput name={["address", "zip"]} type={"number"}></FormInput>
                    </div>
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-secondary">
                        {i18n?.t("street")}
                    </label>
                    <FormInput name={["address", "street"]}></FormInput>
                </div>
                <h2 className="mb-4 text-xl font-bold text-secondary">
                        {i18n?.t("Social links")}
                    </h2>
                <div>
                    <label className="block mb-2 text-sm font-medium text-secondary">
                        {i18n?.t("Facebook")}
                    </label>
                    <FormInput placeholder={i18n?.t("https://www.facebook.com/username")} name="facebook"></FormInput>
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-secondary">
                        {i18n?.t("Twitter")}
                    </label>
                    <FormInput placeholder={i18n?.t("https://twitter.com/username")} name="twitter"></FormInput>
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-secondary">
                        {i18n?.t("Linkedin")}
                    </label>
                    <FormInput placeholder={i18n?.t("https://www.linkedin.com/in/username")} name="linkedin"></FormInput>
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-secondary">
                        {i18n?.t("Instagram")}
                    </label>
                    <FormInput placeholder={i18n?.t("https://www.instagram.com/username")} name="instagram"></FormInput>
                </div>

                <h2 className="mb-4 text-xl font-bold text-secondary">
                        {i18n?.t("Coach Details")}
                    </h2>

                <div>
                    <label className="block mb-2 text-sm font-medium text-secondary">
                        {i18n?.t("About")}
                    </label>
                    <FormInput
                        name="about"
                        rules={[
                            {
                                required: true,
                                message: i18n?.t(
                                    "Please input your about!"
                                ),
                            },
                        ]}
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-secondary">
                        {i18n?.t("Education")}
                    </label>
                    <FormInput
                        name="education"
                        rules={[
                            {
                                required: true,
                                message: i18n?.t(
                                    "Please input your education qualification!"
                                ),
                            },
                        ]}
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-secondary">
                        {i18n?.t("Philosophy")}
                    </label>
                    <FormInput
                        name="philosophy"
                        rules={[
                            {
                                required: true,
                                message: i18n?.t(
                                    "Please input your philosophy!"
                                ),
                            },
                        ]}
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-secondary">
                        {i18n?.t("Achievement")}
                    </label>
                    <FormInput
                        name="achievement"
                        rules={[
                            {
                                required: true,
                                message: i18n?.t(
                                    "Please input your achievement!"
                                ),
                            },
                        ]}
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-secondary">
                        {i18n?.t("Description")}
                    </label>
                    <FormInput
                        name="description"
                        rules={[
                            {
                                required: true,
                                message: i18n?.t(
                                    "Please input your description"
                                )+"!",
                            },
                        ]}
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-secondary">
                        {i18n?.t("Experience")}
                    </label>
                    <FormInput
                        name="experience"
                        rules={[
                            {
                                required: true,
                                message: i18n?.t(
                                    "Please input your experience"
                                )+"!",
                            },
                        ]}
                    />
                </div>


                {/* Submit Button */}
                <div className="mt-6 text-center">
                    <button
                        type="primary"
                        className="w-full py-3 font-semibold text-white duration-300 rounded-md bg-secondary hover:bg-primary"
                    >
                        {i18n?.t("Save Profile")}
                    </button>
                </div>
            </Form>



            <Form
                onFinish={onPasswordFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                className="mt-10 space-y-6 adminForm antform"
            >
                <div className="mb-8">
                    <h2 className="mb-4 text-xl font-bold text-secondary">
                        {i18n?.t("Password Settings")}
                    </h2>

                    {/* Current Password */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-secondary">
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
                                className="w-full p-3 border rounded-md"
                            />
                        </Form.Item>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-secondary">
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
                                className="w-full p-3 border rounded-md"
                            />
                        </Form.Item>
                    </div>

                    {/* Confirm New Password */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-secondary">
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
                                className="w-full p-3 border rounded-md"
                            />
                        </Form.Item>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6 text-center">
                    <button
                        type="primary"
                        className="w-full py-3 font-semibold text-white duration-200 rounded-md bg-secondary hover:bg-primary"
                    >
                        {i18n?.t("Change Password")}
                    </button>
                </div>
            </Form>
        </div>
    );
};

export default Profile;
