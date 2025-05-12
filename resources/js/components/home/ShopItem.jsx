import React, { use, useState } from "react";
import { motion } from "framer-motion";
import { message, notification, Rate } from "antd";
import {
    AiOutlineHeart,
    AiOutlineEye,
    AiOutlineShoppingCart,
} from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { columnFormatter } from "../../helpers/utils";
import { fetchWishList, postCart, postWishList } from "../../helpers/backend";
import toast, { Toaster } from "react-hot-toast";
import { useFetch } from "../../helpers/hooks";
import { useSite } from "../../context/site";
import { useUser } from "../../context/user";
import { useI18n } from "../../providers/i18n";
import { StylesBorder } from "../../styles/styles";

const ProductCard = ({ item, getData }) => {
    const [isHovered, setIsHovered] = useState(false);
    const i18n = useI18n();
    const [qtn, setQtn] = useState(1);
    const { langCode } = useI18n();
    const [wish, getWish] = useFetch(fetchWishList);
    const {
        getWishListdata,
        cartdata,
        getcartdata,
        convertAmount,
        currencySymbol,
    } = useSite();
    const { user } = useUser();
    const navigate = useNavigate();

    const increment = () => setQtn(qtn + 1);
    const decrement = () => qtn > 1 && setQtn(qtn - 1);

    const handleWishList = async (id) => {
        if (!user?.id) {
            message.error("Please Login First");
            return;
        }
        if (user?.role === "coach" || user?.role === "admin") {
            notification.error({ message: "Available for users only" });
            return;
        }
        const { message: msg, success } = await postWishList({ productId: id });
        if (success) {
            toast.success(msg);
            await Promise.all([getData(), getWish(), getWishListdata()]);
        } else {
            toast.error(msg);
        }
    };

    const checkVariantExistence = (firstObjVariants, secondObj) => {
        if (!firstObjVariants || !secondObj || !secondObj.variants)
            return false;

        const variantMap = new Map(
            firstObjVariants.map((variant) => [
                variant?.property_name[langCode],
                variant?.property_value[langCode],
            ])
        );

        return secondObj.variants.every(
            (variant) =>
                variantMap.get(variant.property_name[langCode]) ===
                variant.property_value[langCode]
        );
    };

    const addToCart = async (data) => {
        if (!user?.id) {
            notification.error({ message: "Please Login First" });
            return;
        }

        if (user?.role !== "user") {
            notification.error({ message: "Available for users only" });
            return;
        }

        const payload = {
            product_id: data?.id,
            user_id: user?.id,
            variants: data?.variants?.map((item) => ({
                property_name: item?.property_name,
                property_value: item?.property_values[0],
            })),
            quantity: qtn,
        };

        const existingProduct = cartdata?.products?.find(
            (prod) => prod?.id === data?.id
        );

        if (existingProduct) {
            const hasMatchingVariants =
                existingProduct.variants?.length > 0 && existingProduct?.variants[0].length > 0 &&
                checkVariantExistence(payload.variants, existingProduct);

            if (hasMatchingVariants || existingProduct.variants?.length === 0) {
                payload.quantity = existingProduct.quantity + qtn;
            }
        }

        const { message, success } = await postCart(payload);
        if (success) {
            await Promise.all([
                getcartdata(),
            ]);
            setQtn(1);
            notification.success({ message: message });
        } else {
            getcartdata();
            notification.error({ message: message });
        }
    };

    return (
        <motion.div
            className=" rounded-xl bg-white "
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            style={StylesBorder("FE5C45", 12, 3)}
        >
            <div className="p-6">
                {/* Image Section */}
                <div className="relative h-[213px]">
                    <img
                        src={item?.thumbnail_image}
                        className="object-center w-full rounded-lg h-full"
                        alt="Product"
                    />
                    {item?.discount_type && (
                        <div className="px-3 py-0.5 w-max rounded-md bg-[#FCB736] absolute top-2 left-2 text-white">
                            <span className="lg:text-[16px] sm:text-[14px] text-[12px] font-bold">
                               {item?.discount_type === "percentage" ? `${item?.discount}% OFF` : `${currencySymbol}${convertAmount(item?.discount)} OFF`}
                            </span>
                        </div>
                    )}

                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute inset-0 bg-transparent flex justify-end items-start p-4 gap-2"
                        >
                            <div className="flex flex-col gap-2">
                                <button
                                    className={`bg-white p-2 rounded-full shadow-md text-[#FE5C45] ${
                                        wish?.docs?.find(
                                            (i) => i?.id === item?.id
                                        )
                                            ? "!bg-[#FE5C45] !text-white"
                                            : ""
                                    }`}
                                    onClick={() => handleWishList(item?.id)}
                                >
                                    <AiOutlineHeart size={24} />
                                </button>
                                <button
                                    className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 cursor-pointer"
                                    onClick={() =>
                                        (window.location.href = `/shop/${item?.id}`)
                                    }
                                >
                                    <AiOutlineEye size={24} color="#FE5C45" />
                                </button>
                                <button
                                    className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 cursor-pointer"
                                    onClick={() => addToCart(item)}
                                >
                                    <AiOutlineShoppingCart
                                        size={24}
                                        color="#FE5C45"
                                    />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Product Details */}
                <div className="mt-4 space-y-4">
                    <div className="flex gap-3 items-center">
                        <Rate
                            disabled
                            defaultValue={item?.avgRating || 0}
                            style={{ color: "#FE5C45" }}
                        />
                        <p className="description ">
                            {item?.reviews && item?.reviews?.length || "No"}
                        </p>
                        <p className="description">{i18n?.t("Reviews")}</p>
                    </div>

                    <div className="space-y-4">
                        <Link to={`/shop/${item.id}`}>
                            <h2 className="text-xl font-semibold font-nunito hover:text-green-600 line-clamp-2">
                                {columnFormatter(item?.name) }
                            </h2>
                        </Link>
                        <div className="space-x-2">
                            <span className="heading2">
                                {currencySymbol}
                                {convertAmount(item?.discount_price)}
                            </span>
                            {item?.discount_type && <span className="description">
                                <del>
                                    {currencySymbol}
                                    {convertAmount(item?.price) || "0.00"}
                                </del>
                            </span>
                            }
                        </div>
                    </div>
                    {user?.role != "admin" && user?.role != "coach" && (
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-[#F7F3F3] grid grid-cols-3 py-2 lg:py-2.5 rounded-md">
                                <button onClick={decrement} className="text-lg">
                                    -
                                </button>
                                <div className="flex items-center justify-center">
                                    <p className="bg-[#F7F3F3] text-center focus:outline-none">
                                        {qtn}
                                    </p>
                                </div>
                                <button onClick={increment} className="text-lg">
                                    +
                                </button>
                            </div>

                                <button
                                    onClick={() => addToCart(item)}
                                    className="shop-button"
                                >
                                    {i18n?.t("Buy Now")}
                                </button>
                        </div>
                    )}
                </div>
                <Toaster position="top-center" reverseOrder={false} />
            </div>
        </motion.div>
    );
};

export default ProductCard;
