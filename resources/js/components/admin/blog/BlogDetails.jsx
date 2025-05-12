import React from "react";
import { useFetch, useTitle } from "../../../helpers/hooks";
import { fetchBlogs, fetchSingleBlog } from "../../../helpers/backend";
import { Link, useParams } from "react-router-dom";
import blogImage from "../../../../images/bg-blog.png";
import { columnFormatter } from "../../../helpers/utils";
import dayjs from "dayjs";
import { array } from "zod";
import { useI18n } from "../../../providers/i18n";
import { useSite } from "../../../context/site";

const BlogDetails = () => {
    const { id } = useParams();
    const [data, getData, { loading }] = useFetch(fetchSingleBlog, { id });
    const i18n = useI18n();
    const { sitedata } = useSite();
    useTitle(
        sitedata?.title +
            " | " +
            i18n.t("Blog details") +
            " - " +
            i18n.t("Admin")
    );
    return (
        <div className="p-6 bg-gray-100 mx-auto space-y-6 rounded-md ">
            <article className="mx-auto p-4 font-nunito">
            <div className="flex items-end justify-end">
                                <Link
                    to="/admin/blogs"
                    className="admin-btn px-3 py-1 text-white  mb-4"
                >
                    {i18n?.t("Back")}
                </Link>
            </div>

                {/* Hero Section */}
                <div className="relative w-full h-[300px] rounded-3xl mt-7 overflow-hidden mb-8 ">
                    <img
                        src={data?.image}
                        alt="Child in helmet against mountain backdrop"
                        className="object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-center text-secondary rounded-b-[20px] bg-gradient-to-b from-[rgba(255,255,255,0.06)] to-[rgba(217,217,217,0.06)] shadow-[0px_4px_25px_-1px_rgba(0,0,0,0.20)] backdrop-blur-[10px] ">
                        {/* Category */}
                        <div className="flex flex-col gap-2 rounded-full">
                            <div className="flex items-center gap-2">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                    />
                                </svg>
                                <span className="text-base">Category</span>
                            </div>
                            <div>
                                <span className="text-base">
                                    {columnFormatter(data?.category?.name)}{" "}
                                </span>
                            </div>
                        </div>

                        {/* Date and Comments */}
                        <div className="flex items-center gap-4">
                            <div className=" flex flex-col gap-2 rounded-full">
                                <div className="flex items-center gap-2">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <span className="text-base">Date</span>
                                </div>
                                <span className="text-base">
                                    {dayjs(data?.created_at).format(
                                        "MMM DD , YYYY"
                                    )}
                                </span>
                            </div>
                            <div className="flex flex-col gap-2 rounded-full">
                                <div className="flex items-center gap-2">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                        />
                                    </svg>
                                    <span className="text-base">Comments</span>
                                </div>
                                <span className="text-base">
                                    {data?.comments?.length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6 text-secondary">
                    <h1 className="text-3xl md:text-4xl font-bold ">
                        {columnFormatter(data?.title)}
                    </h1>

                    <p className="text-gray-600 leading-relaxed">
                        {columnFormatter(data?.short_description)}
                    </p>

                    {/* Campfire Section */}
                    <div
                        className="space-y-6"
                        dangerouslySetInnerHTML={{
                            __html: columnFormatter(data?.details),
                        }}
                    ></div>
                </div>
            </article>
        </div>
    );
};

export default BlogDetails;
