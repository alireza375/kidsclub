import React, { useEffect, useState } from "react";
import { PageHeader } from "../components/common/upperSection";
import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaLinkedinIn,
} from "react-icons/fa";
import { IoHomeOutline, IoMailOutline } from "react-icons/io5";
import { CiMail } from "react-icons/ci";
import { BsTelephoneInbound } from "react-icons/bs";

import { Link, useNavigate, useParams } from "react-router-dom";
import { Input, message, Modal, Rate } from "antd";
import { FaBuilding, FaPhone, FaEnvelope } from "react-icons/fa";
import {
    fetchPaymentMethodList,
    fetchPublicEvents,
    joinEvent,
    publicAdvertisement,
} from "../helpers/backend";
import { useFetch, useTitle } from "../helpers/hooks";
import { columnFormatter } from "../helpers/utils";
import { useSite } from "../context/site";
import { useI18n } from "../providers/i18n";
import Organizer from "../components/event/event_tab/Organizer";
import About from "../components/event/event_tab/about";
import News from "../components/event/event_tab/news";
import dayjs from "dayjs";
import { useUser } from "../context/user";
import { useModal } from "../context/modalContext";
import Countdown from "../components/common/Countdown";
import { StylesBorder } from "../styles/styles";
import { FacebookIcon, FacebookShareButton, FacebookShareCount, InstapaperIcon, InstapaperShareButton, LinkedinIcon, LinkedinShareButton, RedditIcon, RedditShareButton, TwitterIcon, TwitterShareButton } from "react-share";

