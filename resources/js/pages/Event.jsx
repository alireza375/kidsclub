import React, { useEffect, useState } from "react";
import { PageHeader } from "../components/common/upperSection";
import { eventData } from "../data/event-data";
import EventCard from "../components/card/EventCard";
import { Pagination } from "antd";
import { fetchPublicEvents } from "../helpers/backend";
import { useI18n } from "../providers/i18n";
import { useFetch, useTitle } from "../helpers/hooks";
import { useSite } from "../context/site";
import BlogSkeleton from "../components/common/skeleton/BlogSkeleton";
import serviceNotFound from "./../../images/serviceNotFound.webp";
export default function Event() {
    const [data, getData, { loading }] = useFetch(fetchPublicEvents, {
        limit: 9,
    });
    const i18n = useI18n();
    const { langCode } = useI18n();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const { sitedata } = useSite();
    useTitle(`${sitedata?.title || "KidStick"} | Event`);
    const onPageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        getData({ page, limit: pageSize });
    };

    useEffect(() => {
        getData({
            page: currentPage,
            limit: pageSize,
        });
    }, [currentPage, pageSize]);
    const borderColors = ["49D574", "FDB157", "FF6B6D"];

    return (
        <div className="bg-coralred">
            <PageHeader title="Event" />
            <div className="custom-container py-20">
                <h3 className="heading3 text-center ">
                    {i18n.t("Our Calendar Upcoming School Events")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-6 gap-2 mt-14">
                    {loading
                        ? Array(6)
                              .fill(null)
                              .map((_, i) => <BlogSkeleton key={i} />)
                        : data?.docs?.map((item, idx) => (
                              <EventCard
                                  data={item}
                                  key={idx}
                                  i18n={i18n}
                                  borderColor={
                                      borderColors[idx % borderColors.length]
                                  }
                              />
                          ))}
                </div>
                <div>
                    {data?.totalDocs > 0 ? (
                        <Pagination
                            align="center"
                            className="!mt-[100px] body-paginate"
                            current={currentPage}
                            pageSize={pageSize}
                            total={data?.totalDocs}
                            onChange={onPageChange}
                        />
                    ):(
                           <div className="header text-2xl font-bold text-gray-600 text-center flex flex-col items-center gap-y-8">
                                              <div>
                                                  <img
                                                      src={serviceNotFound}
                                                      alt="serviceNotFound"
                                                      className="w-[200px] mx-auto"
                                                  />
                                              </div>
                                              {i18n.t("No Event Found")}

                                              <button
                                                  className="bg-primary px-5 py-1 flex items-center gap-1 text-white rounded-full text-lg"
                                                  onClick={() => (window.location.href = "/")}
                                              >
                                                  {i18n.t("Go Back")}
                                              </button>
                                          </div>
                    )}
                </div>
            </div>
        </div>
    );
}
