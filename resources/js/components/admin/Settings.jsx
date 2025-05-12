import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row, Modal, message } from "antd";
import { useFetch, useTitle } from "../../helpers/hooks";
import { fetchAdminSettings, updateAdminSettings } from "../../helpers/backend";
import { useI18n } from "../../providers/i18n";
import PageTitle from "../common/page-title";
import FormInput, { HiddenInput } from "../common/form/input";
import PhoneNumberInput from "../common/form/phoneNumberInput";
import MultipleImageInput from "../common/form/multiImage";
import FormButton from "../common/form/form-button";
import FormSelect from "../common/form/select";
import { FaExclamationTriangle } from "react-icons/fa";
import { useSite } from "../../context/site";

const Settings = () => {
    // State
    const [form] = Form.useForm();
    const [data, getData] = useFetch(fetchAdminSettings);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [prevUploadPath, setPrevUploadPath] = useState(null);
    const [pendingUploadPath, setPendingUploadPath] = useState(null); // New state to track pending change
    const i18n = useI18n();

    // Title Hook
    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("Settings") + " - " + i18n.t("Admin"));

    // Populate Form with Fetched Data
    useEffect(() => {
        if (data) {
            const updatedData = {
                ...data,
                logo: data?.logo
                    ? [
                          {
                              uid: "-1",
                              name: "image.png",
                              status: "done",
                              url: data?.logo,
                          },
                      ]
                    : [],
                breadcrumb: data?.breadcrumb
                    ? [
                          {
                              uid: "-1",
                              name: "image.png",
                              status: "done",
                              url: data?.breadcrumb,
                          },
                      ]
                    : [],
                favicon: data?.favicon
                    ? [
                          {
                              uid: "-1",
                              name: "image.png",
                              status: "done",
                              url: data?.favicon,
                          },
                      ]
                    : [],
            };
            form.setFieldsValue(updatedData);
            setPrevUploadPath(updatedData.upload_path);
        }
    }, [data, form]);

    // Form Submission Handler
    const handleFinish = async (values) => {
        try {
            setSubmitLoading(true);
            const payload = {
                ...values,
                logo: values?.logo?.[0]?.originFileObj,
                breadcrumb: values?.breadcrumb?.[0]?.originFileObj,
                favicon: values?.favicon?.[0]?.originFileObj,
            };

            const { success, message: msg } = await updateAdminSettings(
                payload
            );
            if (success) {
                message.success(msg);
                getData();
            } else {
                message.error(msg);
            }
        } catch (error) {
            message.error("Something went wrong!");
        } finally {
            setSubmitLoading(false);
        }
    };

    // Handle Form Field Changes
    const handleValuesChange = (changedValues) => {
        if (
            changedValues.upload_path &&
            changedValues.upload_path !== prevUploadPath
        ) {
            setShowWarning(true);
            setPendingUploadPath(changedValues.upload_path);
        }
    };

    // Handle Warning Modal OK
    const handleWarningOk = () => {
        // Confirm the upload path change
        setPrevUploadPath(pendingUploadPath);
        setShowWarning(false);
        setPendingUploadPath(null);
    };

    // Handle Warning Modal Cancel
    const handleWarningCancel = () => {
        // Revert the upload path to the previous value
        form.setFieldsValue({ upload_path: prevUploadPath });
        setShowWarning(false);
        setPendingUploadPath(null);
    };

    return (
        <div className="p-4 bg-gray-100 min-h-full rounded-md">
            <PageTitle title="Admin Settings" />
            <Card className="shadow-md">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    onValuesChange={handleValuesChange}
                >
                    <Row gutter={[16, 16]}>
                        {/* General Settings */}
                        <Col span={24}>
                            <Card
                                title={i18n?.t("General Settings")}
                                className="shadow-sm"
                            >
                                <Row gutter={[16, 16]}>
                                    <HiddenInput name="id" />
                                    <Col span={12}>
                                        <FormInput
                                            name="title"
                                            label="Title"
                                            placeholder="Enter title"
                                            required
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <FormInput
                                            name="email"
                                            label="Email"
                                            placeholder="Enter email"
                                            required
                                            isEmail
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <PhoneNumberInput
                                            name="phone"
                                            label={i18n?.t("Phone Number")}
                                            placeholder="Enter phone number"
                                            required
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <FormInput
                                            name="address"
                                            label="Address"
                                            placeholder="Enter address"
                                            required
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <FormInput
                                            name="copyright"
                                            label="Copy Right"
                                            placeholder="Enter copy right"
                                            required
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <FormInput
                                            name="description"
                                            label="Description"
                                            placeholder="Enter description"
                                            required
                                            textArea
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        </Col>

                        {/* Social Links */}
                        <Col span={24}>
                            <Card title={i18n?.t("Social Links")} className="shadow-sm">
                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <FormInput
                                            name="facebook"
                                            label="Facebook Link"
                                            placeholder="Enter Facebook URL"
                                            required
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <FormInput
                                            name="twitter"
                                            label="Twitter Link"
                                            placeholder="Enter Twitter URL"
                                            required
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <FormInput
                                            name="instagram"
                                            label="Instagram Link"
                                            placeholder="Enter Instagram URL"
                                            required
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <FormInput
                                            name="linkedin"
                                            label="LinkedIn Link"
                                            placeholder="Enter LinkedIn URL"
                                            required
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <FormInput
                                            name="youtube"
                                            label="YouTube Link"
                                            placeholder="Enter YouTube URL"
                                            required
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        </Col>

                        {/* Uploads */}
                        <Col span={24}>
                            <Card title={i18n?.t("Uploads")} className="shadow-sm">
                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <MultipleImageInput
                                            name="logo"
                                            label="Logo"
                                            placeholder="Upload logo"
                                            required
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <MultipleImageInput
                                            name="breadcrumb"
                                            label="Breadcrumb Image"
                                            placeholder="Upload breadcrumb image"
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <MultipleImageInput
                                            name="favicon"
                                            label="Favicon"
                                            placeholder="Upload breadcrumb image"
                                        />
                                    </Col>
                                    <Col span={12}>
                                    <div className="Form-select-customization">

                                        <FormSelect
                                            name="upload_path"
                                            label="File Upload Path"
                                            options={[
                                                { label: "S3", value: "s3" },
                                                {
                                                    label: "Local",
                                                    value: "local",
                                                },
                                            ]}
                                            required
                                        /></div>
                                    </Col>

                                    {/* Conditional Fields for S3 */}
                                    <Form.Item
                                        shouldUpdate={(
                                            prevValues,
                                            currentValues
                                        ) =>
                                            prevValues.upload_path !==
                                            currentValues.upload_path
                                        }
                                    >
                                        {({ getFieldValue }) =>
                                            getFieldValue("upload_path")  ===
                                                "s3" &&  (
                                                <>
                                                    <Col className="w-full">
                                                        <FormInput
                                                            name="aws_access_key_id"
                                                            label="AWS Access Key ID"
                                                            placeholder="Enter AWS Access Key ID"
                                                            required
                                                        />
                                                    </Col>
                                                    <Col className="w-full">
                                                        <FormInput
                                                            name="aws_secret_access_key"
                                                            label="AWS Secret Access Key"
                                                            placeholder="Enter AWS Secret Access Key"
                                                            required
                                                        />
                                                    </Col>
                                                    <Col className="w-full">
                                                        <FormInput
                                                            name="aws_default_region"
                                                            label="AWS Default Region"
                                                            placeholder="Enter AWS Default Region"
                                                            required
                                                        />
                                                    </Col>
                                                    <Col className="w-full">
                                                        <FormInput
                                                            name="aws_bucket"
                                                            label="AWS Bucket Name"
                                                            placeholder="Enter AWS Bucket Name"
                                                            required
                                                        />
                                                    </Col>
                                                </>
                                            )
                                        }
                                    </Form.Item>
                                </Row>
                            </Card>
                        </Col>
                    </Row>

                    {/* Submit Button */}
                    <div className="flex justify-end mt-4">
                        <button loading={submitLoading} className="admin-btn">
                            {i18n?.t("Submit")}
                        </button>
                    </div>
                </Form>
            </Card>

            <Modal
                open={showWarning}
                title=""
                onOk={handleWarningOk}
                onCancel={handleWarningCancel}
                okText="OK"
                okButtonProps={{
                    className: "bg-red-600 text-white hover:bg-red-700",
                }}
            >
                <div className="flex items-center gap-4 p-2">
                    <FaExclamationTriangle className="w-12 h-12 text-red-500" />
                    <div>
                        <p className="text-gray-700 text-base font-medium">
                            Changing the file upload path may impact existing
                            uploads.
                        </p>
                        <p className="text-gray-500 text-sm">
                            Please proceed carefully to avoid breaking existing
                            links to files.
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Settings;
