import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { columnFormatter } from "../../helpers/utils";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { fetchSingleBlog } from "../../helpers/backend";
import { useFetch } from "../../helpers/hooks";
import { useI18n } from "../../providers/i18n";
import BlogComment from "./BlogComment";

export default function SingleBlogSection() {
    const { id } = useParams();
    const [data, getData, { loading }] = useFetch(fetchSingleBlog, { id });
    const [isHovered, setIsHovered] = useState(false);
    const i18n = useI18n();
    const { langCode } = useI18n();
    useEffect(() => {
        getData({ id });
    },[id]);
    return (
        <div>
            <motion.div
                className="relative w-full rounded-xl overflow-hidden"
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                initial={false}
            >
        

                {/* Main Image */}
                <div className="w-full relative">
                    <img
                        src={data?.image}
                        alt=" image"
                        className="object-cover w-full h-[400px]"
                    />
                </div>

                {/* Info Section */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-center text-white rounded-b-[20px] bg-gradient-to-b from-[rgba(255,255,255,0.06)] to-[rgba(217,217,217,0.06)] shadow-[0px_4px_25px_-1px_rgba(0,0,0,0.20)] backdrop-blur-[10px] "
                        >
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
                                    <span className="text-base">{i18n?.t("Category")}</span>
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
                                        <span className="text-base">{i18n?.t("Date")}</span>
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
                                        <span className="text-base">
                                            {i18n?.t("Comments")}
                                        </span>
                                    </div>
                                    <span className="text-base">
                                        {data?.comments?.length}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
            <div className="mt-5">
                <div className="space-y-3">
                    <h3 className="header4">
                        {columnFormatter(data?.title)}
                    </h3>
                    <p className="description">
                        {columnFormatter(data?.short_description)}
                    </p>
                </div>
                <div className="space-y-8 md:mt-10 mt-5"  dangerouslySetInnerHTML={{
                        __html: columnFormatter(data?.details),
                    }}>
                   
                </div>
            </div>
            <BlogComment blogId={data?.id} comments={data?.comments} />
        </div>
    );
}
