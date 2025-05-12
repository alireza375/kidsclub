import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../../context/user";
import { useI18n } from "../../../providers/i18n";
import { useSite } from "../../../context/site";
import { useFetch, useTitle } from "../../../helpers/hooks";
import { columnFormatter } from "../../../helpers/utils";
import {
    fetchSingleService,
} from "../../../helpers/backend";
import { Modal, Rate } from "antd";
import Avatar from "../../common/Avatar";
import {
    FacebookIcon,
    FacebookShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    RedditIcon,
    RedditShareButton,
    TwitterIcon,
    TwitterShareButton,
} from "react-share";
import { FaBuilding, FaEnvelope, FaPhone } from "react-icons/fa";
import ReviewSection from "./service_tab/reviewSection";
import About from "./service_tab/about";
import Members from "./service_tab/member";
import Instructor from "./service_tab/instructor";
import News from "./service_tab/news";

const ServiceDetails = () => {
    const { id } = useParams();
    const i18n = useI18n();
    const { currencySymbol, sitedata, currency, convertAmount } = useSite();
    const [service, getService] = useFetch(fetchSingleService, { id });
    const [activeTab, setActiveTab] = useState("Reviews");
    const navigate = useNavigate();
    const [url, setUrl] = useState("");
    useTitle(sitedata?.title + " | " + i18n.t("Service Details") + " - " + i18n.t("Admin"));

    useEffect(() => {
        setUrl(window.location.href);
    }, []);
    useEffect(() => {
        getService({ id });
    }, [id]);

    const renderTabContent = () => {
        switch (activeTab) {
            case "About":
                return <About data={service} />;
            case "Members":
                return <Members data={service} />;
            case "Instructor":
                return <Instructor data={service} />;
            case "News":
                return <News data={service} />;
            case "Reviews":
                return <ReviewSection data={service} />;
            default:
                return <About data={service} />;
        }
    };

    return (
        <div className="p-4 bg-gray-100 min-h-full rounded-md">
            <button
                className=" bg-teal-blue px-3 py-1 flex items-center gap-1 text-white rounded ml-auto"
                onClick={() => navigate('/admin/service')}
            >
                {i18n.t("Back")}
            </button>
            <div className=" mx-auto px-4 py-8">
                {/* Hero Image */}
                <div className="mx-auto w-full lg:h-[488px] rounded-lg overflow-hidden mb-8">
                    <img
                        src={service?.image}
                        alt={columnFormatter(service?.name)}
                        width={1200}
                        height={400}
                        className="object-fit mx-auto"
                    />
                </div>

                {/* Course Header */}
                <div className="border-2 bg-white border-secondary border-dashed rounded-lg pt-10 pb-[34px] px-10 sm:px-[112px] mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex flex-col  mb-4 md:mb-0">
                        <div className="sm:flex items-center gap-5">
                            <h1 className="title text-text mb-2">
                                {columnFormatter(service?.name)}
                            </h1>

                            <Rate
                                disabled
                                className="text-teal-blue"
                                count={5}
                                value={service?.avg_rating}
                            ></Rate>
                            <span className="text-lg text-secondary font-nunito">
                                ({service?.review?.length} {i18n.t("Reviews")})
                            </span>
                        </div>
                        <div className="flex items-center gap-5 mt-5 mb-[10px]">
                            {service?.instructor?.image ? (
                                <img className="w-10 h-10 rounded-full" src={service?.instructor?.image} alt="" />
                            ) : (
                                <Avatar
                                    name={service?.instructor?.name}
                                    classes={"w-10 h-10"}
                                />
                            )}
                            <h1 className="midtitle !font-bold text-text">
                                {service?.instructor?.name}
                            </h1>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="midtitle text-text">
                                {i18n.t("Social Share")}:
                            </span>
                            <div className="flex gap-2">
                                <FacebookShareButton url={url}>
                                    <FacebookIcon size={32} round />
                                </FacebookShareButton>
                                <TwitterShareButton url={url}>
                                    <TwitterIcon size={32} round />
                                </TwitterShareButton>
                                <RedditShareButton url={url}>
                                    <RedditIcon size={32} round />
                                </RedditShareButton>
                                <LinkedinShareButton url={url}>
                                    <LinkedinIcon size={32} round />
                                </LinkedinShareButton>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-10">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[32px] text-2xl font-bold text-teal-blue">
                                {currencySymbol}{" "}
                                {convertAmount(service?.discount_price)}
                            </span>
                            <span className="text-gray-500 text-2xl line-through">
                                {currencySymbol} {convertAmount(service?.price)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-center gap-4 mb-8 overflow-scroll pb-2 no-scrollbar ">
                    {["About", "Members", "Instructor", "News", "Reviews"].map(
                        (item) => (
                            <button
                                key={item}
                                onClick={() => setActiveTab(item)}
                                className={`md:px-8 px-6 py-2  text-lg md:text-2xl border border-teal-blue font-medium whitespace-nowrap ${
                                    item === activeTab
                                        ? "bg-teal-blue text-white"
                                        : " text-secondary"
                                }`}
                            >
                                {item}
                            </button>
                        )
                    )}
                </div>
                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-6 ">
                    <div className="lg:col-span-4">{renderTabContent()}</div>

                    {/* Sidebar */}
                    <div className="lg:col-span-2 mt-8 lg:mt-0 lg:px-16">
                        <div className="border-2 border-dashed border-[#FF6B6D] bg-white rounded-[20px] p-6 mb-8">
                            <h3 className="text-lg font-bold mb-4">
                                {i18n.t("Activity Info")}
                            </h3>
                            <div className="space-y-4 font-nunito">
                                <div className="flex justify-between">
                                    <span className="text-secondary font-bold ">
                                        {i18n.t("Category")}
                                    </span>
                                    <span className="font-medium">
                                        {columnFormatter(service?.category)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-secondary font-bold ">
                                        {i18n.t("Season")}
                                    </span>
                                    <span className="font-medium">
                                        {service?.session}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-secondary font-bold ">
                                        {i18n.t("Duration")}
                                    </span>
                                    <span className="font-medium">
                                        {service?.duration}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-secondary font-bold">
                                        {i18n.t("Capacity")}
                                    </span>
                                    <span className="font-medium">
                                        {service?.capacity}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="border-2 border-dashed border-[#FF6B6D] bg-white rounded-[20px] p-6">
                            <h3 className="text-lg font-bold mb-4">
                                {i18n.t("Contact Info")}
                            </h3>
                            <div className="space-y-4">
                                <p className="flex items-start gap-2">
                                    <FaBuilding className="h-5 w-5 text-[#FF6B6D]" />
                                    <span>{sitedata?.address}</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <FaPhone className="h-5 w-5 text-[#FF6B6D]" />
                                    <span>{sitedata?.phone}</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <FaEnvelope className="h-5 w-5 text-[#FF6B6D]" />
                                    <span>{sitedata?.email}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetails;
