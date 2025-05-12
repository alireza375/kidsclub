import React, { useEffect, useState } from "react";
import { PageHeader } from "../components/common/upperSection";
import Swimmer from "./../../images/swimmer.png";
import { useSite } from "../context/site";
import { columnFormatter } from "../helpers/utils";
import { delCart, postCart } from "../helpers/backend";
import { Empty, notification } from "antd";
import { useActionConfirm, useTitle } from "../helpers/hooks";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/user";
import { useI18n } from "../providers/i18n";

export default function Cart() {
    const {
        cartdata,
        getcartdata,
        CountCartQuantity,
        currencySymbol,
        setCountCartQuantity,
        convertAmount,
        sitedata
    } = useSite();
    const i18n = useI18n();
    const { user } = useUser();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    useTitle(`${sitedata?.title || "KidStick"} | Cart`)

    const addToCart = async (quantity, data) => {
        const payload = {
            product_id: data?.id,
            variants: data?.variants,
            quantity: quantity,
        };
        if (!user) {
            notification.error({ message: "Please Login First" });
            navigate("/");
            return;
        } else {
            if (user && user?.role === "user") {
                const res = await postCart(payload);
                if (res.success) {
                    // Sync with the backend data
                    await getcartdata();
                    notification.success({ message: res?.message });
                } else {
                    await getcartdata();

                    notification.error({ message: res?.msg });
                }
            } else {
                notification.error({ message: "Available for users" });
                navigate("/");
                return;
            }
        }
    };

    const total = cartdata?.products?.reduce(
        (sum, item) => sum + parseFloat(item?.price),
        0
    );
    const totalQuantity = cartdata?.products?.reduce(
        (sum, item) => sum + item?.quantity,
        0
    );
    return (
        <div className="bg-coralred">
            <PageHeader title="Cart" />
            <div className="custom-container mx-auto section-padding">
                {!cartdata?.products || cartdata?.products.length === 0 ? (
                    <div className="flex justify-center items-center h-[60vh] font-montserrat">
                        <Empty
                            description={
                                <div>
                                    <p className="text-1 font-bold text-[28px]">
                                        {i18n?.t("Your cart is empty")}
                                    </p>
                                    <button
                                        onClick={() => {
                                            window.location.href = "/shop";
                                        }}
                                        className="pt-6 text-2xl font-light text-[#534C4C] underline"
                                    >
                                        {i18n?.t("Continue Shopping")}
                                    </button>
                                </div>
                            }
                        />
                    </div>
                ) : (
                    <div>
                        <div className="p-4 flex flex-col lg:flex-row gap-4 w-full">
                            <div className="sm:flex-grow">
                                {/* Section Wrapper with overflow-auto */}

                                <div className="bg-[#456f82] text-white grid sm:grid-cols-[2fr,1fr,1fr] grid-cols-[1fr,1fr,1fr] p-4 rounded-t-lg">
                                    <div className="description !font-bold">
                                        {i18n?.t("Product")}
                                    </div>
                                    <div className="description !font-bold">
                                        {i18n?.t("Details")}
                                    </div>
                                    <div className="text-right description !font-bold">
                                        {i18n?.t("Total")}
                                    </div>
                                </div>

                                <div className="bg-[#FBF1E3]">
                                    {cartdata?.products?.map((item, idx) => (
                                        <div
                                            key={item?.id}
                                            className={`grid sm:p-4 p-2 grid-cols-4 ${
                                                cartdata?.products?.length -
                                                    1 !==
                                                    idx &&
                                                "border-dashed border-primary border-b-[2px]"
                                            } items-center`}
                                        >
                                            <div className="flex justify-between items-center col-span-3 px-2 py-3 rounded-xl bg-white">
                                                <div className="sm:flex items-center lg:gap-4 gap-3">
                                                    <img
                                                        src={
                                                            item.thumbnail_image
                                                        }
                                                        alt="product"
                                                        className="rounded-lg sm:w-[100px] w-[50px] sm:h-[50px] h-[20px]"
                                                    />
                                                    <div>
                                                        <Link
                                                            to={`/shop/${item?.id}`}
                                                            className="!font-bold description hover:text-primary"
                                                        >
                                                            {columnFormatter(
                                                                item?.name
                                                            ).length > 12
                                                                ? columnFormatter(
                                                                      item?.name
                                                                  ).slice(
                                                                      0,
                                                                      12
                                                                  ) + "..."
                                                                : columnFormatter(
                                                                      item?.name
                                                                  )}
                                                        </Link>
                                                        {item?.variants?.map(
                                                            (i, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="flex gap-2 items-center"
                                                                >
                                                                    <p className="small text-gray-600">
                                                                        {columnFormatter(
                                                                            i.property_name
                                                                        )}
                                                                      {i?.property_value && ":"}
                                                                    </p>
                                                                    <p className="small text-gray-600">
                                                                        {columnFormatter(
                                                                            i?.property_value
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex sm:flex-row flex-col w-auto sm:h-[28px]  h-auto items-center bg-white border border-primary rounded">
                                                    <button
                                                        onClick={() => {
                                                            addToCart(
                                                                item?.quantity -
                                                                    1,
                                                                item
                                                            );
                                                        }}
                                                        className="flex items-center justify-center rounded w-auto p-2"
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="text"
                                                        value={item?.quantity}
                                                        readOnly
                                                        className="w-8 text-center mx-1 border-none border-gray-300 rounded outline-none"
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            addToCart(
                                                                item?.quantity +
                                                                    1,
                                                                item
                                                            );
                                                        }}
                                                        className="flex items-center justify-center rounded w-auto p-2"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={async () => {
                                                        await useActionConfirm(
                                                            delCart,
                                                            {
                                                                product_id:
                                                                item?.id,
                                                                variants: item?.variants
                                                            },
                                                            getcartdata,
                                                            "Are you sure you want to delete this item?",
                                                            "Yes, Delete"
                                                        );
                                                        setCountCartQuantity(
                                                            cartdata?.products
                                                                ?.length
                                                        );
                                                    }}
                                                    className="ml-2 text-red-500 text-xl"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                            <div className="text-right text-green-500 !font-bold description">
                                                {currencySymbol}
                                                {convertAmount(item?.total)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="w-full lg:w-[350px]">
                                <div className="bg-[#456f82] text-white p-4 rounded-t-lg">
                                    <h2 className="description !font-bold">
                                        {i18n.t("Cart Total")}
                                    </h2>
                                </div>
                                <div className="bg-[#FBF1E3] ">
                                    <div className="p-2">
                                        <div className="space-y-2 mb-4 p-2 bg-white rounded-lg">
                                            {cartdata?.products?.map(
                                                (item, idx) => (
                                                    <div
                                                        key={item.id}
                                                        className={`flex justify-between ${
                                                            cartdata?.products
                                                                ?.length -
                                                                1 !==
                                                                idx &&
                                                            " border-gray-500 border-b-[1px]"
                                                        }`}
                                                    >
                                                        <span className="small !font-bold">
                                                            {columnFormatter(
                                                                item.name
                                                            ).length > 12
                                                                ? columnFormatter(
                                                                      item.name
                                                                  ).slice(
                                                                      0,
                                                                      12
                                                                  ) + "..."
                                                                : columnFormatter(
                                                                      item.name
                                                                  )}
                                                        </span>
                                                        <span className="small !font-bold text-green-500">
                                                            {currencySymbol}
                                                            {convertAmount(
                                                                item.total
                                                            )}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    <div className="border-t-[2px] border-primary border-dashed  p-2">
                                        <div className="flex justify-between description !font-bold p-2 bg-white rounded-lg">
                                            <span>{i18n.t("Total")} :</span>
                                            <span className="text-green-500">
                                                {currencySymbol}
                                                {convertAmount(cartdata?.total)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Link
                            to={`/checkout`}
                        >
                            <div className="flex justify-end">
                                <button className="cart-button">
                                    {i18n.t("Process To Checkout")}
                                </button>
                            </div>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
