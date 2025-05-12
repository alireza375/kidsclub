import { Form } from "antd";
import React, { useEffect, useState } from "react";
import { useI18n } from "../../../providers/i18n";
import FormInput, { HiddenInput } from "../../common/form/input";
import JodiEditor from "../../common/form/jodiEditor";
import MultipleImageInput from "../../common/form/multiImage";
import FormButton from "../../common/form/form-button";
import FormSelect from "../../common/form/select";
import { noSelected } from "../../../helpers/utils";
import { postEvent, postSingleImage, updateEvent } from "../../../helpers/backend";
import { useAction } from "../../../helpers/hooks";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const EventForm = ({ isEdit = false, data = null }) => {
    const navigate = useNavigate();
    const { languages, langCode, t } = useI18n();
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [selectedLang, setSelectedLang] = useState(langCode);
    const [isPaidEvent, setIsPaidEvent] = useState(false);

    // Populate form values when editing
    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                ...data,
                image: data.image
                    ? [
                          {
                              uid: "-1",
                              name: "image.png",
                              status: "done",
                              url: data.image,
                          },
                      ]
                    : [],
                organizer: {
                    ...data.organizer,
                    image: data.organizer?.image
                        ? [
                              {
                                  uid: "-1",
                                  name: "organizer.png",
                                  status: "done",
                                  url: data.organizer.image,
                              },
                          ]
                        : [],
                },
                event_date: dayjs(data.event_date, "YYYY-MM-DD")
            });
            setIsPaidEvent(data?.type === "paid");
        }
    }, [data, form]);

    // Handle image uploads
    const handleImageUpload = async (file, imageName) => {
        const { data } = await postSingleImage({ file, image_name: imageName });
        return data;
    };

    // set language
    useEffect(() => {
        setSelectedLang(langCode)
    }, [langCode])
    // Form submission
    const handleSubmit = async (values) => {
        try {
            // Handle event image upload
            if (values.image?.[0]?.originFileObj) {
                values.image = await handleImageUpload(
                    values.image[0].originFileObj,
                    "event"
                );
            } else {
                values.image = values.image?.[0]?.url || "";
            }

            // Handle organizer image upload
            if (values.organizer?.image?.[0]?.originFileObj) {
                values.organizer.image = await handleImageUpload(
                    values.organizer.image[0].originFileObj,
                    "organizer"
                );
            } else {
                values.organizer.image =
                    values.organizer?.image?.[0]?.url || "";
            }
            values.event_date = dayjs(values.event_date).format('YYYY-MM-DD')
            values.price = isPaidEvent ? parseFloat(values.price) : 0;
            values.discount_value = isPaidEvent ? parseFloat(values.discount_value) : 0;
            await useAction(isEdit ? updateEvent : postEvent, values, () => {
                form.resetFields();
                navigate("/admin/events");
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
                className="adminForm mt-5"
                onValuesChange={handleFormChange}
            >
                {/* Multilingual Inputs */}
                <div className="space-y-4">{  languages?.docs?.map((l, index) => (
            <div
                key={index}
                className={`transition-all duration-300 ${
                    l.code === selectedLang ? "block" : "hidden"
                }`}
            >
                <div className="grid md:grid-cols-2 gap-4">
                    <FormInput
                        label={i18n?.t("Event Title")}
                        name={["title", l.code]}
                        required
                        placeholder={i18n?.t("Enter event title in")}
                    />
                    <FormInput
                        label={i18n?.t("Category")}
                        name={["category", l.code]}
                        required
                        placeholder={i18n?.t("Enter category in")}
                    />
                </div>
                <div className="mt-4">
                    <JodiEditor
                        label={i18n?.t("Event Description")}
                        name={["description", l.code]}
                        required
                        placeholder={i18n?.t("Write event description in")}
                    />
                </div>
            </div>
        ))}</div>
                {isEdit && (
                    <HiddenInput name="id"  />
                )}
                {/* Event Details */}
                <div className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                        <FormInput
                            label={i18n?.t("Event Date")}
                            name="event_date"
                            type="date"
                            required
                        />
                        <FormInput
                            label={i18n?.t("Start Time")}
                            name="start_time"
                            type="time"
                            required
                        />
                        <FormInput
                            label={i18n?.t("End Time")}
                            name="end_time"
                            type="time"
                            required
                        />
                    </div>
                    <FormInput
                        label={i18n?.t("Location")}
                        name="location"
                        required
                        placeholder={i18n?.t("Enter event location")}
                    />
                </div>

                {/* Event Type */}
                <div className="grid md:grid-cols-2 gap-4 mt-10">
                <div className="Form-select-customization">
                 <FormSelect
                        label={i18n?.t("Event Type")}
                        name="type"
                        options={[
                            { value: "free", label: i18n?.t("Free") },
                            { value: "paid", label: i18n?.t("Paid") },
                        ]}
                    /></div>
                </div>

                {/* Paid Event Fields */}
                {isPaidEvent && (
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                        <FormInput
                            label={i18n?.t("Entry Fee")}
                            name="price"
                            type="number"
                            required
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                        />
                        <div className="Form-select-customization">
                         <FormSelect
                            label={i18n?.t("Discount Type")}
                            name="discount_type"
                            options={[
                                { value: "percentage", label: i18n?.t("Percent") },
                                { value: "fixed", label: i18n?.t("Fixed") },
                            ]}
                        /></div>
                        <FormInput
                            label={i18n?.t("Discount Value")}
                            name="discount"
                            type="number"
                            placeholder={i18n?.t("Discount amount")}
                            min="0"
                        />
                    </div>
                )}

                {/* Images */}
                <div className="mt-6 space-y-4">
                    <MultipleImageInput
                        name="image"
                        label={i18n?.t("Event Images")}
                        required
                    />
                </div>

                {/* Organizer Details */}
                <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        {i18n?.t("Organizer Information")}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormInput
                            label={i18n?.t("Organizer Name")}
                            name={["organizer", "name"]}
                            required
                            placeholder={i18n?.t("Enter organizer name")}
                        />
                        <MultipleImageInput
                            name={["organizer", "image"]}
                            label={i18n?.t("Organizer Image")}
                            required
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-start">
                    <button
                    className="admin-btn"
                        type="submit"
                        onClick={() => noSelected({ form, setSelectedLang })}
                    >
                        {isEdit ? i18n?.t("Update Event") : i18n?.t("Create Event")}
                    </button>
                </div>
            </Form>
        </div>
    );
};

export default EventForm;
