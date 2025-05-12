import React from "react";
import { Link, Links } from "react-router-dom";
import { columnFormatter } from "../../helpers/utils";
import { useI18n } from "../../providers/i18n";
import dayjs from "dayjs";

export default function BlogCard({ data,setIsList }) {
    const i18n = useI18n();
    return (
        <div className=" overflow-hidden !font-nunito text-secondary ">
            <div className="relative">
                <div className="relative h-[218px] w-full">
                    <img
                        src={data?.image}
                        alt="Blog image"
                        fill="true"
                        className="object-cover w-full h-full rounded-[10px]"
                    />
                </div>

                <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-[#ff6b6b] text-white">
                    <span className="text-xl font-medium mr-1">
                        {dayjs(data?.created_at).format("DD")}
                    </span>
                    <span className="text-xl">{dayjs(data?.created_at).format("MMM")}</span>
                </div>
            </div>

            <div className="py-[14px] pr-[14px] space-y-3">
                <div className="flex gap-2 header-description font-nunito mb-4">
                    <span className="px-2 py-1  !text-base font-bold rounded-full text-[#ff6b6b] line-clamp-1">
                        • {columnFormatter(data?.category?.name)}
                    </span>
                    <span className="px-2 py-1  !text-base font-bold rounded-full  text-gray-600">
                        {data?.author}
                    </span>
                </div>

                <h2 className="header mb-3 h-[72px] line-clamp-2">{columnFormatter(data?.title)}</h2>

                <p className="header-description  text-breadcrumb tracking-wider fornt-thin !text-base mb-6 h-[45px] line-clamp-2">
                    {columnFormatter(data?.short_description) }
                </p>

                <Link onClick={() => setIsList(true)} to={`/blog/${data?.id}`} className="block">
                    <button className="kids-button mb-6">{i18n?.t("Read more")}</button>
                </Link>
            </div>
        </div>
    );
}
