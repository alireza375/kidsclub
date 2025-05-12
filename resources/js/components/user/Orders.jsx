import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import React, { useEffect, useState } from "react";
import { useI18n } from "../../providers/i18n";
import { useAction, useFetch, useTitle } from "../../helpers/hooks";
import { fetchUserOrderList, postProductReview } from "../../helpers/backend";
import { Link } from "react-router-dom";
import { columnFormatter } from "../../helpers/utils";
import { Form, Input, message, Modal, Rate } from "antd";
import order1 from "../../../images/order.jpg";
import { useSite } from "../../context/site";
import Pagination from "../common/pagination";
const Orders = () => {
    const [order, getOrder] = useFetch(fetchUserOrderList,{limit:1});
    const [activeTab, setActiveTab] = useState("active");
    const i18n = useI18n();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null); // State for selected product
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const {sitedata} = useSite();
    useTitle(sitedata?.title + " | " + i18n.t("Orders") + " - " + i18n.t("User"));
    // Toggles modal visibility and sets the selected product
    const openModal = (product) => {
        setSelectedProduct(product);
        // Pre-fill rating and comment if review exists
        setRating(product?.review?.rating || 0);
        setComment(product?.review?.comment || "");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
        setRating(0);
        setComment("");
    };

    const onPageChange = (page) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        getOrder({ page, limit: pageSize });
    };

    useEffect(() => {
        getOrder({
            page: currentPage,
            limit: pageSize,
        });
    }, [currentPage, pageSize]);

    // Handles rating submission
    const handleRatingSubmit = () => {
        if (comment === "") {
            message.error("Please enter a comment");
            return;
        }
        const data = {
            product_id: selectedProduct?.id,
            rating,
            comment,
        };
        useAction(postProductReview, data);
        closeModal();
    };



    return (
        <div className="w-full h-full p-5">
         <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
                <h1 className="text-xl font-semibold text-gray-800">
                    {i18n?.t("Orders")}
                </h1>
            </div>
                    <div className="w-full overflow-y-auto no-scrollbar">
                        <div className="px-4 py-8 mx-auto">
                            { order?.docs?.length > 0 ? (
                                order?.docs?.map((orderItem) => (
                                    <div
                                        key={orderItem?.id}
                                        className="flex flex-col items-start justify-between w-full gap-6 p-6 mb-6 transition-shadow bg-white rounded-lg shadow-md hover:shadow-xl md:flex-row md:items-center"
                                    >
                                        {/* Product Image and Details */}
                                        <div className="flex flex-col w-full md:w-2/3 gap-y-6">
                                            {orderItem?.items?.map(
                                                (product, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex flex-wrap items-start gap-4 pb-4 space-y-4 border-b last:border-none md:items-center"
                                                    >
                                                        <img
                                                            src={
                                                                product?.thumbnail_image
                                                            }
                                                            alt={`Product ${
                                                                idx + 1
                                                            }`}
                                                            className="object-cover w-16 h-16 rounded-lg shadow-sm md:w-20 md:h-20"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <Link
                                                                to={`/shop/${product?.id}`}
                                                                className="text-sm font-medium break-words transition-all text-secondary hover:text-primary md:text-base"
                                                            >
                                                                {columnFormatter(
                                                                    product?.name
                                                                )}
                                                            </Link>
                                                            {product?.variant && product?.variant?.length > 0 && (
                                                                <p className="my-2 text-sm font-bold text-gray-800">
                                                                    <span className="">
                                                                        {columnFormatter(
                                                                            product
                                                                                ?.variant[0]
                                                                                ?.property_name
                                                                        )}
                                                                    </span>{" "}
                                                                    {product?.variant[0]?.length > 0 && ":"}
                                                                    <span className="text-gray-500">
                                                                        {columnFormatter(
                                                                            product
                                                                                ?.variant[0]
                                                                                ?.property_value
                                                                        )}
                                                                    </span>
                                                                </p>
                                                            )}
                                                            <p className="text-xs text-gray-500 md:text-sm">
                                                                {i18n?.t("Qty")}
                                                                :{" "}
                                                                {
                                                                    product?.quantity
                                                                }
                                                            </p>
                                                        </div>
                                                        {product?.reviews &&
                                                        orderItem?.status ===
                                                            "completed" ? (
                                                            <div className="flex flex-col items-start w-full gap-2 text-sm text-gray-700 sm:flex-row sm:items-center">
                                                                <Rate
                                                                className="text-sm md:text-base shrink-0"
                                                                    disabled
                                                                    defaultValue={
                                                                        product
                                                                            ?.reviews
                                                                            ?.rating
                                                                    }
                                                                />
                                                                <p className="text-xs md:text-sm">
                                                                    {product?.reviews?.comment}
                                                                </p>
                                                            </div>
                                                        ) : orderItem?.status ===
                                                          "completed" ? (
                                                            <button
                                                                key={
                                                                    product?.id
                                                                }
                                                                onClick={() =>
                                                                    openModal(
                                                                        product
                                                                    )
                                                                }
                                                                className="px-4 py-1 mt-2 text-xs transition-colors border rounded-lg border-primary text-primary hover:bg-primary hover:text-white md:text-sm sm:mt-0"
                                                            >
                                                                {i18n?.t(
                                                                    "Add Review"
                                                                )}
                                                            </button>
                                                        ) : null}
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        {/* Order Summary */}
                                        <div className="w-full p-4 text-center rounded-lg shadow-inner md:w-1/3 bg-gray-50">
                                            <h3 className="mb-1 text-sm font-semibold text-secondary">
                                                {i18n?.t("Price")}:{" "}
                                                {orderItem?.currencySymbol}{" "}
                                                {parseFloat(
                                                    orderItem?.subTotal
                                                ) +
                                                    parseFloat(
                                                        orderItem?.discount
                                                    )}
                                            </h3>
                                            <h3 className="mb-1 text-sm font-semibold text-secondary">
                                                {i18n?.t("Discount")}:{" "}
                                                {orderItem?.currencySymbol}{" "}
                                                {orderItem?.discount}
                                            </h3>
                                            <h3 className="mb-2 text-sm font-semibold text-secondary">
                                                {i18n?.t("Subtotal")}:{" "}
                                                {orderItem?.currencySymbol}{" "}
                                                {orderItem?.subTotal}
                                            </h3>
                                            <p
                                                className={`text-sm rounded-lg px-4 py-2 font-medium ${
                                                    orderItem?.status ===
                                                    "accepted"
                                                        ? "bg-green-100 text-green-600"
                                                        : orderItem?.status ===
                                                          "Pending"
                                                        ? "bg-yellow-100 text-yellow-600"
                                                        : orderItem?.status ===
                                                          "Canceled"
                                                        ? "bg-red-100 text-red-600"
                                                        : "bg-blue-100 text-blue-600"
                                                }`}
                                            >
                                                {orderItem?.status}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                // <p className="text-lg text-center text-gray-500">
                                //     {i18n?.t("No orders found")}
                                // </p>
                                <div className="flex items-center p-6 border border-gray-300 rounded-md justify-evenly bg-gray-50">
                                    <img
                                        src={order1}
                                        alt="No orders found"
                                        className="object-cover rounded-md w-44"
                                    />
                                    <div className="flex flex-col items-center justify-center">
                                        <p className="text-[16px] font-medium !text-[#0C1A40] font-poppins leading-[25.6px] mb-5">
                                            {i18n?.t("No orders found")}
                                        </p>
                                        <button onClick={() => navigate("/shop")} className="bg-secondary text-white px-4 py-2 rounded-lg ">{i18n?.t("Shop Now")}</button>
                                    </div>
                                </div>
                            )}
                        </div>
                        {order?.totalDocs > 0 && (
                            <Pagination
                                align="center"
                                className="!mt-[100px] body-paginate"
                                current={currentPage}
                                pageSize={pageSize}
                                total={order?.totalDocs}
                                onPageChange={onPageChange}
                                totalPages={order?.totalPages}
                            />
                        )}
                    </div>

            {/* Rating Modal */}
            <Modal
                open={isModalOpen}
                onCancel={closeModal}
                footer={null}
                centered
            >
                <Form onFinish={handleRatingSubmit}>
                    <h3 className="mb-4 text-xl font-semibold text-center">
                        {i18n.t("Rate the product")}
                    </h3>

                    {/* Star Rating */}
                    <div className="flex justify-center gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`text-3xl ${
                                    rating >= star
                                        ? "text-yellow-500"
                                        : "text-gray-300"
                                }`}
                            >
                                ★
                            </button>
                        ))}
                    </div>

                    <p className="mb-6 text-sm text-center text-gray-500">
                        {rating > 0
                            ? `${i18n.t("You rated")} ${rating} ${i18n.t(
                                  "stars"
                              )}`
                            : i18n.t("Click a star to rate")}
                    </p>

                    {/* Comment Input */}
                    <Form.Item>
                        <Input.TextArea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder={i18n.t("Write a review")}
                            rows={4}
                        />
                    </Form.Item>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className={`px-4 py-2 rounded-md text-white ${
                                rating > 0
                                    ? "bg-primary hover:bg-secondary"
                                    : "bg-gray-300 cursor-not-allowed"
                            } transition duration-300`}
                            disabled={rating === 0}
                        >
                            {i18n.t("Submit")}
                        </button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default Orders;
