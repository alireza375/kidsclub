import React, { useEffect, useState } from "react";
import HeaderTitle from "../common/HeaderTitle";
import { Form, Pagination } from "antd";
import { AiOutlineSearch } from "react-icons/ai";
import { FaChevronDown } from "react-icons/fa";
import ServiceCard from "../card/ServiceCard";
import { fetchPublicServices } from "../../helpers/backend";
import { useI18n } from "../../providers/i18n";
import { useFetch } from "../../helpers/hooks";
import serviceNotFound from "../../../images/serviceNotFound.webp";
import BlogSkeleton from "../common/skeleton/BlogSkeleton";

const Services = () => {
    const HeaderStyles = {
        titleS: "bg-primary/50",
    };
    const [data, getData, { loading }] = useFetch(fetchPublicServices, {
        limit: 9,
    });
    const i18n = useI18n();
    const { langCode } = useI18n();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);

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

    return (
        <div className="custom-container py-[60px]">
            <div className="md:flex  justify-between items-center">
                <HeaderTitle
                    header={"Our Service"}
                    title={i18n.t("What We Offer")}
                    styles={HeaderStyles}
                />
                <Form.Item>
                    <div className=" border-2 border-dashed border-red-400 h-[50px] mt-8 w-full md:w-[404px] rounded-lg p-2 bg-dark-rose flex items-center">
                        <AiOutlineSearch className="text-green-500 ml-2 text-xl" />
                        <input
                            type="text"
                            className="flex-1 bg-transparent border-none outline-none pl-2"
                            placeholder="Search"
                            onChange={(e) =>
                                getData({
                                    search: e.target.value,
                                    langCode: langCode,
                                })
                            }
                        />
                    </div>
                </Form.Item>
            </div>

            <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1  gap-6 my-[56px]">
                {loading
                    ? Array(6)
                          .fill(null)
                          .map((_, i) => <BlogSkeleton key={i} />)
                    : data?.docs?.map((data, index) => (
                          <ServiceCard key={index} data={data} />
                      ))}
            </div>
            <div className="text-center">
                {data?.docs?.length <= 0 && (
                    <div className="header text-2xl font-bold text-gray-600 text-center flex flex-col items-center gap-y-8">
                        <div>
                            <img
                                src={serviceNotFound}
                                alt="serviceNotFound"
                                className="w-[200px] mx-auto"
                            />
                        </div>
                        {i18n.t("No Service Found")}

                        <button
                            className="bg-primary px-5 py-1 flex items-center gap-1 text-white rounded-full text-lg"
                            onClick={() => (window.location.href = "/")}
                        >
                            {i18n.t("Go Back")}
                        </button>
                    </div>
                )}
            </div>
            {data?.totalDocs > 0 && (
                <Pagination
                    align="center"
                    className="!mt-[50px] body-paginate"
                    current={currentPage}
                    pageSize={pageSize}
                    total={data?.totalDocs}
                    onChange={onPageChange}
                />
            )}
        </div>
    );
};

export default Services;
