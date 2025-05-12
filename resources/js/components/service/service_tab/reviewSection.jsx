import React, { useState } from "react";
import { Progress, Rate, Input, Button, message, Form } from "antd";
import user from "../../../../images/user.png";
import ContactForm from "../../home/ContactForm";
import { FaArrowDown } from "react-icons/fa";
import { useI18n } from "../../../providers/i18n";
import dayjs from "dayjs";

export default function ReviewSection({ data }) {
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState("");
    const [visibleComments, setVisibleComments] = useState(2);
    const i18n = useI18n();
    const comments = [
        {
            id: 1,
            author: "Miany",
            rating: 5,
            date: "Feb at 5:30pm",
            content:
                "My child absolutely loves KidStick! The programs are not only fun but also incredibly enriching. We've seen so much growth in their confidence, KidStick has been a game-changer for our family.",
            replyid: 1,
            replyauthor: "Miany",
            replydate: "Feb at 5:30pm",
            replycontent:
                "My child absolutely loves KidStick! The programs are not only fun but also incredibly enriching. We've seen so much growth in their confidence, KidStick has been a game-changer for our family.",
            replyavatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: 2,
            author: "Miany",
            rating: 5,
            date: "Mar at 5:30pm",
            content:
                "My child absolutely loves KidStick! The programs are not only fun but also incredibly enriching. We've seen so much growth in their confidence, KidStick has been a game-changer for our family.",
        },
        // Add more comments here for testing
    ];

    const handleReplyClick = (commentId, isReply) => {
        setReplyingTo(isReply ? `reply-${commentId}` : `comment-${commentId}`);
    };



    return (
        <div className="rounded-2xl border border-breadcrumb bg-white p-6">
            <div className="mb-8">
                <div className="md:flex items-center gap-10 pl-6 md:pl-20 md:mt-10 mt-6 pr-6 md:pr-10">
                    <div className="md:mb-0 mb-8">
                        <div className="text-4xl font-bold text-center">
                            {data?.avg_rating}
                        </div>
                        <Rate
                            disabled
                            value={data?.avg_rating}
                            className="text-sm text-[#FF6B6D]"
                        />
                        <div className="midtitle text-gray-500 mt-1">
                            ({data?.review?.length} Review)
                        </div>
                    </div>
                    <div className="flex-1">
                        <div
                            className="flex items-center gap-2 mb-2 antdprogressber"
                        >
                            <span className="midtitle text-gray-600">
                                1 Stars
                            </span>
                            <Progress
                                percent={(data?.rating_counts?.one_star / data?.review?.length) * 100}
                                showInfo={false}
                                strokeColor="#FE5C45"
                                trailColor="#f5f5f5"
                                className="flex-1"
                            />
                            <span className="midtitle text-gray-600">
                                {data?.rating_counts?.one_star}
                            </span>
                        </div>
                        <div
                            className="flex items-center gap-2 mb-2 antdprogressber"
                        >
                            <span className="midtitle text-gray-600">
                                2 Stars
                            </span>
                            <Progress
                                percent={(data?.rating_counts?.two_star / data?.review?.length) * 100}
                                showInfo={false}
                                strokeColor="#FE5C45"
                                trailColor="#f5f5f5"
                                className="flex-1"
                            />
                            <span className="midtitle text-gray-600">
                                {data?.rating_counts?.two_star}
                            </span>
                        </div>
                        <div
                            className="flex items-center gap-2 mb-2 antdprogressber"
                        >
                            <span className="midtitle text-gray-600">
                                3 Stars
                            </span>
                            <Progress
                                percent={(data?.rating_counts?.three_star / data?.review?.length) * 100}
                                showInfo={false}
                                strokeColor="#FE5C45"
                                trailColor="#f5f5f5"
                                className="flex-1"
                            />
                            <span className="midtitle text-gray-600">
                                {data?.rating_counts?.three_star}
                            </span>
                        </div>
                        <div
                            className="flex items-center gap-2 mb-2 antdprogressber"
                        >
                            <span className="midtitle text-gray-600">
                                4 Stars
                            </span>
                            <Progress
                                percent={(data?.rating_counts?.four_star / data?.review?.length) * 100}
                                showInfo={false}
                                strokeColor="#FE5C45"
                                trailColor="#f5f5f5"
                                className="flex-1"
                            />
                            <span className="midtitle text-gray-600">
                                {data?.rating_counts?.four_star}
                            </span>
                        </div>
                        <div
                            className="flex items-center gap-2 mb-2 antdprogressber"
                        >
                            <span className="midtitle text-gray-600">
                                5 Stars
                            </span>
                            <Progress
                                percent={(data?.rating_counts?.five_star / data?.review?.length) * 100}
                                showInfo={false}
                                strokeColor="#FE5C45"
                                trailColor="#f5f5f5"
                                className="flex-1"
                            />
                            <span className="midtitle text-gray-600">
                                {data?.rating_counts?.five_star}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6 bg-[#FBF1E3] border-2 border-dashed border-text rounded-[20px] p-6 md:p-[60px]">
                <div className="rounded-lg mb-8">
                    <h3 className="midtitle text-text !font-bold mb-4">
                      {i18n.t("Review")} ({data?.review?.length})
                    </h3>
                    <div className="space-y-6">
                        {data?.review?.map((comment, index) => (
                            <div
                                key={index}
                                className="border-b-2 last:border-b-0 border-dashed border-text pb-8 last:pb-0"
                            >
                                <div className="pb-8 last:pb-0">
                                    <div className="flex items-start gap-3">
                                        <img
                                            src={comment?.user_image}
                                            alt={comment?.user_name}
                                            className="w-10 md:w-[70px] h-10 md:h-[70px] rounded-xl border-2 border-text border-dashed"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="midtitle text-text !font-bold">
                                                    {comment?.user_name}
                                                </span>
                                            </div>
                                            <div className="flex gap-2 items-center">
                                                <Rate
                                                    disabled
                                                    value={comment?.rating}
                                                    className="text-[#FF6B6D] text-sm mb-2"
                                                />
                                                <span className="midtitle text-gray-500">
                                                    {dayjs(comment?.created_at).format(
                                                        "MMM DD, YYYY"
                                                    )}
                                                </span>
                                            </div>
                                            <p className="header-description tracking-widest !text-base !text-text">
                                                {comment?.comment}
                                            </p>
                                            
                                            
                                        </div>
                                    </div>
                                </div>
                               
                            </div>
                        ))}
                        
                    </div>
                </div>
            </div>
        </div>
    );
}
