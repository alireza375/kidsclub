import React, { useEffect, useState } from "react";
import { Form, Input, Modal, Switch } from "antd";
import {
    deleteTestimonial,
    fetchTestimonial,
    postSingleImage,
    postTestimonial,
    updateStatusTestimonial,
} from "../../helpers/backend";
import {
    useAction,
    useActionConfirm,
    useFetch,
    useTitle,
} from "../../helpers/hooks";
import Table, { TableImage } from "../../components/common/form/table";
import { useI18n } from "../../providers/i18n";
import FormInput, { HiddenInput } from "../common/form/input";
import MultipleImageInput from "../common/form/multiImage";
import { columnFormatter, noSelected } from "../../helpers/utils";
import { useSite } from "../../context/site";

const Testimonial = () => {
    const i18n = useI18n();
    let { languages, langCode } = i18n;
    const [selectedLang, setSelectedLang] = useState(langCode);
    const [form] = Form.useForm();

    const { sitedata } = useSite();
    useTitle(
        sitedata?.title +
            " | " +
            i18n.t("Testimonial") +
            " - " +
            i18n.t("Admin")
    );
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

    const [data, getData, { loading }] = useFetch(fetchTestimonial);

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
        if (values.image?.[0]?.originFileObj) {
            const { data } = await postSingleImage({
                file: values.image[0].originFileObj,
            });
            values.image = data;
        } else {
            values.image = values.image?.[0]?.url || "";
        }
        const apiPayload = modalState.isEdit
            ? { ...values, id: modalState.record.id }
            : values;
        return useAction(postTestimonial, apiPayload, () => {
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
            text: "Image",
            dataField: "image",
            formatter: (_, d) => <TableImage url={d?.image} />,
        },
        {
            text: "Rating",
            dataField: "rating",
            sort: true,
        },
        {
            text: "Status",
            dataField: "status",
            formatter: (_, d) => (
                <Switch
                    checkedChildren={"Active"}
                    unCheckedChildren={"Inactive"}
                    checked={d?.status}
                    onChange={async (e) => {
                        await useActionConfirm(
                            updateStatusTestimonial,
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
                    <button
                    className="admin-btn"
                    onClick={() => handleModalOpen(false)}>
                        {i18n?.t("Add Testimonial")}
                    </button>
                }
                onDelete={deleteTestimonial}
                onView={handleView}
                onEdit={(record) => handleModalOpen(true, record)}
                title={"Testimonial List"}
                i18n={i18n}
            />

            {/* Add/Edit Modal */}
            <Modal
                open={modalState.isOpen}
                title={
                    modalState.isEdit ? i18n?.t("Edit Testimonial") : i18n?.t("Add Testimonial")
                }
                width={600}
                onCancel={handleModalClose}
                footer={null}
                className="adminForm"
            >
                <div className="flex flex-wrap justify-start gap-3 mt-4 mb-4">
                    {languages?.docs?.map((l, index) => (
                        <div
                            onClick={() => setSelectedLang(l?.code)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                                l?.code === selectedLang
                                    ? "bg-teal-blue text-white cursor-pointer"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
                            }`}
                            key={index}
                        >
                            {l?.name}
                        </div>
                    ))}
                </div>
                <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                    {modalState.isEdit && <HiddenInput name="id" />}
                    <FormInput
                        name="name"
                        label={i18n?.t("name")}
                        required={true}
                    />
                    <MultipleImageInput
                        name="image"
                        label={i18n?.t("image")}
                        required={true}
                        listType="picture-card"
                    />
                    <FormInput
                        name="rating"
                        type={"number"}
                        label={i18n?.t("rating")}
                        required={true}
                    />

                    {languages?.docs?.map((l, index) => (
                        <div
                            key={index}
                            style={{
                                display:
                                    l.code === selectedLang ? "block" : "none",
                            }}
                        >
                            <Form.Item
                                name={["description", l.code]}
                                label={`${i18n?.t("description")} (${l.name})`}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input description",
                                    },
                                ]}
                            >
                                <Input.TextArea showCount maxLength={100} />
                            </Form.Item>
                        </div>
                    ))}

                    <button
                        onClick={() => noSelected({ form, setSelectedLang })}
                        type="submit"
                        className="mt-2 admin-btn"
                        change
                    >
                        {modalState?.isEdit ? "Update" : "Submit"}
                    </button>
                </Form>
            </Modal>

            {/* View Modal */}
            <Modal
                open={viewModalState.isOpen}
                title={i18n?.t("View Testimonial")}
                width={400}
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

                        {/* Rating Section */}
                        <div className="p-4 rounded-lg shadow-md bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {i18n?.t("Rating")}:
                            </h3>
                            <p className="text-gray-700">
                                {viewModalState?.record?.rating}
                            </p>
                        </div>

                        {/* Image Section */}
                        <div className="p-4 rounded-lg shadow-md bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {i18n?.t("Image")}:
                            </h3>
                            <img
                                src={viewModalState?.record?.image}
                                alt={viewModalState?.record?.name}
                                className="object-cover w-full rounded-lg h-60"
                            />
                        </div>

                        {/* Descriptions */}
                        <div className="p-4 rounded-lg shadow-md bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {i18n?.t("Descriptions")}:
                            </h3>
                            <p className="text-gray-700">
                                        {
                                        columnFormatter(viewModalState.record.description)
                                        }
                                    </p>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Testimonial;
