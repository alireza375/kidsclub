import React, { useState } from "react";
import { PageHeader } from "../components/common/upperSection";

import { useFetch, useTitle } from "../helpers/hooks";
import { fetchWishList } from "../helpers/backend";
import ProductCard from "../components/home/ShopItem";
import { Pagination } from 'antd';
import { useI18n } from "../providers/i18n";
import { useSite } from "../context/site";

export default function Wish() {
    const i18n = useI18n();
      const [currentPage, setCurrentPage] = useState(1);
      const [pageSize, setPageSize] = useState(8);
    const [wish, getWish, { loading }] = useFetch(fetchWishList);
    const slideVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };
    const onPageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        getWish({ page, limit: pageSize });
    };
 const {sitedata} = useSite();
 useTitle(`${sitedata?.title || "KidStick"} | WishList`);
    return (
        <div className="bg-coralred">
            <PageHeader title="Wish" />
            <div className="custom-container mx-auto section-padding  ">
                <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                {wish?.docs?.map((item, index) => {
                    return (
                        <div
                            variants={slideVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.3 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            key={index}
                        >
                            <ProductCard
                                key={item?.id}
                                item={item}
                                getData={getWish}
                            />
                        </div>
                    );
                })}

              </div>
              {wish?.docs && wish?.docs?.length === 0 && (
                <div className="flex justify-center items-center">
                    <h1 className="text-2xl font-bold font-nunito text-secondary my-10">
                      {i18n.t("No Product Found")}
                    </h1>
                </div>
              )}
                <Pagination
                    align="center"
                    className="!mt-[50px]"
                    current={currentPage}
                    pageSize={pageSize}
                    total={wish?.totalDocs}
                    onChange={onPageChange}
                />

            </div>
        </div>
    );
}
