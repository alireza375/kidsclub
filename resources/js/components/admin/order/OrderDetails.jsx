import React, { useEffect, useRef, useState } from "react";
import { useI18n } from "../../../providers/i18n";
import { useSite } from "../../../context/site";
import { useActionConfirm, useFetch, useTitle } from "../../../helpers/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { changeOrderStatus, fetchOrderDetails } from "../../../helpers/backend";
import { Select } from "antd";
import { FaPrint } from "react-icons/fa";
import dayjs from "dayjs";
import { columnFormatter } from "../../../helpers/utils";
import Invoice from "./Invoice";
import { useReactToPrint } from "react-to-print";

const OrderDetails = () => {
    const { id } = useParams();
    const [data, getData] = useFetch(fetchOrderDetails, { id });
    const navigate = useNavigate();
    const i18n = useI18n();
    const { sitedata } = useSite();
    useTitle(
        sitedata?.title + " | " + i18n.t("Order") + " - " + i18n.t("Admin")
    );

    useEffect(() => {
        getData();
    }, [id]);

    const invoiceRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => invoiceRef.current,
    });
    const printInvoice = () => {
        const printContent = document.getElementById("invoice-printable");
        const printWindow = window.open("", "_blank");
        printWindow.document.write(printContent.innerHTML);
        printWindow.document.close();
        printWindow.print();
    };

    if (!data) return <div>Loading...</div>;

    return (
        <div className="min-h-full p-4 bg-gray-100 rounded-md">
            <div className="min-h-screen p-6 bg-gray-100">
                <div className="p-6 space-y-8 bg-white rounded-lg shadow-lg">
                    {/* Order Progress Tracker */}
                    <div className="flex flex-col flex-wrap items-center justify-between gap-4 pb-4 border-b md:flex-row">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {i18n.t("Order Details")}
                        </h2>
                        <div className="flex flex-col items-center gap-5 md:flex-row">
                            <Select
                                defaultValue={data?.status}
                                style={{ width: 150 }}
                                className="border-gray-300 rounded-md"
                                onChange={(value) => {
                                    useActionConfirm(
                                        changeOrderStatus,
                                        { id: data?.id, status: value },
                                        () => {
                                            getData();
                                        }
                                    );
                                }}
                            >
                                <Select.Option value="pending">
                                    {i18n?.t("Pending")}
                                </Select.Option>
                                <Select.Option value="cancelled">
                                    {i18n?.t("cancelled")}
                                </Select.Option>
                                <Select.Option value="completed">
                                    {i18n?.t("Completed")}
                                </Select.Option>
                            </Select>
                            <button
                                onClick={printInvoice}
                                // onClick={handlePrint}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors rounded-full shadow-sm bg-teal-blue hover:bg-primary-dark"
                            >
                                <FaPrint className="text-lg" />{" "}
                                {i18n?.t("Print Invoice")}
                            </button>
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors shadow-sm admin-btn bg-teal-blue hover:bg-primary-dark"
                            >
                                {i18n?.t("Back")}
                            </button>
                        </div>
                    </div>

                    {/* Order Information */}
                    <div className="grid gap-6 pb-6 border-b md:grid-cols-3">
                        <div>
                            <h3 className="mb-2 text-lg font-semibold text-gray-800">
                                {i18n.t("Order Information")}
                            </h3>
                            <p className="text-gray-600">
                                <span className="font-semibold">
                                    {i18n?.t("Order ID")}:
                                </span>{" "}
                                {data?.order_id}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-semibold">
                                    {i18n?.t("Order Date")}:
                                </span>{" "}
                                {dayjs(data?.created_at).format("DD/MM/YYYY")}
                            </p>
                        </div>
                        <div>
                            <h3 className="mb-2 text-lg font-semibold text-gray-800">
                                {i18n?.t("Shipping Address")}
                            </h3>
                            <p className="text-gray-600">
                                <span className="font-semibold">
                                    {i18n?.t("Phone")}:
                                </span>{" "}
                                {data?.shipping_address?.phone}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-semibold">
                                    {i18n?.t("Address")}:
                                </span>{" "}
                                {data?.shipping_address?.location},
                                {data?.shipping_address?.city}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-semibold">
                                    {i18n?.t("zip code")}:
                                </span>{" "}
                                {data?.shipping_address?.zip_code}
                            </p>
                        </div>
                        <div className="">
                            <h3 className="mb-4 text-lg font-semibold text-gray-800">
                                {i18n?.t("Customer Details")}
                            </h3>
                            <div className="flex flex-col gap-2">
                                <p className="text-gray-600">
                                    <span className="font-semibold">
                                        {i18n?.t("Name")}:
                                    </span>{" "}
                                    {data?.user?.name}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-semibold">
                                        {i18n?.t("Email")}:
                                    </span>{" "}
                                    {data?.user?.email}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-semibold">
                                        {i18n?.t("Phone")}:
                                    </span>{" "}
                                    {data?.user?.phone}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-gray-800">
                            {i18n?.t("Order Items")}
                        </h3>
                        <div className="space-y-4">
                            {data?.items?.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 rounded-lg shadow-md bg-gray-50"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={item?.thumbnail_image}
                                            alt={columnFormatter(item?.name)}
                                            className="object-cover w-16 h-16 rounded-md"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                {columnFormatter(item?.name)}
                                            </p>
                                            {item?.variant &&
                                                item?.variant[0] &&
                                                item?.variant.map(
                                                    (variant, index) => (
                                                        <p className="my-2 text-sm font-bold text-gray-800">
                                                            <span className="">
                                                                {columnFormatter(
                                                                    item
                                                                        ?.variant[
                                                                        index
                                                                    ]
                                                                        ?.property_name
                                                                )}
                                                            </span>{" "}
                                                            {variant?.property_name &&
                                                                ": "}
                                                            <span className="text-gray-500">
                                                                {columnFormatter(
                                                                    item
                                                                        ?.variant[
                                                                        index
                                                                    ]
                                                                        ?.property_value
                                                                )}
                                                            </span>
                                                        </p>
                                                    )
                                                )}
                                            <p className="text-sm text-gray-600">
                                                {i18n?.t("Quantity")}:{" "}
                                                {item?.quantity}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="font-semibold text-gray-800">
                                        {data?.currencySymbol}
                                        {item?.total}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total Price */}
                    <div className="pt-6 border-t">
                        <h2 className="text-lg text-gray-800 text-end">
                            {i18n.t("Discount")}:{" "}
                            <span className="font-bold text-green-600">
                                {data?.currencySymbol}
                                {data?.discount}
                            </span>
                        </h2>

                        <h2 className="mt-2 text-xl text-gray-800 text-end">
                            {i18n.t("Total")}:{" "}
                            <span className="font-bold text-primary">
                                {data?.currencySymbol}
                                {data?.subTotal}
                            </span>
                        </h2>
                    </div>

                    {/* Printable Invoice */}
                    <div id="invoice-printable">
                        <Invoice order={data} ref={invoiceRef} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
