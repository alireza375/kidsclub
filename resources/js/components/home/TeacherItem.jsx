import React from "react";
import { Link } from "react-router-dom";
import { FaLinkedinIn,FaFacebookF,FaInstagram  } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";
import { StylesBorder } from "../../styles/styles";
import Trainer from './../../../images/defaultimg.jpg'
import { useI18n } from "../../providers/i18n";

export default function TeacherItem({ data }) {
    const i18n = useI18n();
    return (
        <div className="group cursor-pointer">
            <div className="rounded-md bg-white border-dashed  relative "  style={StylesBorder("fe5c45", 6, 3)}>
                <div className="absolute left-[39.63px] hidden group-hover:block transition-all duration-300">
                    <ul className="flex flex-col gap-4 bg-[#49D574] pt-[12.63px] pb-[19.18px] rounded-b-[32.5px]">
                    <li className="px-4 ">
                            <Link to={data?.instagram}>
                                <FaInstagram  className="text-[#E7E7E7] hover:text-primary transition-all duration-300 text-[19.09px] cursor-pointer" />
                            </Link>
                        </li>
                        <li className="px-4 ">
                            <Link to={data?.linkedin}>
                                <FaLinkedinIn className="text-[#E7E7E7] hover:text-primary transition-all duration-300 text-[19.09px] cursor-pointer" />
                            </Link>
                        </li>
                        <li className="px-4 ">
                            <Link to={data?.twitter}>
                                <RiTwitterXFill className="text-[#E7E7E7] hover:text-primary transition-all duration-300 text-[19.09px] cursor-pointer" />
                            </Link>
                        </li>
                        <li className="px-4 ">
                            <Link to={data?.facebook}>
                                <FaFacebookF className="text-[#E7E7E7] hover:text-primary transition-all duration-300 text-[19.09px] cursor-pointer" />
                            </Link>
                        </li>
                    </ul>
                </div>
                <img
                    src={data?.image || Trainer}
                    alt={data?.name}
                    className="w-[424px] h-[350px] rounded-md object-center"
                />
            </div>
            <div className="bg-[#FFF] py-1.5 text-center">
                <h3 className="heading2">{data?.name}</h3>
            </div>

            <div className="bg-[#F8F8F8] py-1.5 text-center">
                <p>{i18n?.t("Coach")}</p>
            </div>
        </div>
    );
}
