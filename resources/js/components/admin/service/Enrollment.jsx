import React from 'react'
import { useI18n } from '../../../providers/i18n';
import { fetchServiceEnrollList } from '../../../helpers/backend';
import { useFetch } from '../../../helpers/hooks';
import Table, { TableImage } from '../../common/form/table';
import { Tooltip } from 'antd';
import { columnFormatter } from '../../../helpers/utils';
import dayjs from 'dayjs';

const Enrollment = () => {
    const [data , getData] = useFetch(fetchServiceEnrollList);
    const i18n = useI18n();
    const enrollmentData = [];
    const enrollmentLoading = false;
    const columns = [
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
            text: "Service",
            dataField: "service",
            formatter: (_, d) => (
                <div>
                    {columnFormatter(d?.name).slice(0, 30) + "..." }
                </div>
            ),
        },
        {
            text: "Subtotal",
            dataField: "subTotal",
            formatter: (_, d) => (
                <div>
                    {d?.currencySymbol}{d?.Total}
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
            text: "Enrolled Date",
            dataField: "created_at",
            formatter: (_, d) => (
                <div>
                    {dayjs(d?.created_at).format("MMM DD, YYYY")}
                </div>
            ),
        }
    ];
  return (
    <div>
        <Table
                    columns={columns}
                    data={data}
                    loading={enrollmentLoading}
                    onReload={getData}
                     noActions

                    // onDelete={deleteEnrollment}
                    indexed
                    pagination
                    i18n={i18n}
                />
    </div>
  )
}

export default Enrollment