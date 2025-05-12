import React, { useEffect, useState } from "react";
import { useI18n } from "../../providers/i18n";
import { Button, Empty, Form, Input, message, Modal } from "antd";
import { useUser } from "../../context/user";
import { deleteChild, fetchChildList, postChild, postSingleImage, updateChild, updateUser } from "../../helpers/backend";
import dayjs from "dayjs";
import FormInput from "../common/form/input";
import FormSelect from "../common/form/select";
import MultipleImageInput from "../common/form/multiImage";
import FormButton from "../common/form/form-button";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useAction, useActionConfirm, useFetch, useTitle } from "../../helpers/hooks";
import { useSite } from "../../context/site";

const Child = () => {
    const i18n = useI18n();
    const { user } = useUser();
    const [form] = Form.useForm();
    const [children, getChildren] = useFetch(fetchChildList);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingChild, setEditingChild] = useState(null);
    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("Child") + " - " + i18n.t("User"));


    // Add or Update Child
    const handleFinish = async (values) => {
        try {
          const newChild = { ...values, id: editingChild?.id };
          // Upload image if necessary
          if (values?.image?.[0]?.originFileObj) {
            let image = {
              file: values?.image?.[0]?.originFileObj,
              image_name: "child_image",
            };
            const { data } = await postSingleImage(image);
            newChild.image = data;
          } else {
            newChild.image = values?.image?.[0]?.url || "";
          }

          await useAction(editingChild ? updateChild : postChild, newChild, () => {
            getChildren();
            setIsModalOpen(false);
            setEditingChild(null);
            form.resetFields();
          });
        } catch (error) {
          message.error(i18n?.t("Failed to save child information."));
        }
      };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingChild(null);
        form.resetFields();
    };

    const handleEdit = (child) => {
        setEditingChild(child);
        setIsModalOpen(true);
        form.setFieldsValue({
            ...child,
            date_of_birth:dayjs(child?.dob),
            image: [{ url: child.image }],
        });
    };

    const handleDelete = (id) => {
        useActionConfirm(deleteChild, { id }, getChildren);
    };

    return (
        <div className="max-w-4xl p-6 mx-auto font-nunito">
            <div className="flex items-center justify-between">
                <h1 className="mb-6 font-bold md:text-3xl text-secondary">
                    {i18n?.t("Children")}
                </h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 text-white transition rounded-md bg-secondary hover:bg-secondary"
                >
                    {i18n?.t("Add Child")}
                </button>
            </div>

            {/* List of Children */}
            <div className="pt-2 mt-2 space-y-4 border-t border-gray-300">
                {children?.docs?.map((child) => (
                    <div
                        key={child.id}
                        className="flex flex-wrap items-center p-6 transition-shadow bg-white border border-gray-300 rounded-lg shadow-lg hover:shadow-xl"
                    >
                        {/* Image Section */}
                        <div className="w-20 h-20 mr-6 overflow-hidden bg-gray-100 rounded-full">
                            <img
                                src={
                                    child.image ||
                                    "https://via.placeholder.com/150?text=No+Image"
                                }
                                alt={child.name}
                                className="object-cover w-full h-full"
                            />
                        </div>

                        {/* Child Details */}
                        <div className="flex-1 space-y-1">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {child.name}
                            </h2>
                            <p className="text-sm text-gray-600">
                                <strong>{i18n?.t("Date of Birth")}:</strong>{" "}
                                {dayjs(child.dob).format(
                                    "YYYY-MM-DD"
                                )}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>{i18n?.t("Relation")}:</strong>{" "}
                                {child.relation_type || "-"}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>{i18n?.t("Total Service")}:</strong>{" "}
                                {child?.total_service || 0}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-shrink-0 space-x-3">
                            <button
                                className="flex items-center justify-center w-10 h-10 text-blue-600 transition bg-blue-100 rounded-full hover:bg-blue-600 hover:text-white"
                                onClick={() => handleEdit(child)}
                            >
                                <FaEdit size={16} />
                            </button>
                            <button
                                className="flex items-center justify-center w-10 h-10 text-red-600 transition bg-red-100 rounded-full hover:bg-red-600 hover:text-white"
                                onClick={() => handleDelete(child.id)}
                            >
                                <FaTrash size={16} />
                            </button>
                        </div>
                    </div>
                ))}
                {children?.docs?.length === 0 && (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={i18n?.t("No Children Found")}
                    />
                )}
            </div>

            <Modal
                title={
                    editingChild
                        ? i18n?.t("Edit Child")
                        : i18n?.t("Add New Child")
                }
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                className="adminForm"
            >
                <Form
                    form={form}
                    onFinish={handleFinish}
                    autoComplete="off"
                    layout="vertical"
                >
                    <FormInput
                        label={i18n?.t("Name")}
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: i18n?.t(
                                    "Please input your child's name!"
                                ),
                            },
                        ]}
                    ></FormInput>

                    <FormInput
                        label={i18n?.t("Date of Birth")}
                        name="date_of_birth"
                        type="date"
                        rules={[
                            {
                                required: true,
                                message: i18n?.t(
                                    "Please select your child's date of birth!"
                                ),
                            },
                        ]}
                    ></FormInput>
                        <div className="Form-select-customization">

                    <FormSelect
                        label={i18n?.t("Relation")}
                        name="relation_type"
                        className={"mb-3"}
                        rules={[
                            {
                                required: true,
                                message: i18n?.t(
                                    "Please select your relation!"
                                ),
                            },
                        ]}
                        options={[
                            { value: "Father", label: i18n?.t("Father") },
                            { value: "Mother", label: i18n?.t("Mother") },
                            { value: "Guardian", label: i18n?.t("Guardian") },
                            { value: "Brother", label: i18n?.t("Brother") },
                            { value: "Sister", label: i18n?.t("Sister") },
                            { value: "Uncle", label: i18n?.t("Uncle") },
                            { value: "Aunt", label: i18n?.t("Aunt") },
                            {
                                value: "Grandfather",
                                label: i18n?.t("Grandfather"),
                            },
                            {
                                value: "Grandmother",
                                label: i18n?.t("Grandmother"),
                            },
                            { value: "Cousin", label: i18n?.t("Cousin") },
                            { value: "Nephew", label: i18n?.t("Nephew") },
                            { value: "Niece", label: i18n?.t("Niece") },
                        ]}
                    ></FormSelect></div>

                    <MultipleImageInput
                        label={i18n?.t("Child Image")}
                        name="image"
                    ></MultipleImageInput>

                    <div className="text-right">
                        <FormButton type="primary" htmlType="submit">
                            {i18n?.t("Save")}
                        </FormButton>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default Child;
