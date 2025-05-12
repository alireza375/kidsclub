import React, { useState } from "react";
import HeaderTitle from "../common/HeaderTitle";
import ShopBg from "./../../../images/shopBg.png";
import ShopItem from "./ShopItem";
import BackgroundImage from "../common/BackgroundImage";
import { AiOutlineSearch } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import { useFetch } from "../../helpers/hooks";
import { publicProductList } from "../../helpers/backend";
import { Pagination, Skeleton } from "antd";
import { useI18n } from "../../providers/i18n";
import Button from "../common/Button";
import { columnFormatter } from "../../helpers/utils";
import { motion } from "framer-motion"; // Import motion from framer-motion

export default function ShopSection({ path = "", shopdata }) {
    const { pathname } = useLocation();
    const [product, getProduct, { loading }] = useFetch(publicProductList, {});
    const onPageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        getProduct({ page, limit: pageSize });
    };

    const slideVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    };

    const data = path === "/shop" ? product?.docs : product?.docs?.slice(0, 8);
    const HeaderStyles = {
        titleS: "bg-[#ffe3ac]",
    };
    const i18n = useI18n();
    let { langCode } = useI18n();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={slideVariants}
            className={`${path === "shop" && "bg-[#FCF7EE]"} relative z-30 md:mb-[120px] mb-20`}
        >
            {path !== "shop" && (
                <BackgroundImage src={ShopBg} alt={"kidStick Background"} />
            )}
            <div className="custom-container mx-auto section-padding">
                <HeaderTitle
                    header={columnFormatter(shopdata?.title)}
                    title={columnFormatter(shopdata?.heading)}
                    center={true}
                    description={columnFormatter(shopdata?.description)}
                    styles={HeaderStyles}
                />
                {path === "shop" && (
                    <div className="flex items-center border border-[#FE5C45] rounded-md bg-[#FDF5F5] px-4 py-2 lg:mt-14 mt-5">
                        <AiOutlineSearch size={20} color="#FE5C45" />
                        <input
                            type="text"
                            placeholder="Search your product"
                            className="ml-2 bg-transparent outline-none w-full text-gray-600 placeholder-gray-400"
                            onChange={(e) => {
                                getProduct({ search: e.target.value, langCode: langCode });
                            }}
                        />
                    </div>
                )}
                {product?.docs?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-6 gap-2 mt-14">
                        {data && data?.length>0 ? (
                            data?.map((product, index) => (
                                <motion.div
                                    key={index}
                                    variants={slideVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: false, amount: 0.3 }}
                                    transition={{
                                        duration: 0.5,
                                        ease: "easeOut",
                                    }}
                                >
                                    <ShopItem
                                        key={product?.id}
                                        item={product}
                                        getData={getProduct}
                                    />
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full text-center">
                                {i18n?.t("No products found")}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-6 gap-2 mt-14">
                        {loading
                            ? [1, 2, 3, 4, 5, 6].map((item, index) => (
                                  <Skeleton
                                      key={index}
                                      className="col-span-full"
                                      active
                                  />
                              ))
                            : (
                                <div className="col-span-full text-center">
                                    {i18n?.t("No products found")}
                                </div>
                            )}
                    </div>
                )}

                {pathname === "/shop" ? (
                    <Pagination
                                align="center"
                                className="!mt-[100px] body-paginate"
                                current={currentPage}
                                pageSize={pageSize}
                                total={data?.totalDocs}
                                onChange={onPageChange}
                            />
                ) : (
                    <div className="flex justify-center items-center pt-[30px] pb-[60px]">
                        <Link to="/shop">
                            <Button title={i18n.t("All Product")} />
                        </Link>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
