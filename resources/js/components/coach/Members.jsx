import React, { Children } from "react";
import { useI18n } from "../../providers/i18n";
import { useFetch, useTitle } from "../../helpers/hooks";
import { fetchCoachMembers } from "../../helpers/backend";
import { Empty } from "antd";
import { useSite } from "../../context/site";

const Members = () => {
    const i18n = useI18n();
    const [members , getMembers] = useFetch(fetchCoachMembers);
    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("Members") + " - " + i18n.t("Coach"));
    return (
        <div className="p-6 mx-auto space-y-6 rounded-md shadow-dashboard">
            <h1 className="mb-4 text-2xl font-bold">{i18n.t("Members")}</h1>
            <div className="mt-6">
                 {
                members?.docs?.length === 0 && (
                    <Empty />
                )
            }
            <ParentChildList data={members} i18n={i18n}/>
            </div>

        </div>
    );
};

export default Members;

const ParentChildList = ({ data, i18n }) => {
    const calculateDetailedAge = (dob) => {
        if (!dob) return "N/A"; // Handle cases where DOB is missing

        const dobDate = new Date(dob);
        const today = new Date();

        let years = today.getFullYear() - dobDate.getFullYear();
        let months = today.getMonth() - dobDate.getMonth();
        let days = today.getDate() - dobDate.getDate();

        // Adjust for negative months
        if (months < 0) {
            years -= 1;
            months += 12;
        }

        // Adjust for negative days
        if (days < 0) {
            months -= 1;
            days += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); // Days in the previous month
        }

        // Construct the age string
        const yearString = years > 0 ? `${years} year${years > 1 ? "s" : ""}` : "";
        const monthString = months > 0 ? `${months} month${months > 1 ? "s" : ""}` : "";

        return [yearString, monthString].filter(Boolean).join(" ");
    };

    return (
        <div className="parent-child-list">
            {data?.docs?.map((child, index) => (
                <div
                    key={index}
                    className="flex items-start gap-6 p-4 mb-6 bg-white border border-gray-200 rounded-lg shadow-lg"
                >
                    {/* Child Information */}
                    <div className="flex items-center gap-4">
                        <img
                            src={child?.children?.image}
                            className="object-cover w-16 h-16 border-2 rounded-full border-primary-500"
                            alt={child?.children?.name}
                        />
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">
                                {child?.children?.name}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {i18n.t("Age")}:{" "}
                                {child?.children?.dob ? calculateDetailedAge(child?.children?.dob) : "N/A"}
                            </p>
                        </div>
                    </div>

                    {/* Parent Information */}
                    <div className="flex-1 pl-6 ml-6 border-l border-gray-300">
                        <h3 className="mb-2 font-semibold text-md text-primary-500">
                            {i18n.t("Parent Information")}
                        </h3>
                        <p className="text-sm text-gray-700">
                            <span className="font-medium text-gray-800">
                                {i18n.t("Name")}:
                            </span>{" "}
                            {child?.children?.parent?.name}
                        </p>
                        <p className="text-sm text-gray-700">
                            <span className="font-medium text-gray-800">
                                {i18n.t("Email")}:
                            </span>{" "}
                            {child?.children?.parent?.email}
                        </p>
                        <p className="text-sm text-gray-700">
                            <span className="font-medium text-gray-800">
                                {i18n.t("Phone")}:
                            </span>{" "}
                            {child?.children?.parent?.phone}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};


