import React from "react";
import { columnFormatter } from "../../../helpers/utils";
import { useI18n } from "../../../providers/i18n";
import dayjs from "dayjs";
import { useSite } from "../../../context/site";

const Invoice = ({ order }) => {
    const {sitedata} = useSite();
    const i18n = useI18n();
    return (
        <div className="max-w-3xl p-8 mx-auto bg-white rounded-lg shadow-lg">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{i18n?.t("Invoice")}</h1>
                <p className="text-sm text-gray-600">{i18n?.t("Order ID")}: {order?.order_id}</p>
                <p className="text-sm text-gray-600">{i18n?.t("Order Date")}: {dayjs(order?.created_at).format("DD/MM/YYYY")}</p>
            </div>
            <div className="">
                <div className="flex items-center justify-center w-20 h-10">
                <img src={sitedata?.logo} alt="" className="w-full h-full" />
                </div>
                <p className="text-base text-gray-600 !text-start">Address: {sitedata?.address}</p>
                <p className="text-base text-gray-600 !text-start">Email: {sitedata?.email}</p>
                <p className="text-base text-gray-600 !text-start">Phone: {sitedata?.phone}</p>
            </div>
        </div>

        <hr className="mb-8 border-gray-200" />

        {/* Customer Information */}
        <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">Billing Details</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <p className="text-gray-700">Name: {order?.user?.name}</p>
                <p className="text-gray-700">Email: {order?.user?.email}</p>
                <p className="text-gray-700">Phone: {order?.user?.phone}</p>
                <p className="text-gray-700">Address: {order?.shipping_address?.location},{order?.shipping_address?.city}</p>
            </div>
        </div>

        {/* Order Items */}
        <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">Order Items</h2>
            <table className="w-full border border-collapse border-gray-300 table-auto">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-6 py-3 text-sm font-medium text-left text-gray-700 border-b">Item</th>
                        <th className="px-6 py-3 text-sm font-medium text-right text-gray-700 border-b">Quantity</th>
                        <th className="px-6 py-3 text-sm font-medium text-right text-gray-700 border-b">Price</th>
                        {/* <th className="px-6 py-3 text-sm font-medium text-right text-gray-700 border-b">Total</th> */}
                    </tr>
                </thead>
                <tbody>
                    {order?.items.map((item, index) => (
                        <tr key={index} className="border-b last:border-b-0">
                            <td className="px-6 py-4 text-sm text-gray-700">{columnFormatter(item?.name)} {item?.variant && item?.variant[0]?.length > 0 && "( " +columnFormatter(item?.variant[0]?.property_name) + " : " + columnFormatter(item?.variant[0]?.property_value) +" )"}</td>
                            <td className="px-6 py-4 text-sm text-right text-gray-700">{item?.quantity}</td>
                            <td className="px-6 py-4 text-sm text-right text-gray-700">
                                {order?.currencySymbol}{item?.total?.toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Total Section */}
        <div className="flex justify-end">
            <div className="w-full md:w-1/2">
                <div className="flex items-center justify-between py-4 mt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-700">Discount:</p>
                    <p className="text-sm font-semibold text-gray-800">{order?.currencySymbol}{order?.discount}</p>
                </div>
                <div className="flex items-center justify-between py-4 border-t border-gray-200">
                    <p className="text-lg font-semibold text-gray-800">Total:</p>
                    <p className="text-2xl font-bold text-green-600">{order?.currencySymbol}{order?.subTotal}</p>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">Thank you for your purchase!</p>
            <p className="text-sm text-gray-500">For any inquiries, please contact us at {sitedata?.address}</p>
        </div>
    </div>

    );
};

export default Invoice;
