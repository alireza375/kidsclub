import { Form } from 'antd';
import React, { useEffect, useState } from 'react'
import { useUser } from '../../context/user';
import FormInput, { HiddenInput } from '../common/form/input';
import MultipleImageInput from '../common/form/multiImage';
import { useI18n } from '../../providers/i18n';
import FormButton from '../common/form/form-button';
import { useAction, useTitle } from '../../helpers/hooks';
import { changePassword, postSingleImage, updateUser } from '../../helpers/backend';
import { useSite } from '../../context/site';

const Profile = () => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const {user} = useUser();
    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("Profile") + " - " + i18n.t("Admin"));
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
        useAction(updateUser, values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    const handelPass = (values) => {
        const data = {
            old_password: values.current_password,
            new_password: values.new_password,
            confirm_password: values.confirm_password,
        }
        useAction(changePassword, data);
        form2.resetFields();
    }
    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                name: user.name,
                email: user.email,
                phone: user.phone,
                image: user.image ?
                    [
                        {
                            uid: user.id,
                            name: "Uploaded Image",
                            status: "done",
                            url: user.image,
                        },
                    ]:
                    [],
            });
        }
    }, [user, form]);
  return (
    <div className="p-4 bg-gray-100 min-h-full rounded-md">
    <h1 className="text-2xl font-bold text-secondary mb-6">
        {i18n?.t("Profile Settings")}
    </h1>
    <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
    >
        <HiddenInput name="id" />

        {/* Personal Information Section */}
        <div className="mb-8">
            <h2 className="text-xl font-bold text-primary mb-4">
                {i18n?.t("Personal Information")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                        {i18n?.t("Name")}
                    </label>
                    <FormInput
                        name="name"
                        placeholder={i18n?.t("Enter your name")}
                        required
                    />

                </div>
                <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                        {i18n?.t("Email")}
                    </label>
                    <FormInput
                        name="email"
                        placeholder={i18n?.t("Enter your email")}
                        required
                    />
                     
                   

                </div>
                <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                        {i18n?.t("Phone")}
                    </label>
                    <FormInput
                        name="phone"
                        placeholder={i18n?.t("Enter your phone")}
                        required
                    />

                </div>
                <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                        {i18n?.t("Image")}
                    </label>
                    <MultipleImageInput
                        name="image"
                        required
                    />

                </div>

              
            </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
            <button
                type="primary"
                className="admin-btn"
            >
                {i18n?.t("Save Profile")}
            </button>
        </div>
    </Form>

    {/* Change Password Section */}
    <h2 className="text-2xl font-bold text-primary mb-4 mt-8">
        {i18n?.t("Change Password")}
    </h2>
    

    <Form
        form={form2}
        onFinish={handelPass}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="space-y-6"
    >
        <div className="mb-8">
           
            {/* Current Password */}
            <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                    {i18n?.t("Current Password")}
                </label>
                <FormInput
                name="current_password"
                    rules={[
                        {
                            required: true,
                            message: i18n?.t(
                                "Please input your current password!"
                            ),
                        },
                    ]}
                type={"password"}

                />
            </div>

            {/* New Password */}
            <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                    {i18n?.t("New Password")}
                </label>
               <FormInput
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
                type={"password"}

                />
            </div>

            {/* Confirm New Password */}
            <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                    {i18n?.t("Confirm New Password")}
                </label>
              <FormInput
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
                type={"password"}

                />
            </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 ">
            <button
               className="admin-btn"
            >
                {i18n?.t("Change Password")}
            </button>
        </div>
    </Form>
</div>
  )
}

export default Profile