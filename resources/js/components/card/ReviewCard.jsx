import { Rate } from "antd";
import React from "react";
import { columnFormatter } from "../../helpers/utils";
import { StylesBorder } from "../../styles/styles";
const ReviewCard = ({ data, borderColor, bgColor }) => {
    return (
        <div style={StylesBorder(borderColor, 10, 3)} className="">
            <div
                className={`bg-${bgColor} rounded-[10px] p-[1px] ` } style={{backgroundColor:bgColor}}
                
            >
                <div className="mt-14 mx-9 mb-6 bg-white relative rounded-2xl">
                    <div
                        className={`absolute left-0 -top-12 z-50 rounded-full border-[8px] flex items-center justify-center`}
                        style={{backgroundColor:bgColor, borderColor:bgColor}}
                    >
                        <img
                            className={` md:w-[91px] md:h-[91px] h-14 w-14 rounded-full border-[8px] border-[#${borderColor}]`}
                            src={data?.image}
                            alt="reviewer"
                        />
                    </div>
                    <div
                        className={`relative z-0 p-4 lg:p-5 xl:p-6  !text-transparent text-center rounded-[25px]`}
                    >
                        <div className="pl-8">
                            <Rate
                                disabled
                                className={`text-center  text-[20px]`}
                                count={5}
                                defaultValue={data?.rating}
                                style={{color:bgColor}}
                            />
                            <h3 className={`heading2`} style={{color:bgColor}}>{data?.name}</h3>
                        </div>
                        <p className={`text-xs font-nunito font-medium md:mt-6 mt-4 !text-[${bgColor}]`} style={{color:bgColor}}>
                            "{columnFormatter(data?.description)}" 
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;
