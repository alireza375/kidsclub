// src/pages/NotFound.js
import { Button } from "antd";
import React from "react";
import { BiCompass, BiHome, BiPhone } from "react-icons/bi";
import { Link } from "react-router-dom";
import NotFoundImage from "../../images/404.png";
import FormButton from "../components/common/form/form-button";
import { useI18n } from "../providers/i18n";
import { useSite } from "../context/site";
import { useTitle } from "../helpers/hooks";
const NotFound = () => {
    const i18n = useI18n();
    const {sitedata} = useSite();
    useTitle(`${sitedata?.title || "KidStick"} | Home`);
    return (
        <div className="min-h-screen bg-[#FCF7EE] flex flex-col items-center justify-center px-4">
            <div className="text-center">
                <img src={NotFoundImage} alt="404"></img>
            </div>
            <h1 className="md:text-4xl text-xl  font-bold font-nunito text-secondary my-10 text-center">
                {i18n?.t("Opps! Looks like this page is playing hide and seek")}.
            </h1>
            <Link to="/" >
                <FormButton type="primary" size="large" shape="round" className="flex items-center text-lg ">
                    <BiHome className="mr-2" /> Back to Home
                </FormButton>
            </Link>
        </div>
    );
};

export default NotFound;
