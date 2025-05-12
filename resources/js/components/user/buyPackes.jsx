import React, { useEffect, useState } from "react";

import { fetchPublicServices, userPackageList } from "../../helpers/backend";

import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/user";

import { useSite } from "../../context/site";
import { useFetch, useTitle } from "../../helpers/hooks";
import { columnFormatter } from "../../helpers/utils";
import { useI18n } from "../../providers/i18n";

import Table, { TableImage } from "../common/form/table";
import { Form, Modal, Switch } from "antd";
import FormInput, { HiddenInput } from "../common/form/input";
import MultipleImageInput from "../common/form/multiImage";
import FormSelect from "../common/form/select";

const HeaderStyles = {
    titleS: "bg-yellow-400/60",
};
export default function BuyPackages() {
    const { currencySymbol, currency } = useSite();
    const [data, getData, { loading }] = useFetch(userPackageList);
    const [showAllFeatures, setShowAllFeatures] = useState(false);
    const { user } = useUser();
    const [form] = Form.useForm();
    useEffect(() => {
        if (user?.id) {
            getData({ id: user?.id });
        }
    }, [user?.id]);
    const navigate = useNavigate();
    const i18n = useI18n();
    const { sitedata } = useSite();
    useTitle(
        sitedata?.title +
            " | " +
            i18n.t("Buy Packages") +
            " - " +
            i18n.t("User")
    );
    const columns = [
        {
            text: "Name",
            dataField: "name",
            formatter: (_, record) => columnFormatter(record?.package_id?.name),
        },
        { text: "Price", dataField: "price" },
        {
            text: "Image",
            dataField: "image",
            formatter: (_, record) => (
                <TableImage url={record?.package_id?.image} />
            ),
        },
    ];
    const [service, getService] = useFetch(fetchPublicServices);
    let { languages, langCode } = i18n;
    const [selectedLang, setSelectedLang] = useState(langCode);
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="w-full h-full p-5 ">
            <div className="custom-container mx-auto ">
                <Table
                    columns={columns}
                    data={data}
                    onReload={getData}
                    loading={loading}
                    pagination
                    indexed
                    onView={(record) => {
                        setIsOpen(true);
                        const servicesByLanguage = {};
                        languages?.docs?.forEach((l) => {
                            servicesByLanguage[l.code] =
                                record?.package_id?.my_services?.map(
                                    (service) => ({
                                        value:
                                            service[l.code] ||
                                            service[langCode],
                                        label:
                                            service[l.code] ||
                                            service[langCode],
                                    })
                                ) || [];
                        });

                        form.setFieldsValue({
                            ...record,
                            name: languages?.docs?.reduce((acc, l) => {
                                acc[l.code] =
                                    record?.package_id?.name?.[l.code] ||
                                    record?.package_id?.name;
                                return acc;
                            }, {}),
                            service_id: servicesByLanguage, // Pass the mapped services for all languages
                            is_active: record?.package_id?.is_active,
                            image: record?.package_id?.image
                                ? [
                                      {
                                          uid: record.id,
                                          name: "Uploaded Image",
                                          status: "done",
                                          url: record?.package_id?.image,
                                      },
                                  ]
                                : [],
                        });
                    }}
                    title={"Package"}
                    i18n={i18n}
                />
            </div>
            <Modal
                open={isOpen}
                title={i18n.t("Package Details")}
                width={600}
                onCancel={() => {
                    setIsOpen(false);
                }}
                footer={null}
                className="adminForm"
            >
                <div className="flex flex-wrap justify-start gap-3 mt-4 mb-4">
                    {languages?.docs?.map((l, index) => (
                        <div
                            onClick={() => setSelectedLang(l?.code)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                                l?.code === (selectedLang || langCode)
                                    ? "bg-teal-blue text-white cursor-pointer"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
                            }`}
                            key={index}
                        >
                            {l?.name}
                        </div>
                    ))}
                </div>
                <Form form={form} layout="vertical" className="!admin-switch">
                    {languages?.docs?.map((l, index) => (
                        <div
                            key={index}
                            style={{
                                display:
                                    l.code === (selectedLang || langCode)
                                        ? "block"
                                        : "none",
                            }}
                        >
                            <FormInput
                                name={["name", l.code]}
                                label={`${i18n?.t("Name")} (${l.name})`}
                                required={true}
                            />
                            <HiddenInput name="id" />
                            <MultipleImageInput
                                name="image"
                                label={i18n?.t("Image")}
                                required
                            />
                            <FormSelect
                                name={["service_id", l.code]}
                                label={i18n.t("select services")}
                                className={"pb-1"}
                                rules={[
                                    {
                                        required: true,
                                        message: i18n.t(
                                            "Please select method type"
                                        ),
                                    },
                                ]}
                                options={
                                    service?.docs?.map((item) => ({
                                        label: columnFormatter(item?.name),
                                        value: columnFormatter(item?.name),
                                    })) || []
                                }
                                allowClear
                                multi={true}
                            />{" "}
                        </div>
                    ))}

                    <FormInput
                        name="price"
                        type={"number"}
                        label={i18n?.t("Price")}
                        required
                    />

                    <Form.Item
                        name="is_active"
                        label="Active"
                        // valuePropName="checked"
                    >
                        <Switch
                            checkedChildren="Active"
                            unCheckedChildren="Inactive"
                            className="!rounded-full bg-[#505d69] text-black !admin-switch"
                            disabled={true}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
