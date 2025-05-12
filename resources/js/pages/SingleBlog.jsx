import React, { useEffect, useState } from 'react'
import { PageHeader } from '../components/common/upperSection'
import BlogSiderbar from '../components/blog/BlogSiderbar'
import SingleBlogSection from '../components/blog/SingleBlogSection'
import { useFetch, useTitle } from '../helpers/hooks';
import { useI18n } from '../providers/i18n';
import { fetchBlogCategories, fetchPublicBlogs } from '../helpers/backend';
import { Input, Pagination } from 'antd';
import { FaSearch } from 'react-icons/fa';
import BlogSkeleton from '../components/common/skeleton/BlogSkeleton';
import BlogCard from '../components/blog/blogCard';
import Skeleton from 'react-loading-skeleton';
import BlogNotFoundImage from "../../images/blogNotFound.png"
import { useSite } from '../context/site';
export default function SingleBlog() {
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

    useEffect(() => {
        getData({
            category: selectedCategory,
            page: currentPage,
            limit: pageSize,
        });
    //    navigate("/blog")
    }, [selectedCategory, currentPage, pageSize]);
     const {sitedata} = useSite();
     useTitle(`${sitedata?.title || "KidStick"} | Blog`);
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
                            className="mb-10 py-4 border-2 border-dashed border-secondary md:flex hidden"
                            suffix={
                                <FaSearch className="h-4 w-4 text-gray-400" />
                            }
                            // value={search}
                            onChange={(e) => {
                                setIsList(true);
                                getData({
                                    search: e.target.value,
                                    langCode: langCode,
                                });
                                // setSearch(e.target.value);
                            }}
                        />
                    </BlogSiderbar>

                    <div className="lg:w-3/4 w-full">
                   {!isList && (<>
                        <div className="mb-10">

                        </div>
                        {loading ? (
                            <div className="gap-6">
                            <Skeleton width={"full"} height={300} />
                            <Skeleton width={"full"} height={10} />
                            <Skeleton width={"full"} height={300} />

                            <Skeleton width={"full"} height={300} />
                            </div>
                        ) : (
                            <>
                                <div className="">
                                    <SingleBlogSection data={data} />
                                </div>
                                {data?.docs?.length <= 0 && (
                                    <div className="text-center text-xl font-bold text-secondary flex flex-col justify-center items-center">
                                        <img
                                            src={BlogNotFoundImage}
                                            alt="BlogNotFoundImage"
                                        ></img>
                                        <h1 className="mt-10 font-bold font-nunito ">
                                            {i18n?.t("No Blog Found !")}
                                        </h1>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                   )}
                   {isList && ( <>
                    <div className="mb-10">
                            <h1 className="text-secondary text-2xl border-b-2 border-dashed border-secondary pb-2">
                                {i18n.t("All Blogs")}
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
                                        <BlogCard key={item?.id} data={item} />
                                    ))}
                                </div>
                                {data?.docs?.length <= 0 && (
                                    <div className="text-center text-xl font-bold text-secondary flex flex-col justify-center items-center">
                                        <img
                                            src={BlogNotFoundImage}
                                            alt="BlogNotFoundImage"
                                        ></img>
                                        <h1 className="mt-10 font-bold font-nunito ">
                                            No Blog Found !
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
                    </>)}

                    </div>
                </div>
            </div>
        </div>
    );
};
