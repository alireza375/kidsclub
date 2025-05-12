import React, { useEffect, useState } from "react";
import { fetchBlogCategories, fetchPublicBlogs } from "../helpers/backend";
import { useFetch, useTitle } from "../helpers/hooks";
import { PageHeader } from "../components/common/upperSection";
import BlogSiderbar from "../components/blog/BlogSiderbar";
import BlogCard from "../components/blog/blogCard";
import BlogSkeleton from "../components/common/skeleton/BlogSkeleton";
import { FaSearch } from "react-icons/fa";
import { Input, Pagination } from "antd";
import { useI18n } from "../providers/i18n";
import BlogNotFoundImage from "../../images/blogNotFound.png";
import { useSite } from "../context/site";


const Blog = () => {
    const [data, getData, { loading }] = useFetch(fetchPublicBlogs, {
        limit: 6,
    });
    const [category, getCategory, { loading: categoryLoading }] =
        useFetch(fetchBlogCategories);
    const [recentBlog, getRecentBlog] = useFetch(fetchPublicBlogs, {
        limit: 5,
    });
    const i18n = useI18n();
    const { langCode } = useI18n();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [selectedCategory, setSelectedCategory] = useState(category || "");
    const [isList , setIsList] = useState(false)

    const onPageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        getData({ page, limit: pageSize, category: selectedCategory });
    };
    
    const {sitedata} = useSite();
    useTitle(`${sitedata?.title || "KidStick"} | Blog`)

    useEffect(() => {
        getData({
            category: selectedCategory,
            page: currentPage,
            limit: pageSize,
        });
    }, [selectedCategory, currentPage, pageSize]);
    return (
        <div className="bg-coralred">
            <PageHeader title="Blog" />
            <div className="custom-container py-20">
                <div className="flex gap-6 flex-col lg:flex-row">
                    <BlogSiderbar
                        category={category}
                        recentBlog={recentBlog}
                        setSelectedCategory={setSelectedCategory}
                        selectedCategory={selectedCategory}
                        getData={getData}
                        isList={isList}
                        setIsList={setIsList}
                    >
                        <Input
                            placeholder="Enter Keyword"
                            className="mb-10 py-4 border-2 border-dashed border-secondary  lg:flex hidden"
                            suffix={
                                <FaSearch className="h-4 w-4 text-gray-400" />
                            }
                            // value={search}
                            onChange={(e) => {
                                getData({
                                    search: e.target.value,
                                    langCode: langCode,
                                });
                                // setSearch(e.target.value);
                            }}
                        />
                    </BlogSiderbar>

                    <div className="lg:w-3/4 w-full">
                        <div className="mb-10">
                            <h1 className="text-secondary text-2xl text-center font-nunito  border-secondary pb-2 font-bold">
                                {sitedata?.title} {i18n.t("Blog")} {" : "}{i18n.t("Learn and Grow")}!
                            </h1>
                        </div>
                        {loading ? (
                            <div className="grid sm:grid-cols-2 gap-6">
                                {Array(6)
                                    .fill(null)
                                    .map((_, i) => (
                                        <BlogSkeleton key={i} />
                                    ))}
                            </div>
                        ) : (
                            <>
                                <div className="grid sm:grid-cols-2 gap-6 ">
                                    {data?.docs?.map((item) => (
                                        <BlogCard key={item?.id} data={item}  setIsList={setIsList} />
                                    ))}
                                </div>
                                {data?.docs?.length <= 0 && (
                                    <div className="text-center text-xl font-bold text-secondary flex flex-col justify-center items-center">
                                        <img
                                            src={BlogNotFoundImage}
                                            alt="BlogNotFoundImage"
                                        ></img>
                                        <h1 className="mt-10 font-bold font-nunito ">
                                            {i18n.t("No Blog Found")} !
                                        </h1>
                                    </div>
                                )}
                            </>
                        )}
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
                </div>
            </div>
        </div>
    );
};

export default Blog;