export default function EventDetail() {
    const { id } = useParams();
    const { user } = useUser();
    const navigate = useNavigate();
    const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
    const { openLoginModal, isLoginModalOpen, closeLoginModal } = useModal();
    const [paymentMethod, setPaymentMethod] = useFetch(fetchPaymentMethodList);
    const [advertisement, getAdvertisement] = useFetch(publicAdvertisement);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false); // State to track loading
    const [hasEventPassed, setHasEventPassed] = useState(false);
    const [isModal, setIsModal] = useState(false);
    const { currencySymbol, sitedata, currency,convertAmount } = useSite();
    useTitle(`${sitedata?.title || "KidStick"} | Event Details`)
    const i18n = useI18n();
    const [data, getData, { loading }] = useFetch(fetchPublicEvents, {
        id: id,
    });
    const [activeTab, setActiveTab] = useState("About");
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

    const handleEnrollment = () => {
        if (!user) {
            openLoginModal();
            return;
        }
        if (user.role === "coach" || user.role === "admin") {
            message.error("You are not authorized to enroll in this event");
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
        if(data?.type === "free"){
            try {
                const data = await joinEvent({
                    event_id: values.id,
                    method: values.method,
                    currency: currency,
                });
                if (data?.success === true) {
                    message.success("Enrollment successful!");
                    setPaymentModalVisible(true);
                    navigate('/user/dashboard');
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
            return;
        }
        try {
            const data = await joinEvent({
                event_id: values.id,
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
    useEffect(() => {
        const eventDate = new Date(data?.event_date);
        const currentDate = new Date();

        if (currentDate > eventDate) {
            setHasEventPassed(true);
        } else {
            setHasEventPassed(false);
        }
    }, [data?.event_date]);
    return (
        <div className="bg-coralred">
            <PageHeader title="Event Details" />
            <div className="custom-container px-4 lg:px-2 sm:px-8 py-8">
                {/* Hero Image */}
                <div className=" lg:h-[488px] mx-auto w-full rounded-lg overflow-hidden mb-8">
                    <img
                        src={data?.image}
                        alt={columnFormatter(data?.title)}
                        width={1200}
                        height={400}
                        className="object-cover w-full h-full"
                    />
                </div>

                {/* Course Header */}
                <div className="px-2 sm:px-8">
                <div className=" bg-white   !pt-10 !pb-[34px] !px-10 !sm:px-[112px] mb-8 flex flex-col md:flex-row justify-between items-start md:items-center"style={StylesBorder("000E3F",8,4)}>
                    <div className="flex flex-col  mb-4 md:mb-0">
                        <div className="sm:flex items-center gap-5">
                            <h1 className="titlexl text-text mb-2">
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
                              <div className="flex gap-2">
                                <FacebookShareButton url={'www.facebook.com'}>
                                <FacebookIcon size={32} round />
                                </FacebookShareButton>
                                <TwitterShareButton url={"www.twitter.com"}>
                                <TwitterIcon size={32} round />
                                </TwitterShareButton>
                                <RedditShareButton url={"www.reddit.com"}>
                                 <RedditIcon size={32} round />
                                </RedditShareButton>
                                <LinkedinShareButton url={"www.linkedin.com"}>
                                <LinkedinIcon size={32} round />
                                </LinkedinShareButton>
                               </div>
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
                                <span className="text-gray-500 text-2xl line-through">
                                    {currencySymbol}
                                    {Math.floor(convertAmount(data?.price))}
                                </span>
                            )}
                        </div>
                        <div>
                            <Countdown targetDate={data?.event_date} />
                        </div>
                        <button
                            onClick={handleEnrollment}
                            className={`${
                                hasEventPassed
                                    ? "bg-gray-500 cursor-not-allowed"
                                    : "bg-primary hover:bg-secondary duration-500"
                            } font-nunito text-white px-6 py-2 rounded-md`}
                            disabled={hasEventPassed} // Disable the button if the event has passed
                        >
                            {hasEventPassed
                                ? i18n.t("Event Ended")
                                : i18n.t("Enroll Now")}
                        </button>
                    </div>
                </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-4 mb-8 overflow-x-auto pb-2 px-2 sm:px-8">
                    {["About", "Organizer", "News"].map((item) => (
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
                <div className="grid grid-cols-1 lg:grid-cols-6 px-2 sm:px-8">
                    <div className="lg:col-span-4">{renderTabContent()}</div>

                    {/* Sidebar */}
                    <div className="lg:col-span-2 mt-8 lg:mt-0 xl:px-16 lg:px-3">
                        <div className=" bg-white  !p-6 mb-8"style={StylesBorder("FF6B6D",20,4)}>
                            <h3 className="text-lg font-bold mb-4 border-b-[1px] border-primary">
                                {i18n.t("Activity Info")}
                            </h3>
                            <div className="space-y-4 text-secondary font-medium font-nunito text-lg">
                                <div className="flex gap-2">
                                    <span className="">
                                        {i18n.t("Category")} :
                                    </span>
                                    <span className="flex-1 break-all">
                                        {columnFormatter(data?.category)}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="">
                                        {i18n.t("Location")} :
                                    </span>
                                    <span className="flex-1 break-all">{data?.location}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="">
                                        {i18n.t("Duration")} :
                                    </span>
                                    <span className="">{data?.duration}</span>
                                </div>
                            </div>
                        </div>

                        <div className=" bg-white  !p-6" style={StylesBorder("FF6B6D",20,4)}>
                            <h3 className="text-lg font-bold mb-4 border-b-[1px] border-primary">
                                {i18n.t("Contact Info")}
                            </h3>
                            <div className="space-y-4">
                                <p className="flex items-center gap-2">
                                    <IoHomeOutline className="shrink-0 h-5 w-5 text-[#FF6B6D]" />
                                    <span className="text-lg font-nunito font-semibold break-words">
                                        {sitedata?.address}
                                    </span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <BsTelephoneInbound className="shrink-0 h-5 w-5 text-[#FF6B6D]" />
                                    <span className="text-lg font-nunito font-semibold break-words">
                                        {sitedata?.phone}
                                    </span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <IoMailOutline className="shrink-0 h-5 w-5 text-[#FF6B6D]" />
                                    <span className="text-lg font-nunito font-semibold break-words">
                                        {sitedata?.email}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Black Friday Banner */}
                        {
                            advertisement?.image && (
                                <div className="mt-8  sm:h-[404px] h-[380px] lg:h-[504px]  object-fill"style={StylesBorder("FF6B6D",20,4)}>

                                <img
                                    src={advertisement?.image}
                                    alt=""
                                    className="w-full object-fill h-full rounded-2xl "
                                />
                            </div>
                            )
                        }

                    </div>
                </div>
            </div>
            <Modal
                open={isPaymentModalVisible}
                onCancel={() => setPaymentModalVisible(false)}
                footer={null}
                centered
            >
                <div className="space-y-6">
                  {data?.type === "paid" ? <>
                        <p className="text-xl font-nunito font-semibold text-center">
                            {i18n.t("Select a payment method")}
                        </p>
                        <div className="flex gap-4 flex-wrap justify-center">
                            {paymentMethod?.docs?.map((method) => (
                                <div
                                    key={method?.id}
                                    onClick={() => handleSelect(method)}
                                    className={`border-2 rounded-lg p-4 flex flex-col items-center cursor-pointer transition transform hover:scale-105 ${
                                        selectedMethod === method?.type
                                            ? "border-primary bg-gray-100"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <img
                                        src={method?.image}
                                        alt={method?.name}
                                        className="w-10 h-6 object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <p className="text-base font-medium text-gray-600">
                                {i18n.t("You will pay")}
                            </p>
                            <p className="text-xl font-bold text-gray-800">
                                {currencySymbol}{Math.floor(convertAmount(data?.discount_price))}
                            </p>
                        </div>

                        {/* Button */}
                        <div className="text-center">
                            <button
                                onClick={() =>
                                    handleProceedToPayment({
                                        id: data?.id,
                                        currency: currencySymbol,
                                        method: selectedMethod,
                                    })
                                }
                                disabled={!selectedMethod || paymentLoading}
                                className={`px-6 py-3 rounded-lg text-white font-semibold text-lg transition ${
                                    selectedMethod && !paymentLoading
                                        ? "bg-primary hover:bg-primary-dark"
                                        : "bg-gray-400 cursor-not-allowed"
                                }`}
                            >
                                {i18n.t("Proceed to Payment")}
                            </button>
                        </div>
                    </> :
                    <>
                        <p className="text-xl font-nunito font-semibold text-center">Are you sure you want to enroll in this event?</p>
                        <div className="flex items-center justify-center gap-4 ">
                            <button
                                 onClick={() =>
                                    handleProceedToPayment({
                                        id: data?.id,
                                        currency: currencySymbol,
                                        method: selectedMethod,
                                    })
                                }
                                className="px-6 py-1 rounded-lg text-white font-semibold text-lg bg-primary hover:bg-primary-dark"
                            >
                                {i18n.t("Yes")}
                            </button>
                            <button
                                onClick={() => setPaymentModalVisible(false)}
                                className="px-6 py-1 rounded-lg text-white font-semibold text-lg bg-gray-400 hover:bg-gray-500"
                            >
                                {i18n.t("No")}
                            </button>
                        </div>
                    </>
                  }
                </div>
            </Modal>
        </div>
    );
}
