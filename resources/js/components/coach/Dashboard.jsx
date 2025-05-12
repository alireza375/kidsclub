import React, { useEffect } from "react";
import { FaCalendarAlt, FaEdit, FaTrophy } from "react-icons/fa";
import { FaCartShopping, FaEye } from "react-icons/fa6";
import { IoIosPersonAdd, IoMdInformationCircleOutline } from "react-icons/io";
import user from "../../../images/user.png";
import { useI18n } from "../../providers/i18n";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "../common/Avatar";
import { useUser } from "../../context/user";
import { useFetch, useTitle } from "../../helpers/hooks";
import { CoachDashboardLayout } from "../../helpers/backend";
import { columnFormatter } from "../../helpers/utils";
import dayjs from "dayjs";
import { useSite } from "../../context/site";

const Dashboard = () => {
    const [data, getData] = useFetch(CoachDashboardLayout);
    const navigate = useNavigate();
    const i18n = useI18n();
    const { user, userLoading } = useUser();
    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("Dashboard") + " - " + i18n.t("Coach"));
    return (
        <div className="">
            <div className="flex flex-col lg:flex-row gap-x-4">
                {/* Left Section */}
                <div className="shadow-dashboard rounded-[15px] w-full lg:w-2/3 p-4 md:max-w-[280px] flex justify-center flex-col">
                    <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 mb-7">
                        <h1 className="text-secondary text-3xl font-bold mb-2">
                            {data?.totalServices}
                        </h1>
                        <p className="text-gray-600 text-sm font-medium">
                            {i18n?.t("Total Services")}
                        </p>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                        <h1 className="text-secondary text-3xl font-bold mb-2">
                            {data?.totalStudents}
                        </h1>
                        <p className="text-gray-600 text-sm font-medium">
                            {i18n?.t("Total Students")}
                        </p>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex flex-col gap-6 w-full ">
                    {/* Right Section */}
                    <div className="shadow-dashboard rounded-lg p-4 mt-5 lg:mt-0 bg-white">
                        <h1 className="text-secondary text-lg font-semibold mb-4">
                            {i18n?.t("Notice")}
                        </h1>
                        <div className="overflow-auto">
                            <table className="min-w-full table-auto bg-white rounded-lg shadow-sm">
                                <thead>
                                    <tr className=" text-secondary border-b font-nunito">
                                        <th className="px-3 py-4 text-left text-sm">
                                            {i18n?.t("Date")}
                                        </th>
                                        <th className="px-3 py-4 text-left text-sm">
                                            {i18n?.t("Title")}
                                        </th>
                                        <th className="px-3 py-4 text-left text-sm">
                                            {i18n?.t("Status")}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="font-nunito text-secondary">
                                    {data?.notices?.map((notice, index) => (
                                        <tr key={index} className="bnotice?-b">
                                            <td className="px-3 py-4 text-sm">
                                                {dayjs(
                                                    notice?.created_at
                                                ).format("DD/MM/YYYY")}
                                            </td>
                                            <td className="px-3 py-4 text-sm">
                                                {columnFormatter(notice?.title).slice(0, 40) + "..."}
                                            </td>
                                            <td className="px-3 py-4 text-sm">
                                                {notice?.is_active
                                                    ? "Active"
                                                    : "Inactive"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-y-4 lg:gap-y-0 lg:gap-x-4 mt-5">
                {/* Newest Members */}
                <div className="shadow-dashboard rounded-lg p-4 bg-white w-full lg:w-2/3">
                    <h1 className="text-secondary text-lg font-semibold mb-4">
                        {i18n?.t("Newest Members")}
                    </h1>
                    <div className="overflow-auto">
                        <table className="min-w-full table-auto bg-white rounded-lg shadow-sm">
                            <thead>
                                <tr className="text-secondary border-b font-nunito">
                                    <th className="px-3 py-4 text-left text-sm">
                                        {i18n?.t("Name")}
                                    </th>
                                    <th className="px-3 py-4 text-left text-sm">
                                        {i18n?.t("Image")}
                                    </th>
                                    <th className="px-3 py-4 text-left text-sm">
                                        {i18n?.t("Date")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="font-nunito text-secondary">
                                {data?.latestChildren?.map((child, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="px-3 py-4 text-sm">
                                            {child?.name || "N/A"}
                                        </td>
                                        <td className="px-3 py-4 text-sm">
                                            <img
                                                src={
                                                    child?.image ||
                                                    "placeholder-image-url"
                                                }
                                                alt={child?.name || "No Image"}
                                                className="w-10 h-10 object-cover rounded-full"
                                            />
                                        </td>
                                        <td className="px-3 py-4 text-sm">
                                            {child?.joined_at
                                                ? dayjs(
                                                      child?.joined_at
                                                  ).format("YYYY-MM-DD")
                                                : "N/A"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                   {data?.latestChildren?.length > 1 && <button
                            onClick={() => navigate("/coach/members")}
                            className="text-sm text-blue-500 mt-2 inline-block hover:underline"
                        >
                            {i18n?.t("See All")}
                        </button>
                   }
                </div>

                {/* Upcoming Events */}
                <div className="shadow-dashboard rounded-lg p-4 bg-white w-full lg:w-1/3">
                    <h1 className="text-secondary text-lg font-semibold mb-4">
                        {i18n?.t("Upcoming Events")}
                    </h1>
                    <div className="overflow-auto space-y-4">
                        {
                            data?.latestEvents?.map((i,index)=>{
                                return (
                                    <div className="flex items-center gap-5"key={index}>
                                    <img
                                        className="w-14 h-14 object-cover rounded-lg"
                                        src={i?.image}
                                        alt="Event"
                                    />
                                    <div>
                                        <h1 className="text-sm font-semibold">
                                        {columnFormatter(JSON.parse(i?.title)) ? columnFormatter(JSON.parse(i?.title)): 'title'}
                                        </h1>
                                        <p className="text-sm text-gray-500">
                                            {i?.event_date}
                                        </p>
                                    </div>
                                </div>
                                )
                            })

                        }
                      
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
