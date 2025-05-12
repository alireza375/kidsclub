import React, { useEffect, useState } from "react";
import {
    Button,
    Descriptions,
    Typography,
    Form,
    Modal,
    Switch,
    Checkbox,
} from "antd";
import { PiTranslate } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import {
    deletePaymentMethod,
    fetchPaymentMethods,
    postPaymentMethod,
    postSingleImage,
    changePaymentMethod,
    updatePaymentMethod
} from "../../helpers/backend";
import { useActionConfirm, useFetch, useTitle } from "../../helpers/hooks";
import Table, { TableImage } from "../common/form/table";
import FormButton from "../common/form/form-button";
import { useI18n } from "../../providers/i18n";
import FormInput, { HiddenInput } from "../common/form/input";
import FormSelect from "../common/form/select";
import MultipleImageInput from "../common/form/multiImage";
import { useSite } from "../../context/site";

const PaymentMethod = () => {
    const navigate = useNavigate();
    const i18n = useI18n();
    const [form] = Form.useForm();

    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("Payment Methods") + " - " + i18n.t("Admin"));

    const [selectedMethod, setSelectedMethod] = useState("");
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [paymentMethods, getpaymentMethods, { loading }] =
        useFetch(fetchPaymentMethods);


    const handleEdit = (record) => {
        setIsOpen(true);
       setIsEdit(true);
       setSelectedMethod(record?.type);
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
    const handleModalClose = () => {
        setIsOpen(false);
        form.resetFields();
        setSelectedMethod("");
        setIsEdit(false);
    };

    const handleFormSubmit = async (values) => {
        if (values.image?.[0]?.originFileObj) {
            const { data } = await postSingleImage({
                file: values.image[0].originFileObj,
                payment_method: "payment",
            });
            values.image = data;
        } else {
            values.image = values.image?.[0]?.url || "";
        }

        const config = JSON.stringify(values.config);
        const apiPayload = isEdit
            ? { ...values, config, id: values.id }
            : { ...values, config };

       isEdit ? await updatePaymentMethod(apiPayload) : await postPaymentMethod(apiPayload);
        getpaymentMethods();
        handleModalClose();
    };



    const PaymentMethodsSwitch = ({ checked, onChange, record }) => (
        <Switch
            checkedChildren={"Active"}
            unCheckedChildren={"Inactive"}
            checked={checked}
            onChange={(status) => onChange(status, record)}
            className="bg-gray-500"
        />
    );

    const renderPaymentMethodConfig = (method) => {
        const config = method?.config || {};
        return Object.entries(config).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center py-2 border-b">
                <span className="font-medium text-gray-600">
                    {key.replace(/([A-Z])/g, ' $1').toUpperCase()}:
                </span>
                <span className="text-gray-800 break-all bg-gray-100 px-2 py-1 rounded">
                    {value}
                </span>
            </div>
        ));
    };

    const columns = [
        { text: "Name", dataField: "name" },
        { text: "Type", dataField: "type" },
        {
            text: "Image",
            dataField: "image",
            formatter: (_, record) => <TableImage url={record?.image} />,
        },
        {
            text: "Status",
            dataField: "status",
            formatter: (_, record) => (
                <Switch
                checkedChildren={"Active"}
                unCheckedChildren={"Inactive"}
                checked={record.status}
                onChange={async (status) => {
                    await  changePaymentMethod({
                        id: record.id,
                        status: status,
                    });
                    getpaymentMethods();
                }}
                className="bg-gray-500"
            />
            ),
        },
    ];

    const handleView = (record) => {
        setSelectedMethod(record);
        setIsViewOpen(true);
    };

    const onViewClose = () => {
        setSelectedMethod("");
        setIsViewOpen(false);
    };

    return (
        <div className="p-4 bg-gray-100 min-h-full rounded-md">
            <Table
                columns={columns}
                data={paymentMethods}
                onReload={getpaymentMethods}
                loading={loading}
                pagination
                indexed
                action={
                    <button
                    className="admin-btn"
                    onClick={() => setIsOpen(true)}>
                        {i18n?.t("Add payment method")}
                    </button>
                }
                onDelete={deletePaymentMethod}
                onView={handleView}
                onEdit={(record) => handleEdit(record)}
                title={"Payment methods list"}
                i18n={i18n}
            />
            <Modal
                open={isOpen}
                title={isEdit ? i18n?.t("Edit Method") : i18n?.t("Add Method")}
                width={600}
                onCancel={handleModalClose}
                footer={null}
                className="adminForm"
            >
                <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                    {isEdit && <HiddenInput name="id" />}
                    <FormInput name="name" label={i18n.t("Name")} required />
                    <MultipleImageInput name="image" label={i18n?.t("Image")} required />
                    <div className="Form-select-customization">
                    <FormSelect
                        name="type"
                        label={i18n.t("Method Type")}
                        rules={[{ required: true, message: i18n.t("Please select method type") }]}
                        onChange={setSelectedMethod}
                        options={[
                            { value: "paypal", label: i18n?.t("Paypal") },
                            { value: "stripe", label: i18n?.t("Stripe") },
                            { value: "razorpay", label: i18n?.t("Razorpay") },
                            { value: "sslcommerz", label: i18n?.t("sslcommerz") },
                            { value: "mollie", label: i18n?.t("mollie") },
                        ]}
                        allowClear
                    /></div>
                    {selectedMethod && (
                        <div>
                            {selectedMethod === "paypal" && (
                                <>
                                    <FormInput required name={["config", "clientId"]} label={i18n.t("Paypal Client ID")} />
                                    <FormInput required name={["config", "clientSecret"]} label={i18n.t("Paypal Client Secret")} />
                                    <div className="Form-select-customization">
                                    <FormSelect required name={["config", "mode"]} label={i18n.t("Paypal Mode")} options={[{ value: "sandbox", label: "Sandbox" }, { value: "live", label: "Live" }]} /></div>
                                </>
                            )}
                            {selectedMethod === "stripe" && (
                                <>
                                    <FormInput  name={["config", "clientId"]} label={i18n.t("Stripe Secret Key")} />
                                    <FormInput  name={["config", "clientSecret"]} label={i18n.t("Stripe Webhook Endpoint secret")} />
                                    <div className="Form-select-customization">
                                    <FormSelect  name={["config", "mode"]} label={i18n.t("Stripe Mode")} options={[{ value: "sandbox", label: "Sandbox" }, { value: "live", label: "Live" }]} /></div>
                                </>
                            )}
                            {selectedMethod === "razorpay" && (
                                <>
                                    <FormInput required name={["config", "keyId"]} label={i18n.t("Razorpay Key Id")} />
                                    <FormInput required name={["config", "keySecret"]} label={i18n.t("Razorpay Key Secret")} />
                                    <div className="Form-select-customization">

                                    <FormSelect required name={["config", "mode"]} label={i18n.t("Razorpay Mode")} options={[{ value: "sandbox", label: "Sandbox" }, { value: "live", label: "Live" }]} /></div>

                                </>
                            )}
                            {selectedMethod === "sslcommerz" && (
                                <>
                                    <FormInput required name={["config", "store_id"]} label={i18n.t("Store Id")} />
                                    <FormInput required name={["config", "store_password"]} label={i18n.t("Store Password")} />
                                    <div className="Form-select-customization">

                                    <FormSelect required name={["config", "mode"]} label={i18n.t("Sslcommerz Mode")} options={[{ value: "sandbox", label: "Sandbox" }, { value: "live", label: "Live" }]} /></div>
                                </>
                            )}
                            {selectedMethod === "mollie" && (
                                <>
                                    <FormInput required name={["config", "key"]} label={i18n.t("Mollie Key")} />
                                </>
                            )}
                        </div>
                    )}
                    <button  type="submit" className="admin-btn mt-5">
                        {i18n?.t(isEdit ? "Update" : "Submit")}
                    </button>
                </Form>
            </Modal>

            <Modal
                title={i18n?.t("Payment Configuration")}
                open={isViewOpen}
                onCancel={onViewClose}
                footer={null}
                centered
                className="font-nunito"
            >
                <div className="space-y-6">
                    <div className="border rounded-lg p-4 bg-white shadow">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">{i18n?.t("Payment Details")}</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center border-b py-2">
                                <span className="font-medium text-gray-600">{i18n?.t("Name")}:</span>
                                <span className="text-gray-800">{selectedMethod?.name}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="font-medium text-gray-600">{i18n?.t("Type")}:</span>
                                <span className="text-gray-800">{selectedMethod?.type}</span>
                            </div>
                        </div>
                    </div>

                    <div className="border rounded-lg p-4 bg-white shadow">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">{i18n?.t("Configuration")}</h3>
                        <div className="space-y-2">
                            {renderPaymentMethodConfig(selectedMethod)}
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PaymentMethod;
