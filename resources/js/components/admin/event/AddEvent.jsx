import React from "react";
import EventForm from "./EventForm";
import PageTitle from "../../common/page-title";
import { useI18n } from "../../../providers/i18n";
import { useSite } from "../../../context/site";
import { useTitle } from "../../../helpers/hooks";

const AddEvent = () => {
    const i18n = useI18n();
    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("Add Event") + " - " + i18n.t("Admin"));
    return (
        <div className="p-4 bg-gray-100 min-h-full rounded-md">
            <div className="flex justify-between items-center">
                <PageTitle title="Add Event" />
                <button onClick={() => window.history.back()} className="admin-btn flex items-center gap-1 text-white rounded w-fit">
                    {i18n?.t("Back")}
                </button>
            </div>
            <EventForm />
        </div>
    );
};

export default AddEvent;
