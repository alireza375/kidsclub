import React from "react";
import HeaderTitle from "../common/HeaderTitle";
import gole from "../../../images/gole.png";
import { columnFormatter } from "../../helpers/utils";

const Mission = ({ missionData }) => {
    const HeaderStyles = {
        titleS: "bg-[#ffe3ac]",
    };

    return (
        <div className="custom-container  pt-[60px] pb-[50px]">
            <div className="flex justify-center items-center">
                <HeaderTitle
                    header={"Our Work"}
                    title={"Our Mission And Vision"}
                    center={true}
                    styles={HeaderStyles}
                />
            </div>
            <div className="mt-9 md:mt-[66px]">
                <div className="bg-tertiary p-6 lg:p-12 flex justify-start rounded-3xl w-full lg:w-[900px] xl:w-[1096px]">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-2">
                                <h2 className="text-white midheading">
                                    {columnFormatter(
                                        missionData?.mission?.heading
                                    )}
                                </h2>
                                <div className="w-8 h-8 md:w-[70px] md:h-[70px]">
                                    <img
                                        src={
                                            Array.isArray(
                                                missionData?.mission?.icon
                                            )
                                                ? missionData?.mission?.icon[0]
                                                      ?.url
                                                : missionData?.mission?.icon
                                        }
                                        alt=""
                                    />
                                </div>
                            </div>

                            <p
                                className="text-white midtitle"
                                dangerouslySetInnerHTML={{
                                    __html: columnFormatter(
                                        missionData?.mission?.description
                                    ),
                                }}
                            >
                                {/* {columnFormatter(missionData?.mission?.description)} */}
                            </p>
                        </div>

                        <div className=" w-2/3 md:w-1/3 lg:h-1/2 mr-0 md:-mr-[90px] sm:-mr-[4rem] xl:mb-0 xl:-mr-56 lg:flex hidden  -mb-12 lg:-mb-[24rem]    aspect-[4/3] h-[95px] sm:h-[200px] xl:h-[290px]">
                            <img
                                src={
                                    Array.isArray(missionData?.mission?.image)
                                        ? missionData?.mission?.image[0]?.url
                                        : missionData?.mission?.image
                                }
                                className="lg:w-full md:w-full w-[290px] h-[110px]  sm:h-[190px] lg:h-full object-fill rounded-2xl"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-9 md:mt-[56px] lg:mb-0 mb-12 flex justify-end">
                <div className="bg-teal-blue p-6 lg:p-12 rounded-3xl w-full lg:w-[900px] xl:w-[1096px]">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className=" w-2/3 md:w-1/3 lg:h-1/2 mr-0 md:mr-0 lg:flex hidden xl:mb-0 xl:-ml-56 md:-ml-10 lg:-ml-[100px]  -mb-12 md:-mb-[20rem]   aspect-[4/3] h-[95px] sm:h-[200px] xl:h-[290px]">
                            <img
                                src={
                                    Array.isArray(missionData?.vision?.image)
                                        ? missionData?.vision?.image[0]?.url
                                        : missionData?.vision?.image
                                }
                                alt="Child engaging in outdoor activity"
                                className="lg:w-full md:w-full w-[290px] h-[110px]  sm:h-[190px] lg:h-full object-fill rounded-2xl"
                            />
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-2">
                                <h2 className="text-white midheading">
                                    {columnFormatter(
                                        missionData?.vision?.heading
                                    )}
                                </h2>
                                <div className="w-8 h-8 md:w-[70px] md:h-[70px]">
                                    <img
                                        src={
                                            Array.isArray(
                                                missionData?.vision?.icon
                                            )
                                                ? missionData?.vision?.icon[0]
                                                      ?.url
                                                : missionData?.vision?.icon
                                        }
                                        alt=""
                                    />
                                </div>
                            </div>

                            <p
                                className="text-white midtitle"
                                dangerouslySetInnerHTML={{
                                    __html: columnFormatter(
                                        missionData?.vision?.description
                                    ),
                                }}
                            >
                                {/* {columnFormatter(missionData?.vision?.description)} */}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
          
        </div>
    );
};

export default Mission;
