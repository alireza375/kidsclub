import React, { useEffect, useState } from "react";
import { notification, Rate } from "antd";
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaTwitter,
} from "react-icons/fa";
import { TfiCommentAlt, TfiLightBulb } from "react-icons/tfi";
import { CiHeart } from "react-icons/ci";
import toast from "react-hot-toast";
import { useI18n } from "../../providers/i18n";
import { useFetch } from "../../helpers/hooks";
import { useSite } from "../../context/site";
import { useUser } from "../../context/user";
import { fetchWishList, postCart, postWishList } from "../../helpers/backend";
import Icon from "../common/Icon";
import { columnFormatter } from "../../helpers/utils";
import {
    FacebookIcon,
    FacebookShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    RedditIcon,
    RedditShareButton,
    TwitterIcon,
    TwitterShareButton,
} from "react-share";

export default function ProductInfo({ product, data, getData }) {
    const i18n = useI18n();
    const { currencySymbol, convertAmount } = useSite();
    const [quantity, setQuantity] = useState(1);
    const [expandedSection, setExpandedSection] = useState(null);
    const [propertyName, setPropertyName] = useState(
        data?.product?.variants?.map((item) => ({
            property_name: item?.property_name,
            property_value: item?.property_values,
            property_id: item?.id,
        })) || []
    );

    const { user } = useUser();
    const { langCode, t } = useI18n();
    const { getWishListdata, cartdata, getcartdata } = useSite();
    const [wish, getWish] = useFetch(fetchWishList);
    const [url, setUrl] = useState("");
    useEffect(() => {
        setUrl(window.location.href);
    }, []);
    const incrementQuantity = () => setQuantity((prev) => prev + 1);
    const decrementQuantity = () =>
        setQuantity((prev) => Math.max(1, prev - 1));

    // Helper Functions
    const updatePropertyName = (propertyName, item, value) => {
        return propertyName
            ?.filter(
                (property) =>
                    property?.property_name[langCode] !==
                    item?.property_name[langCode]
            )
            .concat({
                property_name: item?.property_name,
                property_value: value,
                property_id: item?.id,
            });
    };

    function deepCompare(arr1, arr2, langCode) {
        function compareObjects(obj1, obj2) {
            const obj1Value = obj1[`property_value`][langCode];
            const obj2Value = obj2[`property_value`][langCode];

            if (
                obj1[`property_name`][langCode] ===
                    obj2[`property_name`][langCode] &&
                obj1Value === obj2Value
            ) {
                return true;
            }
            return false;
        }

        // Sort both arrays based on property_name in the specified language
        arr1?.sort((a, b) =>
            a?.property_name[langCode]?.localeCompare(
                b?.property_name[langCode]
            )
        );
        arr2?.sort((a, b) =>
            a?.property_name[langCode]?.localeCompare(
                b?.property_name[langCode]
            )
        );

        // Check if both arrays have the same length
        if (arr1?.length !== arr2?.length) {
            return false;
        }

        // Compare each element in arr1 with the corresponding element in arr2
        for (let i = 0; i < arr1?.length; i++) {
            if (!compareObjects(arr1[i], arr2[i])) {
                return false;
            }
        }

        return true;
    }

    const shortingVariants=(propertyName,variants)=>{
        propertyName.sort((a, b) => {
            const indexA = variants.findIndex(
                variant => variant.property_name[langCode] === a.property_name[langCode]
            );
            const indexB = variants.findIndex(
                variant => variant.property_name[langCode] === b.property_name[langCode]
            );
            return indexA - indexB;
        });
    }

    const handleWishList = async (id) => {
        const { message, success } = await postWishList({ productId: id });
        if (success) {
            toast.success(message);
            await getData({ id });
            await getWish();
            await getWishListdata();
        } else {
            toast.error(message);
        }
    };

    const addToCart = async (productData) => {
        if (!user?.id) {
            notification.error({ message: "Please Login First" });
            return;
        }
        shortingVariants(propertyName,data?.product?.variants);
        const payload = {
            product_id: productData?.id,
            user_id: user?.id,
            variants:propertyName?.length > 0
                                ? propertyName.map(
                                      ({ property_name, property_value }) => ({
                                          property_name,
                                          property_value,
                                      })
                                  )
                                : productData?.variants.map((item) => ({
                                      property_name: item?.property_name,
                                      property_value: item?.property_values[0],
                                  }))
        };

        const { message, success } = await postCart(payload);
        if (success) {
            toast.success(message);
            setQuantity(1);
            await getData();
            await getWish();
            await getWishListdata();
            await getcartdata();
        } else {
            toast.error(message);
        }
    };
    // check if product is already in cart
    useEffect(() => {
        cartdata?.products?.forEach((item) => {
            if (!item?.variants?.length) {
                if (item?.id === data?.product?.id) {
                    setQuantity(item?.quantity);
                }
            }
        });
    }, [cartdata?.products]);
    const renderVariants = () => {
        return data?.product?.variants?.map((variant) => (
            <div key={variant?.id}>
                <p className="description !font-bold capitalize">
                    {columnFormatter(variant?.property_name).length > 12
                        ? columnFormatter(variant?.property_name).slice(0, 12) +
                          "..."
                        : columnFormatter(variant?.property_name)}
                </p>
                <div className="flex gap-2 mt-2 flex-wrap">
                    {variant?.property_values?.map((value, index) => (
                        <button
                            key={index}
                            onClick={() =>
                                setPropertyName((prev) =>
                                    updatePropertyName(prev, variant, value)
                                )
                            }
                            className={`px-[32px] xl:h-14 sm:h-12 h-10 rounded-md border-2 bg-white capitalize ${
                                propertyName?.some(
                                    (item) =>
                                        item?.property_value[langCode] ===
                                        value[langCode]
                                )
                                    ? "border-primary"
                                    : "border-gray-300"
                            }`}
                        >
                            {columnFormatter(value)}
                        </button>
                    ))}
                </div>
            </div>
        ));
    };

    const renderExpandableSection = (key, icon, label, content) => (
        <div className="border-b-[1px] border-black my-5">
            <button
                className="flex justify-between items-center w-full py-2 text-left"
                onClick={() =>
                    setExpandedSection((prev) => (prev === key ? null : key))
                }
            >
                <div className="flex gap-2 items-center">
                    {icon}
                    <span className="description !font-bold">{label}</span>
                </div>
                <span className="w-5 h-5 rounded-full flex justify-center items-center bg-white border-primary border-[1px]">
                    {expandedSection === key ? "−" : "+"}
                </span>
            </button>
            {expandedSection === key && (
                <div
                    className="my-3"
                    dangerouslySetInnerHTML={{ __html: content }}
                ></div>
            )}
        </div>
    );

    return (
        <div className="xl:space-y-10 space-y-6">
            <div className="xl:space-y-4 sm:space-y-3 spacey-2">
                <h1 className="header4 line-clamp-1">
                    {columnFormatter(data?.product?.name)}
                </h1>
                <div className="flex gap-3 items-center my-5">
                    <Rate
                        disabled
                        value={data?.avgRating || 0}
                        style={{ color: "#FE5C45" }}
                    />
                    <p className="description !font-bold">
                        {data?.avgRating || 0}
                    </p>
                    <p className="description">
                        ({data?.reviews?.length || "No"} Reviews)
                    </p>
                </div>
                <div className="flex gap-4">
                    <p className="heading2 text-[#60E188]">
                        {currencySymbol}
                        {parseFloat(
                            convertAmount(data?.product?.discount_price) || 0
                        ).toFixed(2)}
                    </p>
                    {data?.product?.discount_type && (
                        <del>
                            <p className="description !font-bold text-black">
                                {currencySymbol}
                                {parseFloat(
                                    data?.product?.discount_price || 0
                                ).toFixed(2)}
                            </p>
                        </del>
                    )}
                    <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer text-2xl ${
                            wish?.docs?.find((i) => i?.id === data?.product?.id)
                                ? "!bg-primary !text-white"
                                : "bg-white text-primary"
                        }`}
                        onClick={() => handleWishList(data?.product?.id)}
                    >
                        <CiHeart />
                    </div>
                </div>
            </div>

            {data?.product?.variants?.length > 0 ? (
                renderVariants()
            ) : (
                <p>{t("No variants available")}</p>
            )}

            {user?.role !== "coach" && user?.role !== "admin" && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#F7F3F3] grid grid-cols-3 py-2 lg:py-2.5 rounded-md">
                        <button onClick={decrementQuantity} className="text-xl">
                            −
                        </button>
                        <div className="flex items-center justify-center">
                            {quantity}
                        </div>
                        <button onClick={incrementQuantity} className="text-xl">
                            +
                        </button>
                    </div>
                    <button
                        className="shop-button"
                        onClick={() => addToCart(data?.product)}
                    >
                        {i18n?.t("Add to cart")}
                    </button>
                </div>
            )}

            <div className="flex gap-3 mb-10">
                <p className="description !font-bold">{t("Share")}</p>
                <div className="flex gap-2">
                    <FacebookShareButton url={url}>
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <TwitterShareButton url={url}>
                        <TwitterIcon size={32} round />
                    </TwitterShareButton>
                    <RedditShareButton url={url}>
                        <RedditIcon size={32} round />
                    </RedditShareButton>
                    <LinkedinShareButton url={url}>
                        <LinkedinIcon size={32} round />
                    </LinkedinShareButton>
                </div>
            </div>

            {renderExpandableSection(
                "description",
                <TfiLightBulb />,
                "Description",
                columnFormatter(data?.product?.description)
            )}
        </div>
    );
}




// const propertyName=[
//     {
//         "property_name": {
//             "en": "weigh",
//             "bn": "weight bn"
//         },
//         "property_value": {
//             "en": "2kg",
//             "bn": "bn 2kg"
//         }
//     },
//     {
//         "property_name": {
//             "en": "color",
//             "bn": "color bn"
//         },
//         "property_value": {
//             "en": "red",
//             "bn": "red bn"
//         }
//     },

// ]
