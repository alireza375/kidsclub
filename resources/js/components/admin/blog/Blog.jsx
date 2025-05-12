import React, { useState } from 'react'
import BlogCategory from './BlogCategory'
import AllBlog from './AllBlog'
import { useSite } from "../../../context/site";
import { useTitle } from '../../../helpers/hooks';
import { useI18n } from '../../../providers/i18n';

const Blog = () => {
    const [open, setOpen] = useState("blog");
    const {sitedata} = useSite();
    const i18n = useI18n();
    useTitle(sitedata?.title + " | " + i18n.t("Blog") + " - " + i18n.t("Admin"));
    return (
        <div className='p-4 bg-gray-100 min-h-full rounded-md'>
           <div className="flex justify-center items-center gap-12 mb-8 border p-2">
                <div
                    onClick={() => setOpen("category")}
                    className={`w-full border-2 border-transparent py-2 border-teal-blue cursor-pointer hover:text-white hover:bg-teal-blue text-xl font-nunito duration-300 ease-in-out text-center
                        ${
                            open === "category"
                                ? "bg-teal-blue text-white border-teal-blue"
                                : "text-gray-700 border-gray-300"
                        }
                        transition-all`}
                >
                    <h1>{i18n.t("Category")}</h1>
                </div>
                <div
                    onClick={() => setOpen("blog")}
                    className={`w-full border-2 border-transparent py-2 border-teal-blue cursor-pointer hover:text-white hover:bg-teal-blue text-xl font-nunito duration-300 ease-in-out text-center
                        ${
                            open === "blog"
                                ? "bg-teal-blue text-white border-teal-blue"
                                : "text-gray-700 border-gray-300"
                        }
                        transition-all`}
                >
                    <h1>{i18n.t("All Blogs")}</h1>
                </div>
            </div>
            <div className='py-4'>
                {open === "category" && <BlogCategory />}
                {open === "blog" && <AllBlog />}
            </div>
        </div>
    );
}

export default Blog;
