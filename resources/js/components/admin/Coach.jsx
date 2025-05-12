import React, { useEffect, useState } from "react";
import { useI18n } from "../../providers/i18n";
import { Form, Modal, Switch } from "antd";
import {
    useAction,
    useActionConfirm,
    useFetch,
    useTitle,
} from "../../helpers/hooks";
import {
    delSingleCoach,
    fetchCoaches,
    postCoach,
    postSingleImage,
    updateUserStatus,
} from "../../helpers/backend";
import Table, { TableImage } from "../common/form/table";
import FormInput, { HiddenInput } from "../common/form/input";
import PhoneNumberInput from "../common/form/phoneNumberInput";
import Avatar from "../common/Avatar";
import { useSite } from "../../context/site";
import { columnFormatter } from "../../helpers/utils";

const Coach = () => {
    const i18n = useI18n();
    let { languages, langCode } = i18n;
    const [selectedLang, setSelectedLang] = useState(langCode);
    const [form] = Form.useForm();
    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("Coaches") + " - " + i18n.t("Admin"));
    useEffect(() => {
        setSelectedLang(langCode);
    }, [langCode]);

    const [modalState, setModalState] = useState({
        isOpen: false,
        isEdit: false,
        record: null,
    });

    const [viewModalState, setViewModalState] = useState({
        isOpen: false,
        record: null,
    });

    const [data, getData, { loading }] = useFetch(fetchCoaches);

    const handleModalOpen = (isEdit = false, record = null) => {
        setModalState({ isOpen: true, isEdit, record });

        if (record) {
            form.setFieldsValue({
                ...record,
                image: record.image
                    ? [
                          {
                              uid: record.id,
                              name: "Uploaded Image",
                              status: "done",
                              url: record.image,
                          },
                      ]
                    : [],
            });
        }
    };

    const handleModalClose = () => {
        setModalState({ isOpen: false, isEdit: false, record: null });
        form.resetFields();
    };

    const handleView = (record) => {
        setViewModalState({ isOpen: true, record });
    };

    const handleViewClose = () => {
        setViewModalState({ isOpen: false, record: null });
    };

    const handleFormSubmit = async (values) => {
        const apiPayload = modalState.isEdit
            ? { ...values, id: modalState.record.id }
            : values;

        return useAction(postCoach, apiPayload, () => {
            getData();
            handleModalClose();
        });
    };

    const columns = [
        {
            text: "name",
            dataField: "name",
            sort: true,
        },
        {
            text: "Email",
            dataField: "email",
            sort: true,
        },
        {
            text: "Image",
            dataField: "image",
            formatter: (_, d) =>
                d?.image ? (
                    <TableImage url={d?.image} />
                ) : (
                    <Avatar classes="w-10 h-10" name={d?.name}></Avatar>
                ),
        },
        {
            text: "Assigned Service",
            dataField: "assigned_service",
            formatter: (_, d) =>
                d?.assigned_service
                    ? d?.assigned_service?.name[langCode]?.length > 30
                        ? d?.assigned_service?.name[langCode].slice(0, 30) + "..."
                        : d?.assigned_service?.name[langCode]
                    : i18n?.t("Not Assigned"),
        },
        {
            text: "Status",
            dataField: "status",
            formatter: (_, d) => (
                <Switch
                    checkedChildren={i18n?.t("Active")}
                    unCheckedChildren={i18n?.t("Inactive")}
                    checked={d?.status}
                    onChange={async (e) => {
                        await useActionConfirm(
                            updateUserStatus,
                            { id: d.id, status: e },
                            getData,
                            "Are you sure you want to change the status?",
                            "Yes, Change"
                        );
                    }}
                    className="bg-gray-500"
                />
            ),
        },
    ];
    return (
        <div className="min-h-full p-4 bg-gray-100 rounded-md">
            <Table
                columns={columns}
                data={data}
                onReload={getData}
                loading={loading}
                pagination
                indexed
                action={
                    <button onClick={() => handleModalOpen(false)}
                     className="admin-btn"
                    >
                        {i18n?.t("Add Coach")}
                    </button>
                }
                onDelete={delSingleCoach}
                onView={handleView}
                title={i18n?.t("Coach List")}
                i18n={i18n}
            />

            {/* Add/Edit Modal */}
            <Modal
                open={modalState.isOpen}
                title={modalState.isEdit ? i18n?.t("Edit Coach") : i18n?.t("Add Coach")}
                onCancel={handleModalClose}
                footer={null}
                className="adminForm"
            >
                <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                    {modalState.isEdit && <HiddenInput name="id" />}
                    <FormInput
                        name="name"
                        label={i18n?.t("Name")}
                        required={true}
                    />

                    <PhoneNumberInput
                        name="phone"
                        type={"number"}
                        label={i18n?.t("Phone")}
                        required={true}
                    />
                    <FormInput
                        name="email"
                        type={"email"}
                        label={i18n?.t("Email")}
                        required={true}
                    />
                    <FormInput
                        name="password"
                        label={i18n?.t("Password")}
                        required={true}
                    />

                    <button type="submit" className="mt-2 admin-btn">
                        {modalState?.isEdit ? i18n?.t("Update") : i18n?.t("Submit")}
                    </button>
                </Form>
            </Modal>

            {/* View Modal */}
            <Modal
                open={viewModalState?.isOpen}
                title={i18n?.t("View Coach")}
                onCancel={handleViewClose}
                footer={null}
                className="adminView"
            >
                {viewModalState.record && (
                    <div className="flex flex-col gap-4 p-4">
                        {/* Name Section */}
                        <div className="p-4 rounded-lg shadow-md bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {i18n?.t("Name")}:
                            </h3>
                            <p className="text-gray-700">
                                {viewModalState?.record?.name}
                            </p>
                        </div>

                        <div className="p-4 rounded-lg shadow-md bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {i18n?.t("Email")}:
                            </h3>
                            <p className="text-gray-700">
                                {viewModalState.record.email}
                            </p>
                        </div>
                        <div className="p-4 rounded-lg shadow-md bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {i18n?.t("Phone")}:
                            </h3>
                            <p className="text-gray-700">
                                {viewModalState?.record?.phone}
                            </p>
                        </div>

                        {/* Image Section */}
                        <div className="p-4 rounded-lg shadow-md bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {i18n?.t("Image")}:
                            </h3>
                            <img
                                src={viewModalState.record.image}
                                alt={viewModalState.record.name}
                                className="object-cover w-full rounded-lg h-60"
                            />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Coach;
