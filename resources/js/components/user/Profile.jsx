import React, { useEffect, useState } from "react";
import { useI18n } from "../../providers/i18n";
import { Button, DatePicker, Form, Input, message, Select } from "antd";
import CustomInput from "../common/form/CustomInput";
import FormInput, { HiddenInput } from "../common/form/input";
import MultipleImageInput from "../common/form/multiImage";
import { useUser } from "../../context/user";
import FormSelect from "../common/form/select";
import { postSingleImage, updateUser } from "../../helpers/backend";
import dayjs from "dayjs";
import { useSite } from "../../context/site";
import { useTitle } from "../../helpers/hooks";

const Profile = () => {
    const i18n = useI18n();
    const { user,setUser, getUser,  } = useUser();
    const [isOther, setIsOther] = useState(false);
    const [form] = Form.useForm();

    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("Profile") + " - " + i18n.t("User"));
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
        const respose = await updateUser(values);
        if (respose?.success) {
            message.success(respose?.message);
            getUser();
        } else {
            message.error(respose?.message);
            getUser();

        }
    };

    const onFinishFailed = (errorInfo) => {};
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
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-secondary mb-6">
                {i18n?.t("Profile Settings")}
            </h1>
            <Form
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                className="adminForm"
            >
                <HiddenInput name="id" />

                {/* Personal Information Section */}
                <div className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2">
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
                                    {
                                        min: 3,
                                        message: i18n?.t(
                                            "Name must be at least 3 characters long"
                                        ),
                                    },
                                    {
                                        max: 50,
                                        message: i18n?.t(
                                            "Name must be at most 50 characters long"
                                        ),
                                    }
                                ]}
                            ></FormInput>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2">
                                {i18n?.t("Email")}
                            </label>
                            <FormInput
                                name="email"
                                readOnly={true}

                            ></FormInput>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2">
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
                            <label className="block text-sm font-medium text-secondary mb-2">
                                {i18n?.t("Image")}
                            </label>
                            <MultipleImageInput name="image" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2">
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
                            <label className="block text-sm font-medium text-secondary mb-2">
                                {i18n?.t("City")}
                            </label>
                            <FormInput name={["address", "city"]}></FormInput>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-secondary mb-2">
                            {i18n?.t("State")}
                        </label>
                        <FormInput name={["address", "state"]}></FormInput>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-secondary mb-2">
                            {i18n?.t("zip")}
                        </label>
                        <FormInput name={["address", "zip"]} type={"number"}></FormInput>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                        {i18n?.t("street")}
                    </label>
                    <FormInput name={["address", "street"]}></FormInput>
                </div>



                {/* Submit Button */}
                <div className="mt-6 text-center">
                    <button
                        type="primary"
                        className="w-full py-3 rounded-md bg-secondary hover:bg-primary text-white font-semibold duration-300"
                    >
                        {i18n?.t("Save Profile")}
                    </button>
                </div>
            </Form>
        </div>
    );
};

export default Profile;
