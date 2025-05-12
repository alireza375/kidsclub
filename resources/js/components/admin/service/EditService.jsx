import React from "react";
import PageTitle from "../../common/page-title";
import { useParams } from "react-router-dom";
import { useFetch, useTitle } from "../../../helpers/hooks";
import { fetchSingleService } from "../../../helpers/backend";
import ServiceForm from "./ServiceFrom";
import { useI18n } from "../../../providers/i18n";
import { useSite } from "../../../context/site";

const EditService = () => {
    const { id } = useParams();
    const i18n = useI18n();
    const [data, getData, { loading }] = useFetch(fetchSingleService, { id });
    const { sitedata } = useSite();
    useTitle(
        sitedata?.title +
            " | " +
            i18n.t("Edit Service") +
            " - " +
            i18n.t("Admin")
    );
    return (
        <div className="p-4 bg-gray-100 min-h-full rounded-md">
            <div className="flex justify-between items-center">
                <PageTitle title="Edit Service" />
                <button
                    className="admin-btn flex items-center gap-1 text-white rounded w-fit"
                    onClick={() => window.history.back()}
                >
                    {i18n?.t("Back")}
                </button>
            </div>
            <ServiceForm isEdit={true} data={data} />
        </div>
    );
};

export default EditService;
