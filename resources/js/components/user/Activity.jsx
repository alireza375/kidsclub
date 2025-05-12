import React, { useEffect, useState } from "react";
import { Card, Form, Modal, Input, Select } from "antd";
import { useAction, useFetch, useTitle } from "../../helpers/hooks";
import {
    addServiceReview,
    fetchChildList,
    fetchUserServiceList,
    joinByChild,
} from "../../helpers/backend";
import { useI18n } from "../../providers/i18n";
import { columnFormatter } from "../../helpers/utils";
import { Link, useNavigate } from "react-router-dom";
import { useSite } from "../../context/site";
import Pagination from "../common/pagination";

const { Option } = Select;

export default function ActivitiesList() {
    const navigate = useNavigate();
    const [children] = useFetch(fetchChildList);
    const [activities, getActivities] = useFetch(fetchUserServiceList);
    const i18n = useI18n();
    const { sitedata } = useSite();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    useTitle(
        sitedata?.title +
            " | " +
            i18n.t("Activities List") +
            " - " +
            i18n.t("User")
    );

    const onPageChange = (page) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        getOrder({ page, limit: pageSize });
    };

    useEffect(() => {
        getActivities({
            page: currentPage,
            limit: pageSize,
        });
    }, [currentPage, pageSize]);
    return (
        <div className="w-full h-full p-5">
         <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
                <h1 className="text-xl font-semibold text-gray-800">
                    {i18n?.t("Service")}
                </h1>
            </div>
            {activities?.docs?.map((activity) => (
                <ActivityCard
                    key={activity.id}
                    activity={activity}
                    children={children?.docs}
                    getActivities={getActivities}
                />
            ))}

            {activities?.docs?.length === 0 && (
                <div className="w-full bg-white flex flex-col gap-y-3 justify-center items-center p-4 rounded-lg border">
                        <p className="text-lg font-semibold">{i18n?.t("No Services Found")}</p>
                        <button onClick={() => navigate("/service")} className="bg-secondary text-white px-4 py-2 rounded-lg ml-4">{i18n?.t("Find Services")}</button>
                    </div>
            )}
            {activities?.totalDocs > 0 && (
                            <Pagination
                                align="center"
                                className="!mt-[100px] body-paginate"
                                current={currentPage}
                                pageSize={pageSize}
                                total={activities?.totalDocs}
                                onPageChange={onPageChange}
                                totalPages={activities?.totalPages}
                            />
                        )}
        </div>
    );
}

function ActivityCard({ activity, children, getActivities }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedActivityId, setSelectedActivityId] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const i18n = useI18n();

    // Open the modal and populate with existing review if available
    const openModal = (activityId) => {
        setSelectedActivityId(activityId);
        const existingReview = activity?.review; // Assuming activity.review contains the user's review
        if (existingReview) {
            setRating(existingReview.rating || 0); // Set existing rating
            setComment(existingReview.comment || ""); // Set existing comment
        } else {
            setRating(0);
            setComment("");
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setRating(0);
        setComment("");
    };

    // Handles child assignment to an activity
    const handleChildAssign = (childId) => {
        useAction(joinByChild, { id: activity.id, child_id: childId });
    };

    // Handles rating submission
    const handleRatingSubmit = () => {
        const data = {
            service_id: selectedActivityId,
            rating,
            comment,
        };

        useAction(addServiceReview, data);
        getActivities();
        closeModal();
    };

    return (
        <>
            {/* Activity Card */}
            <Card className="overflow-hidden border border-gray-200 rounded-lg shadow-lg mb-10">
                <div className="p-4 bg-white">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                        {/* Image Section */}
                        <img
                            src={activity?.service?.image}
                            alt={columnFormatter(activity?.service?.title)}
                            className="rounded-lg object-cover lg:h-[120px] lg:w-[120px] h-full w-full flex-shrink-0"
                        />

                        {/* Service Details */}
                        <div className="flex-1 min-w-0">
                            <h3 className="mb-1 text-xl font-semibold truncate text-secondary">
                                {columnFormatter(activity?.service?.name)}
                            </h3>
                            <p className="text-sm font-light text-gray-500 lg:text-base line-clamp-2">
                                {columnFormatter(activity?.service?.name)}
                            </p>
                        </div>

                        {/* Price Section */}
                        <div className="flex flex-col items-start gap-2 lg:items-center">
                            <p className="text-2xl font-semibold text-emerald-500">
                                {activity?.currency} {activity.price}
                            </p>
                        </div>

                        {/* Assign Child Dropdown */}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="assign-child"
                                className="text-sm font-medium text-gray-500"
                            >
                                {i18n.t("Assign Child")}
                            </label>
                            <Select
                                id="assign-child"
                                onChange={handleChildAssign}
                                placeholder={i18n.t("Select Child")}
                                className="w-[80px]"
                                value={activity?.child?.name}
                            >
                                {children?.map((child) => (
                                    <Option key={child.id} value={child.id}>
                                        {child.name}
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col items-center gap-3 lg:gap-4">
                            <Link
                                to={`/service/${activity?.service?.id}`}
                                className="px-4 py-2 text-center text-white transition duration-300 rounded-md bg-primary hover:bg-secondary w-full"
                            >
                                {i18n.t("View")}
                            </Link>
                            <button
                                onClick={() => openModal(activity?.service?.id)} // Pass activity ID to modal
                                className="px-4 py-2 text-center text-white transition duration-300 bg-yellow-500 rounded-md hover:bg-yellow-600 w-full"
                            >
                                {i18n.t("Rate Service")}
                            </button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Rating Modal */}
            <Modal
                open={isModalOpen}
                onCancel={closeModal}
                footer={null}
                centered
            >
                <Form onFinish={handleRatingSubmit}>
                    <h3 className="mb-4 text-xl font-semibold text-center">
                        {i18n.t("Rate the Service")}
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
                    <Form.Item
                         name="comment"
                         rules={[
                             { required: true, message: i18n.t("Please enter your comment") },
                         ]}
                    >
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
        </>
    );
}
