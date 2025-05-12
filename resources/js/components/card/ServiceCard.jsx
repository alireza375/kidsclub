import { Rate } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { columnFormatter } from "../../helpers/utils";
import { useI18n } from "../../providers/i18n";
import { useSite } from "../../context/site";
import { StylesBorder } from "../../styles/styles";

const ServiceCard = ({ data }) => {
    const { convertAmount } = useSite();
    const i18n = useI18n();
    const { currencySymbol } = useSite();
    return (
        <div style={StylesBorder("49D574", 10)}>
            <div
                className="serviceCard group p-5 lg:p-4 xl:p-5 bg-[#FCEEEE] rounded-[10px] h-full"

            >
                <Link
                    to={`/service/${data?.id}`}
                >
                    <img
                        className="w-full object-cover rounded-md md:h-[287px] "
                        src={data?.image}
                        alt=""
                    />
                </Link>
                <div className="mt-5 lg:mt-6 xl:mt-8">
                    <div className="flex items-center justify-between gap-2">
                        <Link
                            to={`/service/${data?.id}`} className="heading2 group-hover:text-[#49D574] line-clamp-1 transition-all duration-300">
                            {columnFormatter(data?.name)}
                        </Link>
                        <div className="flex items-center">
                            <Rate
                                disabled
                                className="text-primary"
                                count={1}
                                defaultValue={data?.avg_rating || 0}
                            ></Rate>
                            <p className="description mx-1">
                                {data?.avg_rating || 0}
                            </p>
                        </div>
                    </div>
                    <p className="description mt-4 lg:h-[70px] h-[50px] line-clamp-2 lg:mt-4">
                        {columnFormatter(data?.title).slice(0, 78)}
                    </p>
                    <div className="mt-6 lg:mt-8 xl:mt-10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <p className="heading2 group-hover:text-[#49D574] transition-all duration-300">
                                {currencySymbol}
                                {convertAmount(data?.discount_price)}
                            </p>
                            <p className="description text-[#B4AAB4]">
                                <del>
                                    {currencySymbol}
                                    {convertAmount(data?.price)}
                                </del>
                            </p>
                        </div>
                        <Link
                            to={`/service/${data?.id}`}
                            className="public-button px-5 font-bold py-3 rounded-md"
                        >
                            {i18n?.t("Join Now")}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;
