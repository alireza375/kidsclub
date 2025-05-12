import { Rate } from "antd";
import React, { useState } from "react";
import { LuClock4 } from "react-icons/lu";
import { columnFormatter } from "../../helpers/utils";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { useSite } from "../../context/site";
import { StylesBorder } from "../../styles/styles";
const EventCard = ({ data, i18n, borderColor }) => {
    const { currencySymbol, convertAmount } = useSite();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="  bg-[#FFFFFF] rounded-[10px] h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="" style={StylesBorder(borderColor, 10, 4)}>
                <div className="relative h-[264px]  overflow-hidden  rounded-[10px]">
                    <img
                        className="w-full h-full object-cover rounded-md hover:scale-110 transition-all duration-300"
                        src={data?.image}
                        alt=""
                    />
                    <div className="absolute rounded-[10px] px-3 lg:px-4 xl:px-5 py-1 lg:py-2 bg-white top-6 left-6 shadow-dashboard">
                        <p className="heading2 text-center text-[#49D574]">
                            {dayjs(data?.event_date).format("DD")}
                        </p>
                        <p className="description !font-medium text-center text-[#49D574]">
                            {dayjs(data?.event_date).format("MMM")}
                        </p>
                    </div>
                </div>
            </div>

            <div className="">
                <div className="p-4 lg:p-5 xl:p-6">
                    <h3
                        className={`heading2 text-[${borderColor}] transition-all line-clamp-1 duration-300`}
                        style={{ color: isHovered ? `#${borderColor}` : "#2C2C2C" }}
                    >
                        {columnFormatter(data?.title)}
                    </h3>
                    <div className="description my-4 lg:my-5 flex items-center gap-3">
                        <LuClock4 className="text-[#FFED00]" size={24} />
                        <p>
                            {dayjs(data?.start_time, "HH:mm:ss").format(
                                "hh:mm a"
                            )}{" "}
                            -{" "}
                            {dayjs(data?.end_time, "HH:mm:ss").format(
                                "hh:mm a"
                            )}{" "}
                        </p>
                    </div>
                    <div className=" font-thin text-secondary h-[60px]">
                        <p>{data?.location}</p>
                    </div>
                </div>

                <div className=" flex items-center justify-between bg-[#F8F8F8] px-4 lg:px-5 xl:px-6 py-3">
                    <div className="flex items-center gap-2">
                        <p className="description">{i18n?.t("From")}</p>
                        <div className="w-[3px] h-6 bg-[#FFED00] mx-2"></div>
                        <p className="heading2 text-[#49D574] transition-all duration-300"style={{color:`#${borderColor}`}}>
                            {data?.type === "free"
                                ? "Free"
                                : `${currencySymbol}${Math.floor(
                                      convertAmount(data?.discount_price)
                                  )}`}
                        </p>
                    </div>
                    <Link
                        to={`/event/${data?.id}`}
                        className="border font-semibold text-secondary px-4 py-2 text-lg duration-300  hover:text-white rounded-md"
                        style={{ backgroundColor: isHovered ? `#${borderColor}` : "white",borderColor:`#${borderColor}`,color: isHovered ? `white` : `#${borderColor}` }}

                    >
                        {i18n?.t("View Details")}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
