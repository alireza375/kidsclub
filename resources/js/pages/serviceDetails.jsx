import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ContactUs from "../components/home/ContactUs";
import { PageHeader } from "../components/common/upperSection";
import { StarFilled } from "@ant-design/icons";
import men from "../../images/men.png";
import About from "../components/service/service_tab/about";
import Instructor from "../components/service/service_tab/instructor";
import News from "../components/service/service_tab/news";
import Members from "../components/service/service_tab/member";
import ReviewSection from "../components/service/service_tab/reviewSection";
import { message, Modal, Rate } from "antd";
import { FaBuilding, FaPhone, FaEnvelope } from "react-icons/fa";
import {
    enrollService,
    fetchPaymentMethodList,
    fetchPublicSingleService,
    publicAdvertisement,
} from "../helpers/backend";
import { useFetch, useTitle } from "../helpers/hooks";
import { useI18n } from "../providers/i18n";
import { columnFormatter } from "../helpers/utils";
import Avatar from "../components/common/Avatar";
import { useSite } from "../context/site";
import { useModal } from "../context/modalContext";
import { useUser } from "../context/user";
import { FacebookIcon, FacebookShareButton, FacebookShareCount, LinkedinIcon, LinkedinShareButton, RedditIcon, RedditShareButton, TwitterIcon, TwitterShareButton } from "react-share";
import defaultImage from "../../images/defaultimg.jpg";
const ServiceDetails = () => {
    const { id } = useParams();
    const i18n = useI18n();
    const { user } = useUser();
    const { currencySymbol, sitedata, currency, convertAmount } = useSite();
    const [service, getService] = useFetch(fetchPublicSingleService, { id });
    const [advertisement, getAdvertisement] = useFetch(publicAdvertisement);
    const [activeTab, setActiveTab] = useState("About");
    const [rating, setRating] = useState(5);
    const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
    const { openLoginModal, isLoginModalOpen, closeLoginModal } = useModal();
    const [paymentMethod, setPaymentMethod] = useFetch(fetchPaymentMethodList);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false); // State to track loading
    
    const [isModal, setIsModal] = useState(false);
    const [url, setUrl] = useState("");
    useTitle(`${sitedata?.title || "KidStick"} | Service Details`);
    useEffect(() => {
        setUrl(window.location.href);
    }, []);
    useEffect(() => {
        getService({ id });
    }, [id]);
    const handleEnrollment = () => {
        if (!user) {
            openLoginModal();
            return;
        }
        if (user.role === "coach" || user.role === "admin") {
            message.error("You are not authorized to enroll in this service");
            return;
        }
        setPaymentModalVisible(true);
    };
    const handleSelect = (method) => {
        setSelectedMethod(method.type);
        // if (onSelect) {
        //     onSelect(method.id); // Call the parent function with selected method
        // }
    };

    // handlePayment
    const handleProceedToPayment = async (values) => {
        setPaymentLoading(true); // Start loading
        try {
            const data = await enrollService({
                service_id: values.id,
                method: values.method,
                currency: currency,
            });

            if (data?.success === true) {
                window.open(data?.data, "_blank");
                message.success("Payment initiated successfully!");
            } else {
                console.error(data);
                message.error(data?.message || "Something went wrong.");
            }
        } catch (error) {
            console.error("Error in payment:", error);
            message.error("An error occurred. Please try again.");
        } finally {
            setPaymentLoading(false); // Stop loading
        }
    };
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
        <div className="bg-coralred">
            <PageHeader title="Service Details" />
            <div className="custom-container px-4 lg:px-2 sm:px-8 py-8">
                {/* Hero Image */}
                <div className="w-full h-[488px] mx-auto rounded-lg overflow-hidden mb-8">
                    <img
                        src={service?.image}
                        alt={columnFormatter(service?.name)}
                        width={1200}
                        height={400}
                        className="object-cover h-full w-full"
                    />
                </div>

                {/* Course Header */}
                <div className="px-2 sm:px-8">
                <div className="border-2 bg-white border-secondary border-dashed rounded-lg pt-10 pb-[34px] px-6 lg:px-12 sm:px-8 xl:px-[112px] mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex flex-col  mb-4 md:mb-0">
                        <div className="sm:flex items-center gap-5">
                            <h1 className="titlexl text-text mb-2">
                                {columnFormatter(service?.name)}
                            </h1>

                            <Rate
                                disabled
                                className="text-primary whitespace-pre"
                                count={5}
                                value={service?.avg_rating}
                            ></Rate>
                            <span className="text-lg text-secondary font-nunito">
                                ({service?.review?.length})
                            </span>
                        </div>
                        <div className="flex items-center gap-5 mt-5 mb-[10px]">
                            {service?.instructor?.image ? (
                                <img src={service?.instructor?.image} alt="" className="w-[50px] h-[50px] rounded-full" />
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
                                {i18n?.t("Social Share")}:
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
                    <div className="flex flex-col items-end justify-end gap-10">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[32px] whitespace-pre text-2xl font-bold text-primary">
                                {currencySymbol}{" "}
                                {convertAmount(service?.discount_price)}
                            </span>
                            <span className="text-gray-500 whitespace-pre text-2xl line-through">
                                {currencySymbol} {convertAmount(service?.price)}
                            </span>
                        </div>
                        <button
                            onClick={handleEnrollment}
                            className="bg-primary hover:bg-secondary duration-500 font-nunito text-white px-6 py-2 rounded-md "
                        >
                            {i18n?.t("Join Now")}
                        </button>
                    </div>
                </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-4 mb-8 overflow-x-auto pb-2 px-2 sm:px-8">
                    {[i18n?.t("About"), i18n?.t("Members"), i18n?.t("Instructor"), i18n?.t("News"), i18n?.t("Reviews")]?.map(
                        (item) => (
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
                        )
                    )}
                </div>
                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-6 px-2 sm:px-8">
                    <div className="lg:col-span-4">{renderTabContent()}</div>

                    {/* Sidebar */}
                    <div className="lg:col-span-2 mt-8 lg:mt-0 xl:px-16 lg:px-8">
                        <div className="border-2 border-dashed border-[#FF6B6D] bg-white rounded-[20px] p-6 mb-8">
                            <h3 className="text-lg font-bold mb-4">
                                {i18n.t("Activity Info")}
                            </h3>
                            <div className="space-y-4 font-nunito">
                                <div className="flex justify-between">
                                    <span className="text-secondary font-bold ">
                                        {i18n.t("Category")}
                                    </span>{"   "}
                                    <span className="font-medium break-all ">
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
                                    <FaBuilding className="shrink-0 h-5 w-5 text-[#FF6B6D]" />
                                    <span>{sitedata?.address}</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <FaPhone className="shrink-0 h-5 w-5 text-[#FF6B6D]" />
                                    <span>{sitedata?.phone}</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <FaEnvelope className="shrink-0 h-5 w-5 text-[#FF6B6D] break-all" />
                                    <span>{sitedata?.email}</span>
                                </p>
                            </div>
                        </div>

                        {/* Black Friday Banner */}
                        {
                            advertisement?.image && (
                                <div className="mt-8 border-2 border-dashed sm:h-[404px] h-[380px] lg:h-[504px] border-[#FF6B6D] rounded-2xl object-fill">
                                <img
                                    src={advertisement?.image}
                                    alt=""
                                    className="w-full object-fill h-full rounded-2xl"
                                />
                            </div>
                            )
                        }

                    </div>
                </div>
            </div>
            <ContactUs />
            <Modal
                open={isPaymentModalVisible}
                onCancel={() => setPaymentModalVisible(false)}
                footer={null}
                centered
            >
                <div className="space-y-8 px-4 md:px-6 lg:px-2 sm:px-8">
                    {/* Title */}
                    <p className="text-2xl font-nunito font-semibold text-center text-gray-800">
                        {i18n.t("Select a payment method")}
                    </p>

                    {/* Payment Methods */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        {paymentMethod?.docs?.map((method) => (
                            <div
                                key={method?.id}
                                onClick={() => handleSelect(method)}
                                className={`border-2 rounded-lg p-6 flex flex-col items-center cursor-pointer transition transform hover:scale-105 hover:shadow-lg ${
                                    selectedMethod === method?.type
                                        ? "border-primary bg-gray-50"
                                        : "border-gray-300 bg-white"
                                }`}
                            >
                                <img
                                    src={method?.image}
                                    alt={method?.name}
                                    className="w-12 h-8 object-contain"
                                />
                                <p className="mt-4 text-sm font-medium text-gray-700">
                                    {method?.name}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Price Information */}
                    <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
                        <p className="text-sm font-medium text-gray-600">
                            {i18n.t("You will pay")}
                        </p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">
                            {currencySymbol}  {convertAmount(service?.discount_price)}
                        </p>
                    </div>

                    {/* Proceed Button */}
                    <div className="text-center">
                        <button
                            onClick={() =>
                                handleProceedToPayment({
                                    id: service?.id,
                                    currency: currencySymbol,
                                    method: selectedMethod,
                                })
                            }
                            disabled={!selectedMethod || paymentLoading}
                            className={`px-2 sm:px-8 py-4 rounded-lg text-lg font-semibold transition ${
                                selectedMethod && !paymentLoading
                                    ? "bg-primary text-white hover:bg-primary-dark"
                                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                            }`}
                        >
                            {paymentLoading
                                ? i18n.t("Processing...")
                                : i18n.t("Proceed to Payment")}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ServiceDetails;
