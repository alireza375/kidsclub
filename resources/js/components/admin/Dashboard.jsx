import React from "react";
import { Card } from "antd";
import {
    BiAward,
    BiCalendar,
    BiCreditCard,
    BiTrendingUp,
} from "react-icons/bi";
import { FaStar, FaUsers } from "react-icons/fa6";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { useI18n } from "../../providers/i18n";
import { useFetch, useTitle } from "../../helpers/hooks";
import { fetchDashboard } from "../../helpers/backend";
import { columnFormatter } from "../../helpers/utils";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { useSite } from "../../context/site";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const CardComponent = ({
    title,
    icon,
    value,
    percentage,
    description,
    link,
}) => {
    return (
        <Link to={link} className="cursor-pointer">
            <Card className="transition-all hover:shadow-lg">
                <div className="flex items-center justify-between pb-2">
                    <div className="text-sm font-medium text-gray-700">
                        {title}
                    </div>
                    {icon}
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {value}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {percentage} {description}
                    </p>
                </div>
            </Card>
        </Link>
    );
};

export default function Dashboard() {
    const [dashboard, getDashboard] = useFetch(fetchDashboard);
    const i18n = useI18n();

    const data = {
        labels: ["Total Income", "Monthly Income"],
        datasets: [
            {
                label: "Income",
                data: [dashboard?.income?.total, dashboard?.income?.monthly],
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderWidth: 1,
                pointBackgroundColor: "#FE5C45",
                pointRadius: 5,
                fill: true,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };
    const { sitedata } = useSite();
    useTitle(
        sitedata?.title + " | " + i18n.t("Dashboard") + " - " + i18n.t("Admin")
    );
    return (
        <div className="p-4 space-y-4 rounded-md bg-gray-50">
            {/* Overview Section */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
                <>
                    <CardComponent
                        link={"/admin/users"}
                        title={i18n?.t("Total Members")}
                        value={dashboard?.totals?.users}
                        icon={<FaUsers className="h-6 w-6 text-[#376179]" />}
                    />
                    <CardComponent
                        link={"/admin/users"}
                        title={i18n?.t("Active Members")}
                        value={dashboard?.totals?.activeUsers}
                        icon={<FaUsers className="h-6 w-6 text-[#376179]" />}
                    />
                    <CardComponent
                        link={"/admin/coachs"}
                        title={i18n?.t("Total Coaches")}
                        value={dashboard?.totals?.coaches}
                        icon={<FaUsers className="h-6 w-6 text-[#376179]" />}
                    />
                    <CardComponent
                        link={"/admin/packages"}
                        title={i18n?.t("Total Package Sell")}
                        value={dashboard?.totals?.paidSubscriptions}
                        icon={<BiCalendar className="h-6 w-6 text-[#376179]" />}
                    />
                </>
            </div>

            {/* Summary Section */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <CardComponent
                    link={"/admin/events"}
                    title={i18n?.t("Total Event")}
                    value={dashboard?.totals?.events}
                    icon={<BiAward className="h-6 w-6 text-[#376179]" />}
                />
                <CardComponent
                    link={"/admin/orders"}
                    title={i18n?.t("Total Orders")}
                    value={dashboard?.totals?.orders}
                    icon={<BiCreditCard className="h-6 w-6 text-[#376179]" />}
                />
                <CardComponent
                    link={"/admin/service"}
                    title={i18n?.t("Total Enrolled Services")}
                    value={dashboard?.totals?.enrolledServices}
                    icon={<BiTrendingUp className="h-6 w-6 text-[#376179]" />}
                />
                <CardComponent
                    link={"/admin/coupons"}
                    title={i18n?.t("Total Active Coupons")}
                    value={dashboard?.totals?.coupons}
                    icon={<BiTrendingUp className="h-6 w-6 text-[#376179]" />}
                />
            </div>

            {/* Details Section */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                <Card className="transition-all hover:shadow-lg">
                    <h2 className="text-xl font-semibold">
                        {i18n?.t("Upcoming Events")}
                    </h2>
                    <div className="space-y-4 mt-4 h-[150px] overflow-y-scroll no-scrollbar">
                        {dashboard?.upcoming?.events?.map((event, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center gap-[10px] text-gray-700"
                            >
                                <span className="font-poppins">
                                    {columnFormatter(event?.title)}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {dayjs(event?.date).format("DD MMMM")}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="transition-all hover:shadow-lg">
                    <h2 className="text-xl font-semibold">
                        {i18n?.t("Upcoming Birthdays")}
                    </h2>
                    <div className="space-y-4 mt-4 h-[150px] overflow-y-scroll no-scrollbar">
                        {dashboard?.upcoming?.birthdays?.map(
                            (birthday, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center gap-[10px] text-gray-700"
                                >
                                    <span className="font-poppins">
                                        🎂 {birthday?.name}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {dayjs(birthday?.dob).format("DD MMMM")}
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                </Card>

                <Card className="transition-all hover:shadow-lg">
                    <h2 className="text-xl font-semibold">
                        {i18n?.t("Top Rated Sevices")}
                    </h2>
                    <div className="space-y-4 mt-4 h-[150px] overflow-y-scroll no-scrollbar">
                        {dashboard?.topRatedServices?.map((service, index) => (
                            <div
                                key={index}
                                className="flex justify-between gap-[10px] items-center text-gray-700"
                            >
                                <span className="font-poppins">
                                    {columnFormatter(service.name)}
                                </span>
                                <span className="flex items-center">
                                    <FaStar className="w-4 h-4 mr-2 text-yellow-400" />
                                    <span className="text-sm">
                                        {service.rating}
                                    </span>
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <div className="overflow-x-auto ">
                <div className="sm:w-full w-[500px]">
                <Card className="transition-all hover:shadow-lg ">
                    <h2 className="text-xl font-semibold">
                        {i18n?.t("Earning Growth")}
                    </h2>
                    <div className="mt-4 ">
                        <Line data={data} options={options} />
                    </div>
                </Card>
                </div>
                </div>
                <div className="w-full p-4 bg-white rounded-md hover:shadow-md">
                    <h2 className="my-3 text-xl font-sm semibold">
                        {i18n?.t("Recent Orders")}
                    </h2>
                    <div className="overflow-x-auto ">
                        <table className="md:w-full border-collapse bg-white w-[800px]">
                            <thead>
                                <tr className="border-b border-gray-300 text-[#376179]">
                                    <th className="py-2 font-poppins">
                                        {i18n?.t("Index")}
                                    </th>
                                    <th className="py-2 font-poppins">
                                        {i18n?.t("Order ID")}
                                    </th>
                                    <th className="py-2 font-poppins">
                                        {i18n?.t("User")}
                                    </th>
                                    <th className="py-2 font-poppins">
                                        {i18n?.t("Total")}
                                    </th>
                                    <th className="py-2 font-poppins">
                                        {i18n?.t("Status")}
                                    </th>
                                    <th className="py-2 font-poppins">
                                        {i18n?.t("Ordered At")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-700 divide-y divide-gray-200">
                                {dashboard?.orders.recent.map((order) => (
                                    <tr
                                        className="text-gray-500 border-b border-gray-300 last:border-b-0"
                                        key={order.id}
                                    >
                                        <td className="py-2 text-center font-nunito">
                                            #
                                            {dashboard?.orders.recent.indexOf(
                                                order
                                            ) + 1}
                                        </td>
                                        <td className="py-2 text-center font-nunito">
                                            <Link
                                                to={`/admin/order/${order?.id}`}
                                                className="text-blue-500 hover:underline"
                                            >
                                                {order.order_id}
                                            </Link>
                                        </td>
                                        <td className="py-2 text-center font-nunito">
                                            {order?.user?.name}
                                        </td>
                                        <td className="py-2 text-center text-black font-nunito">
                                            {order?.currencySymbol}
                                            {order?.total}
                                        </td>
                                        <td className="py-2 text-center font-nunito">
                                            {order?.status}
                                        </td>
                                        <td className="py-2 text-center font-nunito">
                                            {new Date(
                                                order?.created_at
                                            ).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
