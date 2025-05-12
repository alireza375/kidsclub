import { Rate } from "antd";
import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useAction, useFetch } from "../../../helpers/hooks";
import { useParams } from "react-router-dom";
import { useI18n } from "../../../providers/i18n";
import { deleteProductReview, getSingleProduct } from "../../../helpers/backend";
import { columnFormatter } from "../../../helpers/utils";

const ProductReviews = () => {
  const {id} = useParams();
  const i18n = useI18n();
  const [product, getProduct] = useFetch(getSingleProduct, {id});


  const handleDeleteReview = (id) => {
   useAction(deleteProductReview, {id});
   getProduct();
  };



  return (
    <div className="min-h-full p-4 bg-gray-100 rounded-md">
      <div className="flex items-center justify-between mb-4">
      <h2 className="mb-4 text-xl font-semibold">{i18n?.t("Reviews of")} {columnFormatter(product?.name)}</h2>
      <button onClick={() => window.history.back()} className="px-3 py-2 text-sm text-white duration-300 ease-in-out border rounded bg-teal-blue border-teal-blue hover:bg-white hover:text-teal-blue">{i18n?.t("Back")}</button>
      </div>

      <ul className="space-y-4">
        {product?.reviews?.map((review) => (
          <li
            key={review.id}
            className="flex items-start p-3 space-x-4 bg-white rounded shadow"
          >
            <img
              src={review?.user?.image}
              alt={review?.user?.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{review?.user?.name}</p>
              <div className="flex items-center my-2"><Rate disabled defaultValue={review?.rating} /></div>
              <p className="mt-1 text-gray-600">{review?.comment}</p>
            </div>
            <button
              onClick={() => handleDeleteReview(review?.id)}
              className="px-3 py-2 text-sm text-red-600 duration-300 ease-in-out border border-red-600 rounded hover:text-white hover:bg-red-600"
            >
              <FaTrash />
            </button>
          </li>
        ))}
        {product?.reviews?.length === 0 && (
          <p className="mt-4 text-center text-gray-600">{i18n?.t("No reviews yet")}.</p>
        )}
      </ul>
    </div>
  );
};

export default ProductReviews;
