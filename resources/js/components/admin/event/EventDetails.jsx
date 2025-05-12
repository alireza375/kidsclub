import React, { useEffect, useState } from "react";
import { PageHeader } from "../../../components/common/upperSection";
import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaLinkedinIn,
} from "react-icons/fa";
import { IoHomeOutline, IoMailOutline } from "react-icons/io5";
import { CiMail } from "react-icons/ci";
import { BsTelephoneInbound } from "react-icons/bs";

import { Link, useParams } from "react-router-dom";
import { Input, message, Modal, Rate } from "antd";
import {
    fetchPaymentMethodList,
    fetchPublicEvents,
    joinEvent,
} from "../../../helpers/backend";
import { useFetch, useTitle } from "../../../helpers/hooks";
import { columnFormatter } from "../../../helpers/utils";
import { useSite } from "../../../context/site";
import { useI18n } from "../../../providers/i18n";
import Organizer from "../../../components/event/event_tab/Organizer";
import About from "../../../components/event/event_tab/about";
import News from "../../../components/event/event_tab/news";
import { useUser } from "../../../context/user";
import { useModal } from "../../../context/modalContext";
import Countdown from "../../../components/common/Countdown";

export default function EventDetail() {
    const { id } = useParams();
    const [hasEventPassed, setHasEventPassed] = useState(false);
    const { currencySymbol, sitedata, currency,convertAmount } = useSite();
    const i18n = useI18n();
    const [data, getData, { loading }] = useFetch(fetchPublicEvents, {
        id: id,
    });
    const [activeTab, setActiveTab] = useState("About");
    useTitle(sitedata?.title + " | " + i18n.t("Event Details") + " - " + i18n.t("Admin"));
    const renderTabContent = () => {
        switch (activeTab) {
            case "About":
                return <About data={data} />;
            case "Organizer":
                return <Organizer data={data} />;
            case "News":
                return <News data={data} />;
            default:
                return <About data={data} />;
        }
    };


    useEffect(() => {
        const eventDate = new Date(data?.event_date);
        const currentDate = new Date();

        // Set the state based on whether the event date is past
        if (currentDate > eventDate) {
            setHasEventPassed(true);
        } else {
            setHasEventPassed(false);
        }
    }, [data?.event_date]);
    return (
        <div className="min-h-full p-4 bg-gray-100 rounded-md">
           <div className="flex justify-end p-5">
           <button onClick={() => window.history.back()} className="admin-btn">{i18n.t("Back")}</button>
           </div>
            <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                {/* Hero Image */}
                <div className=" lg:h-[488px] rounded-lg overflow-hidden mb-8">
                    <img
                        src={data?.image}
                        alt={columnFormatter(data?.title)}
                        width={1200}
                        height={400}
                        className="object-cover"
                    />
                </div>

                {/* Course Header */}
                <div className="border-2 bg-white border-secondary border-dashed rounded-lg pt-10 pb-[34px] px-10 sm:px-[112px] mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex flex-col mb-4 md:mb-0">
                        <div className="items-center gap-5 sm:flex">
                            <h1 className="mb-2 titlexl text-text">
                                {columnFormatter(data?.title)}
                            </h1>
                        </div>
                        <div className="flex items-center gap-5 mt-5 mb-[10px]">
                            <img
                                className="w-[50px] h-[50px] object-cover rounded-full shadow-dashboard"
                                src={data?.organizer?.image}
                                alt=""
                            />
                            <h1 className="midtitle !font-bold text-text">
                                {data?.organizer?.name}
                            </h1>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="midtitle text-text">
                                {i18n.t("Social Share")}:
                            </span>
                            <Link
                                to="/facebook"
                                target="_blank"
                                className="p-1 text-white transition-colors bg-blue-500 rounded-full hover:bg-blue-700"
                            >
                                <FaFacebookF className="w-5 h-5" />
                            </Link>
                            <Link
                                target="_blank"
                                to="/instagram"
                                className="p-1 text-white transition-colors bg-green-400 rounded-full hover:bg-green-600"
                            >
                                <FaInstagram className="w-5 h-5" />
                            </Link>
                            <Link
                                target="_blank"
                                to="/twitter"
                                className="p-1 text-white transition-colors bg-yellow-400 rounded-full hover:bg-yellow-600"
                            >
                                <FaTwitter className="w-5 h-5" />
                            </Link>
                            <Link
                                target="_blank"
                                to="/linkedin"
                                className="p-1 text-white transition-colors bg-red-400 rounded-full hover:bg-red-600"
                            >
                                <FaLinkedinIn className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-10">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[32px] text-2xl font-bold text-primary">
                            {data?.type === "paid" && currencySymbol}
                                {data?.type === "paid"
                                    ? Math.floor(convertAmount(data?.discount_price))
                                    : i18n.t("Free")}
                            </span>
                            {data?.type === "paid" && (
                                <span className="text-2xl text-gray-500 line-through">
                                    {currencySymbol}
                                    {Math.floor(convertAmount(data?.price))}
                                </span>
                            )}
                        </div>


                    </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-4 pb-2 mb-8 overflow-x-auto">
                    {[i18n?.t("About"), i18n?.t("Organizer"), i18n?.t("News")].map((item) => (
                        <button
                            key={item}
                            onClick={() => setActiveTab(item)}
                            className={`md:px-16 px-9 py-2 md:py-[14px] text-lg md:text-2xl border border-primary font-medium rounded-[20px] whitespace-nowrap ${
                                item === activeTab
                                    ? "bg-primary text-white"
                                    : " text-secondary"
                            }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
                <div></div>

                {/* Main Content */}
                <div className="grid grid-cols-1 xl:grid-cols-6 ">
                    <div className="col-span-1 xl:col-span-4">{renderTabContent()}</div>

                    {/* Sidebar */}
                    <div className="col-span-1 mt-8 xl:col-span-2 lg:mt-0 2xl:px-16 xl:px-12">
                        <div className="border-2 border-dashed border-[#FF6B6D] bg-white rounded-[20px] p-6 mb-8">
                            <h3 className="text-lg font-bold mb-4 border-b-[1px] border-primary">
                                {i18n?.t("Event Info")}
                            </h3>
                            <div className="flex flex-col space-y-4 text-lg font-medium text-secondary font-nunito">
                                <div className="flex gap-2">
                                    <span className="">
                                        {i18n.t("Category")}
                                    </span>
                                    {":"}
                                    <span className="flex-1   w-full !break-all">
                                        {columnFormatter(data?.category)}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="">
                                        {i18n.t("Location")} :
                                    </span>
                                    <span className="flex-1">{data?.location}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="">
                                        {i18n.t("Duration")} :
                                    </span>
                                    <span className="flex-1">{data?.duration}</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-2 border-dashed border-[#FF6B6D] bg-white rounded-[20px] p-6">
                            <h3 className="text-lg font-bold mb-4 border-b-[1px] border-primary">
                                {i18n.t("Contact Info")}
                            </h3>
                            <div className="space-y-4">
                                <p className="flex items-center gap-2">
                                    <IoHomeOutline className="shrink-0 h-5 w-5 text-[#FF6B6D]" />
                                    <span className="text-lg font-semibold break-words font-nunito">
                                        {sitedata?.address}
                                    </span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <BsTelephoneInbound className="shrink-0 h-5 w-5 text-[#FF6B6D]" />
                                    <span className="text-lg font-semibold break-words font-nunito">
                                        {sitedata?.phone}
                                    </span>
                                </p>
                                <p className="flex items-center gap-2">
    <IoMailOutline className="shrink-0 h-5 w-5 text-[#FF6B6D]" />
    <span className="flex-1 text-lg font-semibold break-words font-nunito">
        {sitedata?.email}
    </span>
</p>
                            </div>
                        </div>

                        {/* Black Friday Banner */}
                        <div className="mt-8 border-2 border-dashed border-[#FF6B6D] rounded-2xl object-fill">
                            {/* <div className="p-6 text-center bg-yellow-400 rounded-lg">
              <h3 className="mb-2 text-2xl font-bold">Black Friday</h3>
              <p className="text-lg font-semibold">SALE</p>
            </div> */}
                            <img
                                src={data?.image}
                                alt=""
                                className="object-fill w-full rounded-2xl"
                            />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
