import React, { useEffect } from "react";
import { FaCalendarAlt, FaEdit, FaTrophy } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { IoIosPersonAdd, IoMdInformationCircleOutline } from "react-icons/io";
import user from "../../../images/user.png";
import { useI18n } from "../../providers/i18n";
import { Link } from "react-router-dom";
import { useUser } from "../../context/user";
import { Skeleton } from "antd";
import Avatar from "../common/Avatar";
import { useFetch, useTitle } from "../../helpers/hooks";
import { fetchUserDashboard } from "../../helpers/backend";
import dayjs from "dayjs";
import { columnFormatter } from "../../helpers/utils";
import { useSite } from "../../context/site";

// Card Component
const Card = ({ title, count, icon }) => {
    return (
        <div className="relative px-2 py-5 pt-3 bg-white border rounded-lg shadow-dashboard">
            <div className="flex items-center justify-between mb-2">
                <h3 className=" text-sm font-semibold font-nunito">
                    {title}
                </h3>
                <span className="text-xl text-primary ">{icon}</span>
            </div>
            <div className="mt-2 ms-5">
                <p className="text-3xl font-bold font-arial text-slate-700">
                    {count}
                </p>
            </div>

        </div>
    );
};

const statusColor = (status) => {
    switch (status) {
        case "accepted":
            return "text-blue-500";
        case "completed":
            return "text-green-500";
        case "Scheduled":
            return "text-green-500";
        case "pending":
            return "text-orange-500";
        case true:
            return "text-green-500";
        case false:
            return "text-red-500";
        case "Active":
            return "text-green-500";
        case "Inactive":
            return "text-red-500";
        default:
            return "text-gray-500";
    }
};
const Dashboard = () => {
  const [data, getData] = useFetch(fetchUserDashboard);
  const i18n = useI18n();
  const { user , userLoading } = useUser();
  const {sitedata} = useSite();
  useTitle(sitedata?.title + " | " + i18n.t("Dashboard") + " - " + i18n.t("User"));
    return (
    <div className="">
       <div className="flex flex-col lg:flex-row gap-x-4 ">
      {/* Left Section */}
      <div className="shadow-dashboard rounded-[15px] w-full lg:w-2/3 p-4">
        <div className="relative flex flex-col items-center py-5">
          {/* Profile Image */}
          <div className="md:size-[200px] size-[100px] rounded-full p-1 border-primary border-2">
            {
              user?.image ? (
                <img
              className="object-cover w-full h-full rounded-full"
              src={user?.image}
              alt="User"
            />
              ) : (
                <Avatar name={user?.name} classes="h-full w-full rounded-full object-cover md:text-[100px] text-[50px]" />
              )
            }
          </div>
          <h1 className="py-2 text-xl font-semibold lg:text-2xl font-arial text-slate-700">
            {userLoading ?   <Skeleton.Input active={true} size={"default"} /> : user?.name}
          </h1>
          {/* Edit Profile */}
          <Link
            to="/user/profile"
            title="Edit Profile"
            className="absolute text-2xl duration-300 ease-in-out cursor-pointer top-5 right-5 text-neutral-400 hover:text-primary"
          >
            <FaEdit />
          </Link>
        </div>
        {/* Cards Section */}
        <div className="grid grid-cols-1 gap-4 mx-3 sm:grid-cols-2 xl:grid-cols-3 ">
           <Card
              title={i18n?.t("Total Services")}
              count={data?.totalServices}
              icon={<FaTrophy />}
            />
           <Card
              title={i18n?.t("Upcoming Events")}
              count={data?.upcomingEventsCount}
              icon={<FaCalendarAlt />}
            />
           <Card
              title={i18n?.t("Total Order")}
              count={data?.totalOrders}
              icon={<FaCartShopping />}
            />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col w-full gap-4 lg:w-1/3">
        {/* Recent Orders */}
        <div className="p-4 mt-4 bg-white rounded-lg shadow-dashboard lg:mt-0">
          <h1 className="mb-4 text-lg font-semibold text-primary">
           {i18n?.t("Recent Orders")}
          </h1>
          <div className="h-[357px] overflow-auto">
            <table className="min-w-full bg-white rounded-lg table-auto ">
              <thead>
                <tr className="border-b text-secondary">
                  <th className="px-3 py-4 text-sm text-left">{i18n?.t("ID")}</th>
                  <th className="px-3 py-4 text-sm text-left">{i18n?.t("Date")}</th>
                  <th className="px-3 py-4 text-sm text-left">{i18n?.t("Status")}</th>
                </tr>
              </thead>
              <tbody className="">
                {data?.recentOrders?.map((order, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? "hover:bg-gray-100" : "hover:bg-gray-200"} border-b last:border-b-0`}
                  >
                    <td className="px-3 py-4 text-sm text-gray-800">
                      {order?.order_id}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-800">
                      {dayjs(order?.order_date).format("MMM DD")}
                    </td>
                    <td
                      className={`px-3 py-4 text-sm ${statusColor(order.status)}`}
                    >
                      {order.status}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
           {data?.recentOrders?.length > 0 && <a href="order-history" className="text-sm cursor-pointer text-primary hover:underline">{i18n?.t("View All")}</a>}
          </div>

        </div>


      </div>
    </div>
    <div className="flex flex-col lg:flex-row gap-4">
        {/* Upcoming Events */}
       <div className="p-4 mt-4 bg-white rounded-lg shadow-dashboard basis-full lg:basis-1/2">
          <h1 className="mb-4 text-lg font-semibold text-primary">
            {i18n?.t("Upcoming Events")}
          </h1>
          <div className="overflow-auto">
            <table className="min-w-full bg-white rounded-lg shadow-sm table-auto">
              <thead>
                <tr className="border-b text-secondary">
                  <th className="px-3 py-4 text-sm text-left">{i18n?.t("Event")}</th>
                  <th className="px-3 py-4 text-sm text-left">{i18n?.t("Date")}</th>
                  <th className="px-3 py-4 text-sm text-left">{i18n?.t("Location")}</th>
                  <th className="px-3 py-4 text-sm text-left">{i18n?.t("Status")}</th>
                </tr>
              </thead>
              <tbody>
                {data?.upcomingEvents?.map((event, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? "hover:bg-gray-100" : "hover:bg-gray-200"} border-b last:border-b-0`}
                  >
                    <td className="px-3 py-4 text-sm text-gray-800">
                      {columnFormatter(event?.title)}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-800">
                      {dayjs(event?.event_date).format("MMM DD")}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-800">
                      {event?.location}
                    </td>
                    <td
                      className={`px-3 py-4 text-sm ${statusColor(event?.status?"Active":"Inactive")}`}
                    >
                      {
                        event?.status ? "Active" : "Inactive"
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
       <div className="p-4 mt-4 bg-white rounded-lg shadow-dashboard basis-full lg:basis-1/2">
       {/* upcoming services */}
          <h1 className="mb-4 text-lg font-semibold text-primary">
            {i18n?.t("Upcoming Services")}
          </h1>
          <div className="overflow-auto">
            <table className="min-w-full bg-white rounded-lg shadow-sm table-auto">
              <thead>
                <tr className="border-b text-secondary">
                  <th className="px-3 py-4 text-sm text-left">{i18n?.t("Service")}</th>
                  <th className="px-3 py-4 text-sm text-left">{i18n?.t("Name")}</th>
                  <th className="px-3 py-4 text-sm text-left">{i18n?.t("Status")}</th>
                </tr>
              </thead>
              <tbody>
                {data?.services.map((event, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? "hover:bg-gray-100" : "hover:bg-gray-200"} border-b last:border-b-0`}
                  >
                    <td className="px-3 py-4 text-sm text-gray-800">
                    <img src={event?.image} className="object-cover rounded-full w-7 h-7"/>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-800">
                      {columnFormatter(event?.name)}
                    </td>
                    <td
                      className={`px-3 py-4 text-sm ${statusColor(event.is_active?"Active":"Inactive")}`}
                    >
                      {
                        event?.is_active ? "Active" : "Inactive"
                      }
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
};

export default Dashboard;
