import React, { useEffect, useState } from "react";
import { useI18n } from "../../../providers/i18n";
import { Form, Modal, Select, Switch } from "antd";
import {
    useAction,
    useActionConfirm,
    useFetch,
    useTitle,
} from "../../../helpers/hooks";
import {
    changeOrderStatus,
    delOrder,
    fetchCoaches,
    fetchOrderList,
    postCoach,
    postSingleImage,
    updateUserStatus,
} from "../../../helpers/backend";
import Table, { TableImage } from "../../common/form/table";

import Avatar from "../../common/Avatar";
import { useSite } from "../../../context/site";
import { useNavigate } from "react-router-dom";
import { columnFormatter } from "../../../helpers/utils";

const Order = () => {
    const i18n = useI18n();
    let { languages, langCode } = i18n;
    const [loading, setLoading] = useState(false);
    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("Order") + " - " + i18n.t("Admin"));

    const [data, getData] = useFetch(fetchOrderList);
    const navigate = useNavigate();

    const columns = [
        {
            text: "Order ID",
            dataField: "items",
            formatter: (_, d) => (
                <div>
                    {d?.order_id}
                </div>
            ),
        },
        {
            text: "User",
            dataField: "user",
            formatter: (_, d) => (
                <div>
                    {d?.user?.name}
                </div>
            ),
        },
        {
            text: "Total",
            dataField: "subTotal",
            formatter: (_, d) => (
                <div>
                    {d?.currencySymbol}{d?.subTotal}
                </div>
            ),
        },
        {
            text: "Payment Method",
            dataField: "payemnt",
            formatter: (_, d) => (
                <div>
                    {d?.payment?.method}
                </div>
            ),
        },
        {
            text: "Payment Status",
            dataField: "is_paid",
            formatter: (_, d) => (
                <div>
                    {d?.is_paid ? <span class='text-green-500'>{i18n?.t("Paid")}</span> : <span class='text-red-500'>{i18n?.t("Unpaid")}</span>}
                </div>
            ),
        },
        {
            text: "Total Items",
            dataField: "status",
            formatter: (_, d) => (
                <div>
                    {d?.items?.length}
                </div>
            ),
        },
        {
            text: "Status",
            dataField: "status",
            formatter: (_, d) => (
                <Select
                defaultValue={d?.status}
                style={{ width: 120 }}
                onChange={(value) => {
                    useActionConfirm(
                        changeOrderStatus,
                        { id: d?.id, status: value },
                        () => {
                            getData();
                        }
                    );
                }}
            >
                <Select.Option value="pending">{i18n?.t("Pending")}</Select.Option>
                <Select.Option value="Cancelled">{i18n?.t("Cancelled")}</Select.Option>
                <Select.Option value="completed">{i18n?.t("Completed")}</Select.Option>
            </Select>
            ),
        },
    ];
    return (
        <div className="min-h-full p-4 bg-gray-100 rounded-md">
            <h1 className="mb-4 text-2xl font-bold">{i18n?.t("Orders")}</h1>
            <Table
                columns={columns}
                data={data}
                onReload={getData}
                loading={loading}
                pagination
                indexed
                onDelete={delOrder}
                onView={(data) =>
                        navigate(`/admin/order/${data?.id}`)
                    }
                langCode={langCode}
                i18n={i18n}
            />




        </div>
    );
};

export default Order;
