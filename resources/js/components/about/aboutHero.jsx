import React from "react";
import { columnFormatter } from "../../helpers/utils";
import { useI18n } from "../../providers/i18n";
const AboutHero = ({ aboutdata }) => {
    const i18n = useI18n();
    return (
        <div className="bg-[#FCF6EE] ">
            <div className="custom-container grid lg:grid-cols-2 grid-cols-1 gap-6 md:gap-10 pt-[60px] pb-[50px]">
                <div className="">
                    <div className="mb-8">
                        <h2 className="text-[#ff6b6b] text-lg mb-4">
                            {i18n?.t("About Us")}
                        </h2>
                        <h1 className="text-secondary title-about mb-6">
                            {columnFormatter(aboutdata?.heading)}
                        </h1>
                        <p className="text-gray-600 max-w-2xl text-lg">
                            {columnFormatter(aboutdata?.description)}{" "}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 sm:gap-10 gap-6">
                        {
                            aboutdata?.features?.map((data, index) => {
                                return (
                                    <div className="flex items-center sm:gap-4 gap-2" key={index}>
                                       <img src={Array.isArray(data?.icon)?data?.icon[0]?.url : data?.icon} alt="image" className="sm:w-[56px] sm:h-[56px] h-[30px] w-[30px] rounded-[20px]"/>
                                    <div>
                                        <h3 className="about-sm-text sm:w-[122px]">
                                          {columnFormatter(data?.title)}
                                        </h3>
                                    </div>
                                </div>
                                )
                            })
                        }

                    </div>
                </div>

                <div class="grid grid-cols-3 gap-4">
                   {aboutdata?.gallary?.image1 && <div class="col-span-2 h-[150px] sm:h-[284px]">
                        <img
                            src={Array?.isArray(aboutdata?.gallary?.image1)?aboutdata?.gallary?.image1[0]?.url : aboutdata?.gallary?.image1}
                            alt="Group of kids"
                            class="rounded-[20px]  border-2 h-full w-full border-dashed  border-green-400"
                        />
                    </div>
                   }
                    <div class="col-span-1 h-[150px] sm:h-[284px]">
                        <img
                           src={Array.isArray(aboutdata?.gallary?.image2)?aboutdata?.gallary?.image2[0]?.url : aboutdata?.gallary?.image2}
                            alt="Kid with toy"
                            class="rounded-full border-2 h-full w-full border-dashed border-red-400"
                        />
                    </div>
                    <div class="col-span-1 h-[150px] sm:h-[284px]">
                        <img
                           src={Array.isArray(aboutdata?.gallary?.image3)?aboutdata?.gallary?.image3[0]?.url : aboutdata?.gallary?.image3}
                            alt="Colorful kids"
                            class="rounded-[20px] border-2 h-full w-full border-dashed border-green-400"
                        />
                    </div>
                    <div class="col-span-2 h-[150px] sm:h-[284px]">
                        <img
                           src={Array.isArray(aboutdata?.gallary?.image4)?aboutdata?.gallary?.image4[0]?.url : aboutdata?.gallary?.image4}
                            alt="Teacher with kids"
                            class="rounded-[20px] border-2 h-full w-full border-dashed border-red-400"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutHero;
