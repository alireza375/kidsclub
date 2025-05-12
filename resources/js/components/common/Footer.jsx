import React, { useRef } from "react";
import { FaPinterest, FaFacebook, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { AiFillTwitterCircle } from "react-icons/ai";
import { FiPhoneCall } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";
import { RxHome } from "react-icons/rx";
import { useSite } from "../../context/site";
import { useI18n } from "../../providers/i18n";
import FooterBg from "./../../../images/backgraund.png";
import Logo from "./../../../images/logo.png";
import { Link } from "react-router-dom";
import BackgroundImage from "./BackgroundImage";
import { fetchPaymentMethodList, postNewsLetter } from "../../helpers/backend";
import { useFetch } from "../../helpers/hooks";
import { notification } from "antd";
import footerSvg from "./../../../images/footer_svg.png";
import { FaTwitter } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";

const Footer = () => {
    const emailref = useRef(null);
    const { sitedata } = useSite();
    const  i18n  = useI18n();
    const [paymentMethod, setPaymentMethod] = useFetch(fetchPaymentMethodList);
    const paymentData = paymentMethod?.docs?.map((item, index) => ({
        id: item?.id,
        name: item?.name,
        type: item?.type,
        icons: (
            <img src={item?.image} alt="stripe" className="h-[16px] w-[34px]" />
        ),
    }));
    const handleSubscribe = async (event) => {
        event.preventDefault();
        const { success, message } = await postNewsLetter({
            email: emailref?.current?.value,
        });
        if (success) {
            emailref.current.value = "";
            notification.success({ message: message });
        } else {
            notification.error({ message: message });
        }
    };
    return (
        <div
            className={` bg-cover bg-no-repeat h-full relative lg:bg-transparent bg-[#2D4073]`}
            style={{ color: "#E8E8E8" }}
        >
            <BackgroundImage
                src={FooterBg}
                alt={"Footer Background"}
                className={"lg:block hidden"}
            />
            <img
                src={footerSvg}
                height={82}
                width={82}
                className="2xl:block hidden absolute h-[82px] w-[82px] 2xl:left-[125px] xl:left-[25px] bottom-[210px] object-cover "
            />

            <div className="custom-container gap-[40px] sm:flex-row flex-col   sm:flex-wrap flex justify-between sm:items-center md:pt-[100px]   xl:pt-[182px] md:pb-[43px] pt-[40px]    pb-[80px]">
                <div>
                    <img
                        src={sitedata?.logo || Logo}
                        height={136.69}
                        width={70}
                        className="md:w-[136.69px] md:h-[70px] md:mt-0 mt-[50px]  w-[100px] h-[40px] object-cover"
                    />
                    <p className="text-[18px] font-semibold leading-[26px] !text-[#E8E8E8] sm:w-[342px] w-[300px] md:mt-[36px] mt-[18px] mb-[20px]">
                        {sitedata?.description}
                    </p>
                    <ul className="flex gap-[12px] items-center">
                        <li className="h-[20px] w-[20px]  bg-white hover:bg-primary duration-300 transition-all flex justify-center items-center rounded-full">
                        <Link to={sitedata?.facebook}>
                            <FaLinkedinIn
                                size={14}
                                className="text-[#223668]"
                            />
                        </Link>
                        </li>
                        <li>
                            <Link to={sitedata?.facebook}>
                            <FaFacebook className="text-[20px] hover:text-primary text-[#E8E8E8] duration-300 transition-all flex justify-center items-center rounded-full" />
                            </Link>
                        </li>
                        <li>
                        <Link to={sitedata?.instagram}>
                            <FaInstagram className="text-[20px] hover:text-primary text-[#E8E8E8] duration-300 transition-all flex justify-center items-center rounded-full" />
                        </Link>
                        </li>
                        <li>
                        <Link to={sitedata?.twitter}>
                            <FaTwitter className="text-[20px] hover:text-primary text-[#E8E8E8] duration-300 transition-all flex justify-center items-center rounded-full" />
                        </Link>
                        </li>
                    </ul>
                </div>
                <ul className="flex flex-col gap-[16px]">
                    <li className="footer_text text-[#E8E8E8]">
                        <Link
                            className="hover:text-primary cursor-pointer"
                            to="/"
                        >
                            {i18n?.t("Home")}
                        </Link>
                    </li>
                    <li className="footer_text text-[#E8E8E8]">
                        <Link
                            className="hover:text-primary cursor-pointer"
                            to="/about"
                        >
                            {i18n?.t("About")}
                        </Link>
                    </li>
                    <li className="footer_text text-[#E8E8E8]">
                        <Link
                            className="hover:text-primary cursor-pointer"
                            to="/package"
                        >
                            {i18n?.t("Package")}
                        </Link>
                    </li>
                    <li className="footer_text text-[#E8E8E8]">
                        <Link
                            className="hover:text-primary cursor-pointer"
                            to="/event"
                        >
                            {i18n?.t("Event")}
                        </Link>
                    </li>
                    <li className="footer_text text-[#E8E8E8]">
                        <Link
                            className="hover:text-primary cursor-pointer"
                            to="/shop"
                        >
                            {i18n?.t("Shop")}
                        </Link>
                    </li>
                </ul>
                <ul className="flex flex-col gap-[16px]">
                    <li className="footer_text text-[#E8E8E8]">
                        <Link
                            className="hover:text-primary cursor-pointer"
                            to="/contact"
                        >
                            {i18n?.t("Contact Us")}
                        </Link>
                    </li>
                    <li className="footer_text text-[#E8E8E8]">
                        <Link
                            className="hover:text-primary cursor-pointer"
                            to="/blog"
                        >
                            {i18n?.t("Blog")}
                        </Link>
                    </li>
                    <li className="footer_text text-[#E8E8E8]">
                        <Link
                            className="hover:text-primary cursor-pointer"
                            to="/service"
                        >
                            {i18n?.t("Service")}
                        </Link>
                    </li>
                    <li className="footer_text text-[#E8E8E8]">
                        <Link
                            className="hover:text-primary cursor-pointer"
                            to="/privacy-policy"
                        >
                            {i18n?.t("Privacy Policy")}
                        </Link>
                    </li>
                    <li className="footer_text text-[#E8E8E8]">
                        <Link
                            className="hover:text-primary cursor-pointer"
                            to="/terms-and-conditions"
                        >
                            {i18n?.t("Terms & Conditons")}
                        </Link>
                    </li>
                </ul>
                <div className="flex flex-col gap-[16px] sm:w-[300px] w-full">
                    <div className="flex gap-2 ">
                        <RxHome className="shrink-0 text-[20px] mt-1 font-bold text-primary " />
                        <p className="footer_text text-[#E8E8E8] ">
                            {sitedata?.address}
                        </p>
                    </div>
                    <div className="flex gap-2 items-center ">
                        <FiPhoneCall className="shrink-0 h-5 text-[20px] text-primary " />
                        <p className="footer_text text-[#E8E8E8]">
                            {sitedata?.phone}
                        </p>
                    </div>
                    <div className="flex gap-2 items-center ">
                        <MdOutlineEmail className="shrink-0 text-[20px] text-primary " />
                        <p className="footer_text text-[#E8E8E8]">
                            {sitedata?.email}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2 ">
                        {paymentMethod?.docs?.map((i, index) => {
                            return (
                                <img
                                    key={index}
                                    src={i?.image}
                                    alt={i?.name}
                                    width={40}
                                    height={25}
                                    className="bg-white rounded p-1 h-[32px] w-[46px] object-contain"
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center sm:max-w-[400px] max-w-[250px] mx-auto ">
                <form onSubmit={handleSubscribe} className="w-full  relative">
                    <input
                        ref={emailref}
                        placeholder={i18n?.t("Your Email")}
                        name="email"
                        className="bg-transparent border-b outline-none w-full h-[40px] pl-[10px] text-[#E8E8E8] placeholder:text-[#dbdbdb]"
                        type="email"
                        required
                    />
                    <button
                        type="submit"
                        className="text-primary text-opacity-80 hover:text-opacity-100 text-xl absolute top-[50%] right-[10px] translate-y-[-50%]"
                    >
                        <IoMdSend />
                    </button>
                </form>{" "}
            </div>
            <p className="py-[28px] bg-[#223668] text-center text-[#E8E8E8] mt-[54px]">
                {sitedata?.copyright}
            </p>
        </div>
    );
};

export default Footer;
