import { Form, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import {
    allProductCategorylist,
    delProductCategory,
    postProductCategory,
    postSingleImage,
    updateProductCategory,
} from "../../../helpers/backend";
import { useAction, useFetch } from "../../../helpers/hooks";
import Button from "../../common/Button";
import FormInput, { HiddenInput } from "../../common/form/input";
import PageTitle from "../../common/page-title";
import Table, { TableImage } from "../../common/form/table";
import { useI18n } from "../../../providers/i18n";
import { columnFormatter, noSelected } from "../../../helpers/utils";
import JodiEditor from "../../common/form/jodiEditor";
import MultipleImageInput from "../../common/form/multiImage";
const ProductCategory = () => {
    const [form] = Form.useForm();
    const i18n = useI18n();
    let { languages, langCode } = useI18n();
    let imageUrl = "";
    const [open, setOpen] = useState(false);
    const [data, getData, { loading }] = useFetch(allProductCategorylist);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedLang, setSelectedLang] = useState('');
    const [formData, setFromData] = useState([]);
    const { TextArea } = Input;

    useEffect(() => {
        setSelectedLang(langCode);
    }, [langCode]);

    const columns = [
        {
            text: "Name",
            dataField: "name",
            formatter: (_, d) => columnFormatter(d?.name),
        },
        {
            text: "Image",
            dataField: "image",
            formatter: (_, d) => {
                return (
                    <div className="flex gap-x-3 space-x-1">
                        <TableImage url={d?.image} />
                    </div>
                );
            },
        }
    ];
    return (
        <div>
            <PageTitle title="Product Categories" />
            <Table
                columns={columns}
                data={data}
                loading={loading}
                onReload={getData}
                action={
                    <button
                     className="admin-btn"
                        onClick={() => {
                            form.resetFields();
                            setOpen(true);
                            setIsEdit(false);
                        }}
                    >
                        {i18n?.t("Add Category")}
                    </button>
                }
                onEdit={(values) => {
                    form.resetFields();
                    form.setFieldsValue({
                        ...values,
                        image:
                            values?.image?.length > 0
                                ? [
                                      {
                                          uid: "-1",
                                          name: "image.png",
                                          status: "done",
                                          url: values?.image,
                                      },
                                  ]
                                : [],
                    });
                    setOpen(true);
                    setIsEdit(true);
                }}
                onDelete={delProductCategory}
                indexed
                pagination
                langCode={langCode}
                i18n={i18n}
            />
            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                title={isEdit ? i18n?.t("Edit Category") : i18n?.t("Add Category")}
                footer={null}
                destroyOnClose={true}
                className="adminForm"
            >
                <div className="flex justify-start flex-wrap gap-3">
                    {languages?.docs?.map((l, index) => (
                        <button
                            onClick={() => setSelectedLang(l.code)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
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
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={async (values) => {
                        if (values?.image?.[0]?.originFileObj) {
                            const image = values?.image[0]?.originFileObj;
                            const { data } = await postSingleImage({
                                file: image,
                                image_name: "category",
                            });
                            imageUrl = data;
                        } else {
                            imageUrl = values?.image?.[0]?.url || "";
                        }
                        const multiLangFields = ["name", "description"];
                        const formattedData = multiLangFields.reduce(
                            (acc, field) => {
                                acc[field] = {};
                                languages?.docs?.forEach((lang) => {
                                    if (
                                        values[field] &&
                                        values[field][lang.code]
                                    ) {
                                        acc[field][lang.code] =
                                            values[field][lang.code];
                                    }
                                });
                                return acc;
                            },
                            {}
                        );
                        return useAction(
                            values?.id
                                ? updateProductCategory
                                : postProductCategory,
                            {
                                ...formattedData,
                                id: parseInt(values?.id),
                                image: imageUrl,
                            },
                            () => {
                                setOpen(false);
                                getData();
                            }
                        );
                    }}
                    className="mt-2"
                >
                    {isEdit && <HiddenInput name="id" />}

                    {languages?.docs?.map((l, index) => (
                        <div
                            key={index}
                            style={{
                                display:
                                    l.code === selectedLang ? "block" : "none",
                            }}
                        >

                            <FormInput
                                name={["name", l.code]}
                                label={`${i18n?.t("Name")}`}
                                rules={[{required: true,message: i18n?.t("Please provide a name") }]}                                onBlur={(e) => {
                                    if (formData?.length === 0) {
                                        setFromData([
                                            {
                                                lang: selectedLang,
                                                value: e.target.value,
                                            },
                                        ]);
                                    } else {
                                        const uniqueData = formData?.filter(
                                            (data) =>
                                                data?.lang !== selectedLang
                                        );
                                        const moreData = [
                                            ...uniqueData,
                                            {
                                                lang: selectedLang,
                                                value: e.target.value,
                                            },
                                        ];
                                        setFromData(moreData);
                                    }
                                }}
                            >
                            </FormInput>
                            <div className="mt-6 mb-3">
                            <FormInput
                                    name={["description", l.code]}
                                    label={`${i18n?.t("Description")}`}
                                    rules={[{required: true,message: i18n?.t("Please provide a description") }]}
                                    textArea
                                >
                                    {/* <TextArea
                                        showCount
                                        maxLength={100}
                                        style={{ height: 120, resize: "none" }}
                                    /> */}
                                </FormInput>
                            </div>
                            <MultipleImageInput
                                name={"image"}
                                label={i18n?.t("Image")}
                                required
                            />
                        </div>
                    ))}
                    <button
                        type="submit"
                        onClick={() => noSelected({ form, setSelectedLang })}
                        className="admin-btn"
                    >
                        {isEdit ? i18n?.t("Update") : i18n?.t("Submit")}
                    </button>
                </Form>
            </Modal>
        </div>
    );
};

export default ProductCategory;
