import React, { useState } from "react";
import { Button, Form, message, Modal, Switch } from "antd";
import { PiTranslate } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import {
    deleteLanguage,
    fetchAdminLanguages,
    postLanguage,
    updateLanguage,
} from "../../helpers/backend";
import { useActionConfirm, useFetch, useTitle } from "../../helpers/hooks";
import Table from "../../components/common/form/table";
import button from "../common/form/form-button";
import { useI18n } from "../../providers/i18n";
import FormInput from "../common/form/input";
import FormSelect from "../common/form/select";
import { useSite } from "../../context/site";

const Languages = () => {
    const navigate = useNavigate();
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [postLoading, setPostLoading] = useState(false);

    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("Languages") + " - " + i18n.t("Admin"));

    const [modalState, setModalState] = useState({
        isOpen: false,
        isEdit: false,
        record: null,
    });

    const [languages, getLanguages, { loading }] = useFetch(fetchAdminLanguages);

    const handleModalOpen = (isEdit = false, record = null) => {
        setModalState({ isOpen: true, isEdit, record });

        if (record) form.setFieldsValue(record);
    };

    const handleModalClose = () => {
        setModalState({ isOpen: false, isEdit: false, record: null });
        form.resetFields();
    };

    const handleFormSubmit = async (values) => {
        try {
            // Start a loading state (if required)
            setPostLoading(true);

            // Prepare API payload
            const apiPayload = modalState.isEdit
                ? { ...values, id: modalState.record.id }
                : values;

            // Call appropriate API function
            if (modalState.isEdit) {
                const { success, message: msg } = await updateLanguage(apiPayload);
                if (success) {
                    message.success("Language updated successfully!");
                } else {
                    throw new Error(msg || "Failed to update language");
                }
            } else {
                const { success, message: msg } = await postLanguage(apiPayload);
                if (success) {
                    message.success("Language added successfully!");
                } else {
                    throw new Error(msg || "Failed to add language");
                }
            }

            // Fetch updated language list
            await getLanguages();

            // Close the modal
            handleModalClose();
        } catch (error) {
            // Handle errors
            console.error("Error handling form submission:", error);
            message.error(error.message || "An unexpected error occurred.");
        } finally {
            // Stop the loading state
            setPostLoading(false);
        }
    };


    const LanguageSwitch = ({ checked, onChange, confirmMessage }) => (
        <Switch
            checkedChildren={i18n?.t("Active")}
            unCheckedChildren={i18n?.t("Inactive")}
            checked={checked}
            onChange={async (status) =>
                await useActionConfirm(
                    updateLanguage,
                    { id : modalState?.record?.id, ...onChange(status) },
                    getLanguages,
                    confirmMessage,
                    "Yes, Change"
                )
            }
            className="bg-gray-500"
        />
    );

    const ActionButtons = ({ record }) => (
        <button
            className="p-2 border rounded border-primary text-primary"
            title="Edit"
            onClick={() => handleModalOpen(true, record)}
        >
            <PiTranslate size={12} />
        </button>
    );

    const columns = [
        { text: "Name", dataField: "name" },
        { text: "Flag", dataField: "flag" },
        { text: "Code", dataField: "code" },
        {
            text: "Default",
            dataField: "default",
            formatter: (_, record) => (
                <LanguageSwitch
                    checked={record.default}
                    onChange={(status) => ({ id: record.id, default: status })}
                    confirmMessage="Are you sure you want to change the default language?"
                />
            ),
        },
        {
            text: "Status",
            dataField: "active",
            formatter: (_, record) => (
                <LanguageSwitch
                    checked={record.active}
                    onChange={(status) => ({ id: record.id, active: status })}
                    confirmMessage="Are you sure you want to change the status?"
                />
            ),
        },
        {
            text: "RTL",
            dataField: "rtl",
            formatter: (_, record) => <span>{record.rtl ? i18n?.t("Yes") : i18n?.t("No")}</span>,
        },
    ];
    let actions = ({ id }) => (
        <button className="p-2 border rounded border-primary text-primary"
            title="Edit" onClick={() => navigate('/admin/languages/' + id)}>
            <PiTranslate size={12} />
        </button>
    )

    return (
        <div className="p-4 bg-gray-100 min-h-full rounded-md">
            <Table
                columns={columns}
                data={languages}
                onReload={getLanguages}
                loading={loading}
                pagination
                indexed
                action={
                    <button onClick={() => handleModalOpen(false)}
                    className="admin-btn"
                    >
                        {i18n?.t("Add Language")}
                    </button>
                }
                onDelete={deleteLanguage}
                onEdit={(record) => handleModalOpen(true, record)}
                title={"Languages List"}
                actions={actions}
                i18n={i18n}
            />
            <Modal
                open={modalState.isOpen}
                title={modalState.isEdit ? "Edit Language" : "Add Language"}
                width={400}
                onCancel={handleModalClose}
                footer={null}
                className="adminForm"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFormSubmit}
                >

                    <FormInput name="name" label={"Name"} required />
                    <FormInput name="code" label={"Code"} required />
                    <FormInput name="flag" label={"Flag"} required />
                    <div className="Form-select-customization">
                    <FormSelect
                        name="rtl"
                        label={"RTL Support"}
                        required
                        options={[
                            { label: "Yes", value: true },
                            { label: "No", value: false },
                        ]}
                    />
                    <FormSelect
                        name="active"
                        label={"Status"}
                        required
                        options={[
                            { label: i18n?.t("Yes"), value: true },
                            { label: i18n?.t("No"), value: false },
                        ]}
                    />
                    </div>

                    <button type="submit" className="admin-btn mt-3">
                        {modalState.isEdit ? "Update" : "Submit"}
                    </button>
                </Form>
            </Modal>
        </div>
    );
};

export default Languages;
