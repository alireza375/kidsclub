import React, { useEffect } from "react";
import MoreProduct from "../components/common/MoreProduct";
import ImageGallery from "../components/products/ProductGallery";
import { productData } from "../data/shop-data";
import ProductInfo from "../components/products/ProductInfo";
import { PageHeader } from "../components/common/upperSection";
import ProductReview from "../components/products/productReview";
import { useFetch, useTitle } from "../helpers/hooks";
import { getProductDetails } from "../helpers/backend";
import { useParams } from "react-router-dom";
import { Skeleton } from "antd";
import { useSite } from "../context/site";

export default function ProductDetails() {
    const [data, getData, { loading }] = useFetch(getProductDetails, {});
    const { i18n } = useSite();
    const { id } = useParams();
    const {sitedata} = useSite();
    useTitle(`${sitedata?.title || "KidStick"} | Product Details`);
    useEffect(() => {
        if (id) {
            getData({ id: id });
        }
    }, [data?.product?.id]);

    return (
        <div className="bg-[#FCF7EE]">
            <PageHeader title="Product" />
            <div className="custom-container py-20">
                {data ? (
                    <div>
                        <div className="md:mb-10 mb-5">
                            <div className="grid xl:gap-10 gap-5 md:grid-cols-2 mb-10 md:mb-10">
                                <ImageGallery data={data} i18n={i18n} />
                                <ProductInfo data={data} getData={getData} i18n={i18n}/>
                            </div>
                            <ProductReview  data={data} i18n={i18n}/>
                        </div>
                        {data?.relatedProducts && (
                            <MoreProduct
                                data={data?.relatedProducts}
                                getData={getData}
                                i18n={i18n}
                            />
                        )}
                    </div>
                ) : (
                    <Skeleton active />
                )}
            </div>
        </div>
    );
}
