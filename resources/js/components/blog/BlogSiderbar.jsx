import React, { useState } from "react";
import { Input } from "antd";
import { FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

import { useI18n } from "../../providers/i18n";
import { columnFormatter } from "../../helpers/utils";
import { publicAdvertisement } from "../../helpers/backend";
import { useFetch } from "../../helpers/hooks";

// Extracted Category List Component
const CategoryList = ({ 
    categories, 
    selectedCategory, 
    setSelectedCategory, 
    setIsList 
}) => {
    const i18n = useI18n();
    const handleCategorySelect = (categoryId) => {
        setIsList(true);
        setSelectedCategory(categoryId);
    };

    return (
        <div className="mb-6 text-secondary font-nunito">
            <h3 className="md:text-[22px] text-lg !font-bold mb-6">
                {i18n?.t("Categories")}
            </h3>
            
            {selectedCategory && (
                <div className="flex justify-between header-description font-medium items-center border-b-2 border-dashed border-secondary pb-3">
                    <span 
                        className="cursor-pointer hover:text-primary " 
                        onClick={() => {
                            setIsList(true);
                            setSelectedCategory("");
                        }}
                    >
                        {i18n.t("All")}
                    </span>
                </div>
            )}
            
            <div className="space-y-4 mb-6 mt-2">
                {categories?.docs?.map((category) => (
                    <div
                        key={category?.id}
                        className="flex justify-between header-description font-medium items-center border-b-2 border-dashed border-secondary pb-3"
                    >
                        <span 
                            className={`
                                cursor-pointer hover:text-primary 
                                ${category?.id === selectedCategory ? 'text-primary' : ''}
                            `}
                            onClick={() => handleCategorySelect(category?.id)}
                        >
                            {columnFormatter(category?.name)}
                        </span>
                        <span>{category?.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Extracted Recent Blog Component
const RecentBlogs = ({ recentBlogs, setIsList }) => {
    const i18n = useI18n();
    return (
        <div className="mb-6 font-nunito text-secondary">
            <h3 className="md:text-[22px] text-lg !font-bold mb-6">
                {i18n.t("Recent Blogs")}
            </h3>
            <div className="space-y-4 h-[346px] no-scrollbar overflow-y-scroll">
                {recentBlogs?.docs?.map((blog) => (
                    <div key={blog?.id} className="flex gap-3">
                        <img
                            src={blog?.image}
                            alt="Blog Thumbnail"
                            className="w-[100px] h-[100px] rounded-lg object-cover"
                        />
                        <div className="flex flex-col space-y-3">
                            <span className="text-sm text-gray-500">
                                {dayjs(blog?.created_at).format("MMM DD, YYYY")}
                            </span>
                            <Link
                                onClick={() => setIsList(false)}
                                to={`/blog/${blog?.id}`}
                                className="md:text-lg text-sm font-bold line-clamp-2"
                            >
                                {columnFormatter(blog?.title)}
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Sidebar Content Component
const SidebarContent = ({ 
    category, 
    recentBlog, 
    children, 
    setSelectedCategory, 
    selectedCategory, 
    setIsList 
}) => {
    const [advertisement, getAdvertisement] = useFetch(publicAdvertisement);
    return (
        <>
            {children}
            <CategoryList 
                categories={category}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                setIsList={setIsList}
            />
            <RecentBlogs recentBlogs={recentBlog} setIsList={setIsList} />
            
           {advertisement && <div className="w-[312px] border-2 border-dashed sm:h-[404px] h-[380px] lg:h-[504px] border-[#FF6B6D] rounded-2xl object-fill">
                <img
                    src={advertisement?.image}
                    alt="Black Friday Sale"
                    className="w-full object-fill h-full rounded-2xl"
                />
            </div>
            }
        </>
    );
};

// Main Sidebar Component
export default function BlogSidebar({ 
    category, 
    recentBlog, 
    children,
    setSelectedCategory, 
    selectedCategory,
    getData,
    isList,
    setIsList 
}) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { langCode } = useI18n();

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const i18n = useI18n();

    const handleSearch = (e) => {
        setIsList(true);
        getData({
            search: e.target.value,
            langCode: langCode,
        });
    };

    return (
        <div className="flex justify-center h-fit w-fit mx-auto">
            {/* Mobile Sidebar */}
            <div className="lg:hidden px-8 py-[40px] border-2 border-dashed bg-[#FBF1E3] border-text rounded-[20px] lg:w-[424px]">
                <div className="flex justify-between items-center mb-6">
                    <Input
                        placeholder={i18n?.t("Enter Keyword")}
                        className="py-4 border-2 border-dashed border-primary"
                        suffix={<FaSearch className="h-4 w-4 text-gray-400" />}
                        onChange={handleSearch}
                    />
                    <button onClick={toggleDropdown} className="ml-4">
                        {isDropdownOpen ? (
                            <FaChevronUp className="h-6 w-6 text-gray-400" />
                        ) : (
                            <FaChevronDown className="h-6 w-6 text-gray-400" />
                        )}
                    </button>
                </div>
                {isDropdownOpen && (
                    <SidebarContent 
                        category={category} 
                        recentBlog={recentBlog} 
                        children={children} 
                        setSelectedCategory={setSelectedCategory} 
                        selectedCategory={selectedCategory} 
                        setIsList={setIsList}
                    />
                )}
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block px-10 py-[60px] border-2 border-dashed bg-[#FBF1E3] border-text rounded-[20px] lg:max-w-[524px]">
                <SidebarContent 
                    category={category} 
                    recentBlog={recentBlog} 
                    children={children} 
                    setSelectedCategory={setSelectedCategory} 
                    selectedCategory={selectedCategory} 
                    setIsList={setIsList}
                />
            </div>
        </div>
    );
}