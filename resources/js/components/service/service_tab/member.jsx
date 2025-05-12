import React from "react";
import { useI18n } from "../../../providers/i18n";
import avatar from "./../../../../images/defaultimg.jpg";
const Members = ({data}) => {
    const i18n = useI18n();
    return (
        <div className="mt-10">
            <h1 className="header text-text">{i18n.t("Total number of members")} : {data?.joined_users?.length}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-[37px]">
                {
                    data?.joined_users?.map((member, index) => (
                        <div key={index} className=" mb-[10px]">
                        <img
                            src={member?.image || avatar}
                            alt="user"
                            className="border border-[#FF6B6D] w-80 h-[250px] object-cover"
                        />
                        <h1 className="midtitle !font-bold text-text mt-5 text-center">
                            {member?.name || i18n.t("Anonymous User")}
                        </h1>
                    </div>
                    ))
                }
             
            </div>
        </div>
    );
};
export default Members;
