import React, { useEffect, useState } from "react";
import { Modal, Collapse, Form, message, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import FormButton from "../../common/form/form-button";
import FormInput, { HiddenInput } from "../../common/form/input";
import { useI18n } from "../../../providers/i18n";
import { columnFormatter, noSelected } from "../../../helpers/utils";
import { deleteServiceFaq, postServiceFaq } from "../../../helpers/backend";

const FAQModal = ({ isVisible, onClose, faqs, onAddFAQ, onDeleteFAQ, serviceId }) => {
    const [form] = Form.useForm();
    const i18n = useI18n();
    const { languages, langCode } = i18n;
    const [selectedLang, setSelectedLang] = useState(langCode);

    // Handle adding a new FAQ
    const handleAddFAQ = async (values) => {
        if (!selectedLang) {
            return message.error(i18n.t("Please select a language."));
        }

        const payload = {
            question: values.question,
            answer: values.answer,
            service_id: serviceId,
            isActive: true,
        };

        try {
            await postServiceFaq(payload);
            onAddFAQ(payload);
            form.resetFields();
            message.success(i18n.t("FAQ added successfully!"));
        } catch (error) {
            message.error(i18n.t("Failed to add FAQ. Please try again."));
        }
    };

    // Handle deleting an FAQ
    const handleDeleteFAQ = async (id, index) => {
        try {
            await deleteServiceFaq({ service_id: serviceId, id });
            onDeleteFAQ(index);
            message.success(i18n.t("FAQ deleted successfully!"));
        } catch (error) {
            message.error(i18n.t("Failed to delete FAQ. Please try again."));
        }
    };

    // Render language selector buttons
    const renderLanguageSelector = () => (
        <div className="flex flex-wrap justify-start gap-3 mt-4 ">
            {languages?.docs?.map((lang, index) => (
                <button
                    key={index}
                    onClick={() => setSelectedLang(lang.code)}
                    className={`rounded-full px-3 py-1 text-sm font-medium transition-colors duration-200 ${
                        lang.code === selectedLang
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    {lang.name}
                </button>
            ))}
        </div>
    );

    // Render the collapse items
    const renderCollapseItems = () =>
        faqs.map((faq, index) => ({
            key: index.toString(),
            label: (
                <div className="flex justify-between items-center">
                    <span>{columnFormatter(faq?.question)}</span>
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFAQ(faq?.id, index);
                        }}
                    />
                </div>
            ),
            children: <p>{columnFormatter(faq?.answer)}</p>,
        }));

    useEffect(() => {
        setSelectedLang(langCode);
    }, [langCode]);

    return (
        <Modal
            open={isVisible}
            onCancel={onClose}
            footer={null}
            centered
            width={700}
            className="adminForm"
        >
            <div className="space-y-6 font-nunito">
                {/* Modal Title */}
                <h2 className="text-2xl font-semibold text-center">
                    {i18n.t("FAQ Management")}
                </h2>

                {/* FAQ List */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{i18n.t("FAQs")}</h3>
                    {faqs.length > 0 ? (
                        <Collapse accordion items={renderCollapseItems()} />
                    ) : (
                        <p className="text-gray-500">
                            {i18n.t("No FAQs available")}.
                        </p>
                    )}
                </div>

                {/* Add FAQ Form */}
                <div className="space-y-4">
                    {renderLanguageSelector()}
                    <h3 className="text-lg font-semibold">
                        {i18n.t("Add New FAQ")}
                    </h3>
                    <Form
                        form={form}
                        layout="vertical"
                        className="space-y-4 adminForm w-full"
                        onFinish={handleAddFAQ}
                    >
                        {languages?.docs?.map((lang, index) => (
                            <div
                                key={index}
                                className={`transition-all duration-300 ${
                                    lang.code === selectedLang ? "block" : "hidden"
                                }`}
                            >
                                <FormInput
                                    name={["question", lang.code]}
                                    placeholder={i18n.t("Enter question")}
                                    required
                                    rules={[
                                        {
                                            message: i18n.t(
                                                "Please enter a question."
                                            ),
                                        },
                                    ]}
                                />
                                <FormInput
                                    name={["answer", lang.code]}
                                    required
                                    rules={[
                                        {
                                            message: i18n.t(
                                                "Please enter an answer."
                                            ),
                                        },
                                    ]}
                                    placeholder={i18n.t("Enter answer")}
                                    textArea
                                />
                            </div>
                        ))}
                        <HiddenInput name="id" />
                        <button
                            type="submit"
                            className="admin-btn"
                            onClick={() => noSelected({ form, setSelectedLang })}
                        >
                            {i18n?.t("Add FAQ")}
                        </button>
                    </Form>
                </div>
            </div>
        </Modal>
    );
};

export default FAQModal;
