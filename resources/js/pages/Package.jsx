import React, { useState } from "react";
import {
    buyPackage,
    fetchPackages,
    fetchPaymentMethodList,
} from "../helpers/backend";
import { useFetch, useTitle } from "../helpers/hooks";
import BackgroundImage from "../components/common/BackgroundImage";
import { columnFormatter } from "../helpers/utils";
import startvector from "../../images/star_vector.png";
import startgreen from "../../images/star_green.png";
import gold from "../../images/gold.png";
import { useSite } from "../context/site";
import shape1 from "../../images/shape1.png";
import { FaCheckCircle } from "react-icons/fa";
import Button from "../components/common/Button";
import Basic from "../../images/Basic.png";
import Medium from "../../images/Medium.png";
import Pro from "../../images/Pro.png";
import { message, Modal, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/user";
import { useI18n } from "../providers/i18n";
import { PageHeader } from "../components/common/upperSection";
import BlogSkeleton from "../components/common/skeleton/BlogSkeleton";
import { useModal } from "../context/modalContext";
import serviceNotFound from "./../../images/serviceNotFound.webp";
const Package = () => {
    const { openLoginModal } = useModal();
    const { currencySymbol, currency, convertAmount } = useSite();
    const [data, setData, { loading }] = useFetch(fetchPackages);
    const [showAllFeatures, setShowAllFeatures] = useState(false);
    const { user } = useUser();
    const [planData, setPlandata] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [indexId, setIndexid] = useState();
    const i18n = useI18n();
    const [paymentMethod, setPaymentMethod] = useFetch(fetchPaymentMethodList);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const paymentData = paymentMethod?.docs?.map((item, index) => ({
        id: item?.id,
        name: item?.name,
        type: item?.type,
        icons: (
            <img src={item?.image} alt="stripe" className="h-[16px] w-[34px]" />
        ),
    }));
    const [checkOutFormData, setCheckOutFormData] = useState({
        payment: "",
    });
    const handleClick = (data) => {
        if (user?.role !== "user") {
            message.warning("Please login as a user");
            openLoginModal();
        } else {
            setPlandata(data);
            setIsOpen(true);
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCheckOutFormData({ ...checkOutFormData, [name]: value });
    };
    const colors = ["FFCF6F", "FF7B68", "49DCE7"];
    const bgimages = [Basic, Medium, Pro];
    const { sitedata } = useSite();
    useTitle(`${sitedata?.title || "KidStick"} | Package`);
    return (
        <>
            <PageHeader title="Package" />

            <div className="md:py-[120px] py-[60px] custom-container">
                <h3 className="text-center heading3 ">
                    {i18n?.t("Choose Your Plan")}
                </h3>
                {loading ? (
                    <div className="grid grid-cols-1 gap-5 mt-6 lg:mt-14 lg:grid-cols-3 md:grid-cols-2">
                        {Array(6)
                            .fill(null)
                            .map((_, i) => (
                                <BlogSkeleton key={i} />
                            ))}
                    </div>
                ) : data?.docs?.length > 0 ? (
                    <div className="grid grid-cols-1 gap-5 mt-6 lg:mt-14 lg:grid-cols-3 md:grid-cols-2">
                        {data?.docs?.map((item, idx) => (
                            <div
                                className={`w-full h-full relative`}
                                key={idx}
                                style={{}}
                            >
                                <div
                                    style={{
                                        backgroundColor:
                                            colors[idx % colors.length],
                                        borderColor:
                                            colors[idx % colors.length],
                                    }}
                                    className={`w-full z-10 relative lg:h-[250px] h-[230px] border-[1px] rounded-[30px]  `}
                                >
                                    <BackgroundImage
                                        src={
                                            [Basic, Medium, Pro][
                                                idx %
                                                    [Basic, Medium, Pro].length
                                            ]
                                        }
                                        alt={"Price Background"}
                                        className={"object-fill"}
                                    />
                                    <div className=" flex justify-center    relative !z-20">
                                        <div
                                            className={`${
                                                idx === 1
                                                    ? "hidden"
                                                    : "sm:block hidden"
                                            }`}
                                        >
                                            <img
                                                src={startvector}
                                                alt="vector"
                                                className="w-[48.81px] h-[45.07px] absolute top-[25px] left-[17px]"
                                            />
                                            <img
                                                src={startvector}
                                                alt="vector"
                                                className="w-[48.81px] h-[45.07px] absolute bottom-[20.93px] left-[32px]"
                                            />
                                            <img
                                                src={startvector}
                                                alt="vector"
                                                className="w-[48.81px] h-[45.07px] absolute bottom-[41.28px] right-[14.49px]"
                                            />
                                        </div>
                                        <div
                                            className={`${
                                                idx === 1
                                                    ? "sm:block hidden"
                                                    : "hidden"
                                            }`}
                                        >
                                            <img
                                                src={startgreen}
                                                alt="vector"
                                                className="w-[48.81px] h-[45.07px] absolute top-[25px] left-[17px]"
                                            />
                                            <img
                                                src={startgreen}
                                                alt="vector"
                                                className="w-[48.81px] h-[45.07px] absolute bottom-[20.93px] left-[32px]"
                                            />
                                            <img
                                                src={startgreen}
                                                alt="vector"
                                                className="w-[48.81px] h-[45.07px] absolute bottom-[41.28px] right-[14.49px]"
                                            />
                                        </div>

                                        <div className="">
                                            <div>
                                                <div className="flex justify-center mt-[30px]">
                                                    <img
                                                        src={
                                                            item?.image || gold
                                                        }
                                                        alt="price icon"
                                                        className="h-[80px] w-[90px] object-contain"
                                                    />
                                                </div>

                                                <p className="!leading-[56px] text-[48px] !font-bold text-center text-white mt-[10px] mb-[23px]">
                                                    {currencySymbol}{" "}
                                                    {convertAmount(item.price)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="z-20 bg-white text-black lg:w-[200px] w-[150px] lg:h-[50px] h-[45px] flex justify-center items-center  rounded-full absolute -bottom-5 -translate-x-1/2 left-1/2">
                                        <p
                                            className="text-center heading2 "
                                            style={{ color: colors[idx] }}
                                        >
                                            {columnFormatter(item.name)}
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className={`relative !z-0 bg-[#FBF1E3] text-secondary rounded-[30px] xl:-mt-20 -mt-12 p-10 pt-[120px] flex flex-col items-center
                                               `}
                                >
                                    <img
                                        src={shape1}
                                        className={`sm:block hidden w-[87px] h-[84px] absolute ${
                                            idx === 0
                                                ? "left-[12px]"
                                                : "right-[12px]"
                                        } bottom-[26px]`}
                                        alt="shape"
                                    />
                                    <ul className="flex flex-col justify-start items-start pt-[10px]">
                                        {item?.service_id
                                            ?.slice(
                                                0,
                                                showAllFeatures &&
                                                    indexId === item?.id
                                                    ? item?.service_id?.length
                                                    : 2
                                            )
                                            ?.map((service, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-2 mb-2 text-lg "
                                                >
                                                    <div className="basis-5">
                                                        <FaCheckCircle className="text-[#5CB338] text-[20px] " />
                                                    </div>
                                                    <h4 className="w-[250px]">
                                                        {columnFormatter(
                                                            service?.name
                                                        )}
                                                    </h4>
                                                </div>
                                            ))}
                                        <div className="relative flex flex-col w-full mx-auto mb-4 ">
                                            {item?.service_id?.length > 2 ? (
                                                <button
                                                    onClick={() => {
                                                        setShowAllFeatures(
                                                            !showAllFeatures
                                                        );
                                                        setIndexid(item?.id);
                                                    }}
                                                    className={`text-primary group-hover:text-white  md:text-base text-xs  font-medium hover:underline duration-500
                                                             `}
                                                >
                                                    {showAllFeatures &&
                                                    indexId === item?.id
                                                        ? i18n?.t("Show Less")
                                                        : i18n?.t("Show More")}
                                                </button>
                                            ) : (
                                                <div
                                                    className={`${
                                                        item?.service_id
                                                            ?.length === 2
                                                            ? "h-[24px]"
                                                            : "h-[60px]"
                                                    }`}
                                                ></div>
                                            )}
                                        </div>
                                    </ul>

                                    <div className="flex justify-center items-center pt-[20px] ">
                                        <Button
                                            className="w-full "
                                            title={"Buy Now"}
                                            func={() => {
                                                handleClick(item);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="header text-2xl mt-14 font-bold text-gray-600 text-center flex flex-col items-center gap-y-8">
                        <div>
                            <img
                                src={serviceNotFound}
                                alt="serviceNotFound"
                                className="w-[200px] mx-auto"
                            />
                        </div>
                        {i18n.t("No Package Found")}

                        <button
                            className="bg-primary px-5 py-1 flex items-center gap-1 text-white rounded-full text-lg"
                            onClick={() => (window.location.href = "/")}
                        >
                            {i18n.t("Go Back")}
                        </button>
                    </div>
                )}
                <Modal
                    open={isOpen}
                    title={" "}
                    width={600}
                    onCancel={() => {
                        setIsOpen(false);
                    }}
                    footer={null}
                >
                    <div className=" mt-8 w-full p-[32px] md:mt-0 ">
                        <h1 className="mb-8 text-2xl font-bold text-textMain">
                            {i18n?.t("Plan Details")}
                        </h1>
                        <hr className="my-6 w-full border-[#909090]" />
                        <div className="mb-8 space-y-3 text-xl font-normal">
                            <div className="flex items-center justify-between">
                                <h1 className="text-textMain !font-poppins">
                                    {i18n?.t("Name")}
                                </h1>
                                <h1 className="text-textMain !font-poppins">
                                    {columnFormatter(planData?.name)}
                                </h1>
                            </div>
                            <div className="flex items-center justify-between">
                                <h1 className="text-textMain !font-poppins">
                                    {i18n?.t("Price")}
                                </h1>
                                <h1 className="text-textMain !font-poppins">
                                    {currencySymbol}
                                    {convertAmount(planData?.price)}
                                </h1>
                            </div>
                        </div>
                        <div>
                            <h2 className="mb-2 text-lg font-semibold text-gray-800">
                                {i18n?.t("Payment Method")}:
                            </h2>
                            <div className="flex gap-2 mb-2">
                                {paymentData?.map((method) => (
                                    <label
                                        key={method.id}
                                        className={`flex justify-center items-center w-20 h-8 border rounded-lg cursor-pointer object-contain transition-all ${
                                            checkOutFormData.payment ===
                                            method.name
                                                ? "border-primary bg-primary/20"
                                                : "border-gray-200 hover:border-primary"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            value={method.name}
                                            checked={
                                                checkOutFormData.payment ===
                                                method.name
                                            }
                                            onChange={handleInputChange}
                                            className="sr-only"
                                        />
                                        {method.icons}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={async () => {
                                try {
                                    setCheckoutLoading(true);
                                    if (!checkOutFormData?.payment) {
                                        return message.error(
                                            i18n?.t(
                                                "Please select payment method"
                                            )
                                        );
                                    }
                                    if (checkOutFormData?.payment) {
                                        const res = await buyPackage({
                                            package_id: planData?.id,
                                            currency: currency,
                                            status: "pending",
                                            method: checkOutFormData?.payment.toLowerCase(),
                                        });
                                        if (res?.error === false) {
                                            setCheckoutLoading(false);
                                            notification.success({
                                                message:
                                                    res?.msg || res?.message,
                                            });
                                            window.open(res?.data, "_blank");
                                        } else {
                                            setCheckoutLoading(false);
                                            notification.error({
                                                message:
                                                    res?.msg || res?.message,
                                            });
                                        }
                                    }
                                } catch (e) {
                                    setCheckoutLoading(false);
                                    message.error(
                                        i18n?.t("Something went wrong")
                                    );
                                } finally {
                                    setCheckoutLoading(false);
                                }
                            }}
                            className="text-[18px] font-bold leading-[23px] border-secondary_text mt-10 w-full rounded-lg border py-3 transition-all ease-in-out bg-primary text-white"
                            title={"CheckOut"}
                        >
                            {checkoutLoading
                                ? i18n.t("Checking...")
                                : i18n?.t("Checkout")}
                        </button>
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default Package;
