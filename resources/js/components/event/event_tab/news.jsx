import React from "react";
import { useI18n } from "../../../providers/i18n";
import { GrAnnounce } from "react-icons/gr";
import { columnFormatter } from "../../../helpers/utils";

const News = ({ data }) => {
    const i18n = useI18n();
    return (
        <div className="bg-white rounded-[20px] border border-breadcrumb p-[50px] shadow-lg !mb-3">
            <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold text-text">
                    {i18n.t("News")}
                </h1>
                <GrAnnounce className="text-[32px] text-primary" />
            </div>

            <div className="space-y-6 mt-8">
                {data?.event_news?.map((news, index) => (
                    <div
                        key={index}
                        className="border border-red-100 bg-white rounded-2xl shadow-md p-6 md:p-10 hover:shadow-lg transition-shadow duration-300"
                    >
                        <h2 className="text-2xl font-semibold text-text mb-3">
                            {columnFormatter(news?.title)}
                        </h2>

                        <p className="text-gray-600 leading-relaxed">
                            {columnFormatter(news?.description)}
                        </p>
                    </div>
                ))}
                {data?.event_news?.length === 0 && (
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
