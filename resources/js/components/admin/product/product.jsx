import React, { useState } from "react";
import { Form, Switch } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import {
    deleteProduct,
    fetchAllProduct,
    postPublish,
} from "../../../helpers/backend";
import { useAction, useFetch, useTitle } from "../../../helpers/hooks";
import { useI18n } from "../../../providers/i18n";
import { columnFormatter } from "../../../helpers/utils";
import Table, { TableImage } from "../../common/form/table";
import ProductCategory from "./category";
import { FaStar } from "react-icons/fa";
import { useSite } from "../../../context/site";
const AdminProductList = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const i18n = useI18n();
    let { langCode } = useI18n();
    const [data, getData, { loading }] = useFetch(fetchAllProduct);
    const [open, setOpen] = useState("product");
    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("Product") + " - " + i18n.t("Admin"));
    const columns = [
        {
            text: "Created At",
            dataField: "created_at",
            formatter: (_, d) => (
                <div>{dayjs(d?.created_at).format("MMM DD , YYYY")}</div>
            ),
        },
        {
            text: "Image",
            dataField: "thumbnail_image",
            formatter: (_, d) => {
                return (
                    <div className="flex gap-x-3 space-x-1">
                        <TableImage url={d?.thumbnail_image} />
                    </div>
                );
            },
        },
        {
            text: "Name",
            dataField: "name",
            formatter: (value) => {
                const formattedValue = columnFormatter(value);
                const truncatedText =
                    formattedValue?.length > 60
                        ? `${formattedValue.slice(0, 60)}...`
                        : formattedValue;
                return <h2>{truncatedText}</h2>;
            },
        },
        {
            text: "Price",
            dataField: "price",
            formatter: (_, d) => (
                <span>
                    {d?.currencySymbol}
                    {d?.price}
                </span>
            ),
        },
        {
            text: "Quantity",
            dataField: "quantity",
            formatter: (_, d) => <span>{d?.quantity}</span>,
        },
        {
            text: "Published",
            dataField: "image",
            formatter: (_, d) => {
                const handleTogglePublish = async () => {
                    try {
                        await useAction(postPublish, { productId: d?.id });
                        getData();
                    } catch (error) {
                        console.error("Failed to toggle publish status:", error);
                    }
                };

                return (
                    <Switch 
                        checked={d?.publish}
                        onChange={handleTogglePublish}
                        checkedChildren={
                            <span className="text-white">
                                {i18n.t("Published")}
                            </span>
                        }
                        unCheckedChildren={
                            <span className="text-white">
                                {i18n.t("Unpublished")}
                            </span>
                        }
                    />
                );
            },
        }

    ];
    const handleClick = () => {
        navigate("/admin/product/add");
        form.resetFields();
    };
    return (
        <div className="p-4 bg-gray-100 min-h-full rounded-md">
            <div className="flex justify-center items-center gap-12 mb-8 border p-2">
                <div
                    onClick={() => setOpen("category")}
                    className={`w-full border-2 border-transparent py-2 border-teal-blue cursor-pointer hover:text-white hover:bg-teal-blue text-xl font-nunito duration-300 ease-in-out text-center
                        ${
                            open === "category"
                                ? "bg-teal-blue text-white border-teal-blue"
                                : "text-gray-700 border-gray-300"
                        }
                        transition-all`}
                >
                    <h1>{i18n.t("Product Category")}</h1>
                </div>
                <div
                    onClick={() => setOpen("product")}
                    className={`w-full border-2 border-transparent py-2 border-teal-blue cursor-pointer hover:text-white hover:bg-teal-blue text-xl font-nunito duration-300 ease-in-out text-center
                        ${
                            open === "product"
                                ? "bg-teal-blue text-white border-teal-blue"
                                : "text-gray-700 border-gray-300"
                        }
                        transition-all`}
                >
                    <h1>{i18n.t("All Products")}</h1>
                </div>
            </div>
            {open === "category" ? (
                <ProductCategory/>
            ) : (
                <Table
                    columns={columns}
                    data={data}
                    loading={loading}
                    onReload={getData}
                    action={
                        <>
                            <button
                                type="primary"
                                onClick={handleClick}
                                className="bg-teal-blue text-white px-4 py-2 rounded-md"
                            >
                                {i18n.t("Add Product")}
                            </button>
                        </>
                    }
                    onEdit={(values) => {
                        form.resetFields();
                        navigate(`/admin/product/edit/${values?.id}`);
                    }}
                    onView={(d) => {
                        navigate(`/admin/product/view/${d?.id}`);
                    }}
                    actions={(data) => (
                        <>
                            <button
                                className="text-yellow-500 border border-yellow-500 px-2 py-1 rounded"
                                onClick={() => {
                                    navigate(`/admin/product/review/${data?.id}`);
                                }}
                            >
                               <FaStar/>
                            </button>
                        </>
                    )}
                    onDelete={deleteProduct}
                    indexed
                    pagination
                    langCode={langCode}
                    i18n={i18n}
                />
            )}
        </div>
    );
};

export default AdminProductList;
