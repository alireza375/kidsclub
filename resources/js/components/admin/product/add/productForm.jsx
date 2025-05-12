import React from "react";
import { Form, Input, message, Switch } from "antd";
import { useState } from "react";
import { FaMinusCircle } from "react-icons/fa";
import { BiLoader } from "react-icons/bi";
import FormInput, { HiddenInput } from "../../../common/form/input";
import FormSelect from "../../../common/form/select";
import MultipleImageInput from "../../../common/form/multiImage";
import {
    postMultipleImage,
    postProduct,
    postSingleImage,
    updateProduct,
} from "../../../../helpers/backend";
import JodiEditor from "../../../common/form/jodiEditor";
import { columnFormatter, noSelected } from "../../../../helpers/utils";
import { useI18n } from "../../../../providers/i18n";
const ProductForm = ({
    isVarient,
    setIsVarient,
    category,
    languages,
    selectedLang,
    setSelectedLang,
    formData,
    setFromData,
    router,
    form,
}) => {
    const [loading, setLoading] = useState(false);
    const i18n = useI18n();
    const [variantAdded, setVariantAdded] = useState(0);
    const handleFinish = async (values) => {
        const imgArray = [];
        try {
            if (values?.images?.length > 0) {
                for (let i = 0; i < values?.images.length; i++) {
                    if (values?.images[i]?.originFileObj) {
                        let image = {
                            file: values?.images[i]?.originFileObj,
                            image_name: "images",
                        };
                        const { data } = await postSingleImage(image);
                        imgArray.push(data);
                    } else {
                        imgArray.push(values?.images[i]?.url || "");
                    }
                }
            }

            if (values?.thumbnail_image?.[0]?.originFileObj) {
                let image = {
                    file: values?.thumbnail_image?.[0]?.originFileObj,
                    image_name: "thumbnail_image",
                };
                const { data } = await postSingleImage(image);
                values.thumbnail_image = data;
            } else {
                values.thumbnail_image =
                    values?.thumbnail_image?.[0]?.url || "";
            }

            // const variants = values.variants?.map((variant) => {
            //     return {
            //         property_name: variant.property_name,
            //         property_values: variant.property_value?.map(
            //             (v) => v.value
            //         ),
            //     };
            // });

            let payload = {
                id: values?.id, // Correct spelling of parseInt
                name: values?.name,
                short_description: values?.short_description,
                description: values?.description,
                discount_type: values?.discount_type,
                discount: values?.discount,
                images: imgArray,
                thumbnail_image: values?.thumbnail_image,
                category: parseInt(values?.category), // Correct spelling
                price: parseFloat(values?.price),
                quantity: parseInt(values?.quantity), // Correct spelling
                variants: [values?.variants],
                is_active: true,
            };
            // return;
            if (values?.id) {
                const res = await updateProduct(payload);
                if (res?.success === true) {
                    message.success(res?.message);
                    form.resetFields();
                    router("/admin/product");
                }
                // message.success("Product updated successfully!");
            } else {
                const res = await postProduct(payload);
                if (res?.success === true) {
                    message.success(res?.message);
                    form.resetFields();
                    router("/admin/product");
                }
            }
        } catch (error) {
            message.error("Something went wrong while submitting the form.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <BiLoader
                    size={50}
                    className="animate-spin"
                    color={"#E67529"}
                />
            </div>
        );
    }

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            className="mt-2"
        >
            {languages?.docs?.map((l, index) => {
                return (
                    <div
                        key={index}
                        style={{
                            display: l.code === selectedLang ? "block" : "none",
                        }}
                    >
                        <HiddenInput name="id" />
                        <FormInput
                            name={["name", l.code]}
                            label={"Name"}
                            required
                            onBlur={(e) => {
                                const uniqueData = formData?.filter(
                                    (data) => data?.lang !== selectedLang
                                );
                                setFromData([
                                    ...uniqueData,
                                    {
                                        lang: selectedLang,
                                        value: e.target.value,
                                    },
                                ]);
                            }}
                        />
                        <FormInput
                            name={["short_description", l.code]}
                            label={i18n?.t("Short Description")}
                            textArea={true}
                            required
                        />
                        <div className="grid grid-cols-3 gap-3">
                        <div className="Form-select-customization">

                            <FormSelect
                                label={"Category"}
                                name={"category"}
                                options={category?.docs?.map((c) => ({
                                    value: c?.id,
                                    label: c?.name[l.code] || c?.name[i18n?.langCode],
                                }))}
                                required
                            /></div>
                            <FormInput
                                name={"price"}
                                label={i18n?.t("Price")}
                                type={"number"}
                                required
                            />
                            <FormInput
                                name={"quantity"}
                                label={i18n?.t("Quantity")}
                                type={"number"}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                        <div className="Form-select-customization">

                            <FormSelect
                                label={i18n?.t("Discount Type")}
                                name="discount_type"
                                options={[
                                    {
                                        value: "percentage",
                                        label: i18n?.t("Percent"),
                                    },
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
                        <div className="mb-4">
                            <p className="text-sm text-[#4A5568] font-medium">
                                {i18n?.t("Variants")}
                            </p>
                            <Switch
                                checked={isVarient}
                                onChange={() => setIsVarient(!isVarient)}
                                checkedChildren={
                                    <span className="text-white">
                                        {i18n?.t("On")}
                                    </span>
                                }
                                unCheckedChildren={
                                    <span className="text-white">
                                        {i18n?.t("Off")}
                                    </span>
                                }
                            />
                        </div>

                        {/* new try */}
                        {isVarient && (
                            <>

                                                <div className="w-1/3">
                                                    <Form.Item
                                                        label={i18n?.t(
                                                            "Property Name"
                                                        )}
                                                        name={[
                                                            'variants',
                                                            "property_name",
                                                            l?.code,
                                                        ]}
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                </div>
                                                <Form.Item label="Property Value">
                                                    <Form.List
                                                        name={[
                                                            'variants',
                                                            "property_values",
                                                        ]}
                                                    >
                                                        {(fields, { add, remove })=> (
                                                            <div
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    flexDirection:
                                                                        "column",
                                                                    rowGap: 16,
                                                                }}
                                                            >
                                                                {fields.map(
                                                                    (
                                                                        subField
                                                                    ) => (
                                                                        <div
                                                                            className="flex gap-4 items-center"
                                                                            key={
                                                                                subField.key
                                                                            }
                                                                        >
                                                                            <Form.Item
                                                                                noStyle
                                                                                name={[
                                                                                    subField.name,
                                                                                    l?.code,
                                                                                ]}
                                                                            >
                                                                                <Input placeholder="value" />
                                                                            </Form.Item>

                                                                            <FaMinusCircle
                                                                                className="text-red-500"
                                                                                size={
                                                                                    24
                                                                                }
                                                                                onClick={() => {
                                                                                    remove(
                                                                                        subField?.name
                                                                                    );
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    )
                                                                )}
                                                                <div
                                                                    className="bg-slate-500 text-white flex items-center justify-start gap-2 px-3 py-2 ml-auto rounded-full w-fit cursor-pointer"
                                                                    onClick={() =>
                                                                        add()
                                                                    }
                                                                >
                                                                    +{" "}
                                                                    {i18n?.t(
                                                                        "Add Property Value"
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Form.List>
                                                </Form.Item>
                                                </>
                        )}
                        <div className="mt-6">
                            <p className="text-sm text-[#4A5568] font-medium">
                                {i18n?.t("Description")}{" "}
                                <span className="text-primary">*</span>
                            </p>
                            <JodiEditor
                                name={["description", l.code]}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-4 my-4">
                            <MultipleImageInput
                                name={"thumbnail_image"}
                                label={i18n?.t("Thumbnail Image")}
                                required
                            />
                            <MultipleImageInput
                                name={"images"}
                                label={i18n?.t("Product Images")}
                                max={4}
                                required
                            />
                        </div>
                    </div>
                );
            })}
            <button
                onClick={() => noSelected({ form, setSelectedLang })}
                type="submit"
                className="mt-2.5 admin-btn"
            >
                {" "}
                {i18n?.t("Submit")}
            </button>
        </Form>
    );
};

export default ProductForm;
