import { Form, Select } from "antd";
import React, { use, useEffect, useState } from "react";
import { useI18n } from "../../../providers/i18n";
import FormInput, { HiddenInput } from "../../common/form/input";
import JodiEditor from "../../common/form/jodiEditor";
import MultipleImageInput from "../../common/form/multiImage";
import FormButton from "../../common/form/form-button";
import FormSelect from "../../common/form/select";
import { noSelected } from "../../../helpers/utils";
import {
    fetchCoaches,
    postEvent,
    postService,
    postSingleImage,
    updateEvent,
    updateService,
} from "../../../helpers/backend";
import { useAction, useFetch } from "../../../helpers/hooks";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const ServiceForm = ({ isEdit = false, data = null }) => {
    const [coaches,getCoaches] = useFetch(fetchCoaches)
    const navigate = useNavigate();
    const { languages, langCode } = useI18n();
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [selectedLang, setSelectedLang] = useState(langCode);

    // Populate form values when editing
    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                ...data,
                instructor_id: data?.instructor?.id,
                image: data.image
                    ? [
                          {
                              uid: "-1",
                              name: "image.png",
                              status: "done",
                              url: data.image,
                          },
                      ]
                    : []
            });
        }
    }, [data, form]);

    useEffect(() => {
        getCoaches()
    }, [])

    // Handle image uploads
    const handleImageUpload = async (file, imageName) => {
        const { data } = await postSingleImage({ file, image_name: imageName });
        return data;
    };

    // set language
    useEffect(() => {
        setSelectedLang(langCode);
    }, [langCode]);
    // Form submission
    const handleSubmit = async (values) => {
        try {
            // Handle event image upload
            if (values.image?.[0]?.originFileObj) {
                values.image = await handleImageUpload(
                    values.image[0].originFileObj,
                    "service"
                );
            } else {
                values.image = values.image?.[0]?.url || "";
            }

            // Handle organizer image upload

            values.event_date = dayjs(values.event_date).format("YYYY-MM-DD");
            values.price = parseFloat(values.price);
            values.discount_value =parseFloat(values.discount_value);
            await useAction(isEdit ? updateService : postService, values, () => {
                form.resetFields();
                navigate("/admin/service");
            });
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    // Handle form value changes
    const handleFormChange = (changedValues) => {
        if (changedValues.type) {
            setIsPaidEvent(changedValues.type === "paid");
        }
    };

    return (
        <div>
            {/* Language Switcher */}
            <div className="flex flex-wrap justify-start gap-3 mt-10">
                {languages?.docs?.map((l, index) => (
                    <button
                        onClick={() => setSelectedLang(l.code)}
                        className={`rounded-full px-3 py-1 text-sm font-medium transition-colors duration-200 ${
                            l.code === selectedLang
                                ? "bg-teal-blue text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                        key={index}
                    >
                        {l.name}
                    </button>
                ))}
            </div>

            {/* Form */}
            <Form
                layout="vertical"
                form={form}
                onFinish={handleSubmit}
                className="mt-5 space-y-10 adminForm"
                onValuesChange={handleFormChange}
            >
                {/* Multilingual Inputs */}
                <div className="p-6 border rounded-lg shadow-md bg-gray-50">
                    <h2 className="mb-4 text-lg font-semibold text-secondary">
                        {i18n?.t("Service")}
                    </h2>
                    <div className="space-y-4">
                        {languages?.docs?.map((l, index) => (
                            <div
                                key={index}
                                className={`transition-all duration-300 ${
                                    l.code === selectedLang ? "block" : "hidden"
                                }`}
                            >
                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormInput
                                        label={`${i18n?.t("Name")} (${l.name})`}
                                        name={["name", l.code]}
                                        required
                                        placeholder={i18n?.t("Enter Service name")}
                                    />
                                    <FormInput
                                        label={`${i18n?.t("Title")} (${l.name})`}
                                        name={["title", l.code]}
                                        required
                                        placeholder={i18n?.t("Enter Service title")}
                                    />
                                    <FormInput
                                        label={`${i18n?.t("Category")} (${l.name})`}
                                        name={["category", l.code]}
                                        required
                                        placeholder={i18n?.t("Enter category")}
                                    />
                                </div>
                                <div className="mt-4">
                                    <JodiEditor
                                        label={`${i18n?.t("Description")} (${l.name})`}
                                        name={["description", l.code]}
                                        required
                                        placeholder={i18n?.t(
                                            "Write Service description"
                                        )}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Event Details Section */}
                <div className="p-6 border rounded-lg shadow-md bg-gray-50">
                    <h2 className="mb-4 text-lg font-semibold text-secondary">
                        {i18n?.t("Service Details")}
                    </h2>
                    {isEdit && (
                        <HiddenInput
                            name="id"
                        />
                    )}
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="Form-select-customization">
                        <FormSelect
                            label={i18n?.t("Coach")}
                            name={"instructor_id"}
                            className={'!mb-1'}
                            required
                            options={coaches?.docs?.map((cat) => ({
                                label: cat?.name,
                                value: cat?.id,
                            }))}
                        /></div>
                        <FormInput
                            label={`${i18n?.t("Session")} (Ex: 3 weeks) `}
                            name="session"
                            required
                        />
                        <FormInput
                            label={i18n?.t("Duration")}
                            name="duration"
                            required
                        />
                        <FormInput
                            label={i18n?.t("Capacity")}
                            name="capacity"
                            type="number"
                            required
                        />
                    </div>
                </div>

                {/* Pricing Section */}
                <div className="p-6 border rounded-lg shadow-md bg-gray-50">
                    <h2 className="mb-4 text-lg font-semibold text-secondary">
                        {i18n?.t("Pricing Details")}
                    </h2>
                    <div className="grid gap-4 md:grid-cols-3">
                        <FormInput
                            label={i18n?.t("Cost")}
                            name="price"
                            type="number"
                            required
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                        />
                        <FormSelect
                            label={i18n?.t("Discount Type")}
                            name="discount_type"
                            className={'!pb-3'}
                            options={[
                                { value: "percentage", label: i18n?.t("Percent") },
                                { value: "fixed", label: i18n?.t("Fixed") },
                            ]}
                        />
                        <FormInput
                            label={i18n?.t("Discount Value")}
                            name="discount"
                            type="number"
                            placeholder={i18n?.t("Discount amount")}
                            min="0"
                        />
                    </div>
                </div>

                {/* Images Section */}
                <div className="p-6 border rounded-lg shadow-md bg-gray-50">
                    <h2 className="mb-4 text-lg font-semibold text-secondary">
                        {i18n?.t("Service Image")}
                    </h2>
                    <MultipleImageInput
                        name="image"
                        label={i18n?.t("Upload Service Image")}
                        required
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                    className="admin-btn"
                        type="submit"
                        onClick={() => noSelected({ form, setSelectedLang })}
                    >
                        {isEdit ? i18n?.t("Update Service") : i18n?.t("Create Service")}
                    </button>
                </div>
            </Form>
        </div>
    );
};


export default ServiceForm;
