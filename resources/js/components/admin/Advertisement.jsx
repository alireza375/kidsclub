import React, { useState } from "react";
import Table, { TableImage } from "../common/form/table";
import { useI18n } from "../../providers/i18n";
import FormButton from "../common/form/form-button";
import {
    useAction,
    useFetch,
    useActionConfirm,
    useTitle,
} from "../../helpers/hooks";
import {
    fetchAdvertisements,
    postAdvertisement,
    postSingleImage,
    updateAdvertisement,
    fetchSingleAdvertisement,
    delAdvertisement,
} from "../../helpers/backend";
import Button from "../common/Button";
import { Form, Modal, Switch } from "antd";
import FormInput, { HiddenInput } from "../common/form/input";
import MultipleImageInput from "../common/form/multiImage";
import dayjs from "dayjs";
import { useSite } from "../../context/site";

const Advertisement = () => {
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const i18n = useI18n();
    let { langCode } = useI18n();
    const [form] = Form.useForm();
    const [data, getData, { loading }] = useFetch(fetchAdvertisements);
    const { sitedata } = useSite();
    useTitle(
        sitedata?.title +
            " | " +
            i18n.t("Advertisements") +
            " - " +
            i18n.t("Admin")
    );
    const columns = [
        {
            text: "image",
            dataField: "image",
            formatter: (_, d) =>
                d?.image ? (
                    <TableImage url={d?.image} />
                ) : (
                    <Avatar classes="w-10 h-10" name={d?.title}></Avatar>
                ),
        },
        {
            text: i18n?.t("Status"),
            dataField: "status",
            formatter: (_, d) => (
                <Switch
                    checkedChildren={i18n?.t("Active")}
                    unCheckedChildren={i18n?.t("Inactive")}
                    checked={d?.status === "Active" ? true : false}
                    onChange={async (e) => {
                        await useActionConfirm(
                            updateAdvertisement,
                            { id: d.id, status: e ? "active" : "inactive" },
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

    const handleFormSubmit = async (values) => {
        if (values.image?.[0]?.originFileObj) {
            const { data } = await postSingleImage({
                file: values.image[0].originFileObj,
            });
            values.image = data;
        } else {
            values.image = values.image?.[0]?.url || "";
        }

        const payload = isEdit
            ? { ...values, id: form.getFieldValue("id") }
            : { ...values, status: values.status ? "active" : "inactive" };

        await useAction(
            isEdit ? updateAdvertisement : postAdvertisement,
            payload
        );
        getData();
        handleModalClose();
    };

    const handleModalClose = () => {
        setOpen(false);
        form.resetFields();
    };

    return (
        <div>
            <Table
                columns={columns}
                data={data}
                onReload={getData}
                onEdit={(data) => {
                    const formattedData = {
                        ...data,
                        image: data.image ? [{ url: data.image }] : [],
                    };
                    form.setFieldsValue(formattedData);
                    setOpen(true);
                    setIsEdit(true);
                }}
                action={
                    <button
                        className="admin-btn"
                        onClick={() => {
                            form.resetFields();
                            setOpen(true);
                            setIsEdit(false);
                        }}
                    >
                        {i18n?.t("Add Advertisement")}
                    </button>
                }
                loading={loading}
                onDelete={delAdvertisement}
                pagination
                title={"Advertisement"}
                indexed
                langCode={langCode}
                i18n={i18n}
            />
            <Modal
                open={open}
                footer={null}
                title={
                    isEdit
                        ? i18n?.t("Edit Advertisement")
                        : i18n?.t("Add Advertisement")
                }
                onCancel={handleModalClose}
                className="adminForm"
            >
                <Form
                    form={form}
                    onFinish={handleFormSubmit}
                    layout="vertical"
                    initialValues={{ status: false }}
                >
                    {isEdit && <HiddenInput name="id" />}
                    <MultipleImageInput name="image" required label={i18n?.t("Image")} />
                    <button type="submit" className="admin-btn">
                        {i18n?.t("Submit")}
                    </button>
                </Form>
            </Modal>
        </div>
    );
};

export default Advertisement;
