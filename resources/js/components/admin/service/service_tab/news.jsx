import React from "react";
import { columnFormatter } from "../../../../helpers/utils";
import { useI18n } from "../../../../providers/i18n";
import { GrAnnounce } from "react-icons/gr";
import { fetchServiceNotices } from "../../../../helpers/backend";
import { useFetch } from "../../../../helpers/hooks";
import dayjs from "dayjs";

const News = ({ data }) => {
    const i18n = useI18n();
    const [notices,getNotices] = useFetch(fetchServiceNotices, { id: data?.id });
    return (
        <div className="bg-white rounded-[20px] border border-breadcrumb p-8 shadow-lg space-y-6">
            <div className="flex items-center gap-4 mb-7">
                <h1 className="text-3xl font-bold text-text">
                    {i18n.t("News")}
                </h1>
                <GrAnnounce className="text-[32px] text-teal-blue" />
            </div>

            <div className="space-y-6">
                {notices?.docs?.map((news, index) => (
                    <div
                        key={index}
                        className="border border-red-100 bg-white rounded-2xl shadow-md p-6 md:p-10 hover:shadow-lg transition-shadow duration-300 relative"
                    >
                        <h1 className="absolute top-6 right-6 text-gray-600">{dayjs(news?.created_at).format("DD-MM-YYYY")}</h1>
                        <h2 className="text-xl font-semibold text-text mb-3 break-words">
                            {columnFormatter(news?.title)}
                        </h2>

                        <p className="text-gray-600 leading-relaxed">
                            {columnFormatter(news?.description)}
                        </p>
                    </div>
                ))}
                {notices?.docs?.length === 0 && (
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-text mb-3">
                            {i18n.t("No news found")}
                        </h2>
                    </div>
                )}
            </div>
        </div>
    );
};
export default News;
