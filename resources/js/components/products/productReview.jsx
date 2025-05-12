import React, { useState } from 'react';
import { Progress, Rate, Input, message, Form } from 'antd';
import { FaTrash } from 'react-icons/fa';
import { useI18n } from '../../providers/i18n';
import dayjs from 'dayjs';

export default function ProductReview({ data }) {
  const i18n = useI18n();
  const deleteReview = async (id) => {
      try {
          useAction(deleteServiceReview, { id });
          getData();
      } catch (error) {
          message.error(i18n.t("Failed to delete review. Please try again."));
      }
  };

  return (
      <div className="p-6 bg-white border rounded-2xl border-breadcrumb">
          <div className="mb-8">
              <div className="items-center gap-10 pl-6 pr-6 mt-6 md:flex md:pl-20 md:mt-10 md:pr-10">
                  <div className="mb-8 md:mb-0">
                      <div className="text-4xl font-bold text-center">
                          {data?.avgRating}
                      </div>
                      <Rate
                          disabled
                          value={data?.avgRating}
                          className="text-sm text-primary"
                      />
                      <div className="mt-1 text-gray-500 midtitle">
                          ({data?.reviews?.length} {i18n.t("Reviews")})
                      </div>
                  </div>
                  <div className="flex-1">
                      <div
                          className="flex items-center gap-2 mb-2 antdprogressber"
                      >
                          <span className="text-gray-600 midtitle">
                              1 Stars
                          </span>
                          <Progress
                              percent={(data?.rating_counts?.one_star / data?.reviews?.length) * 100}
                              showInfo={false}
                              strokeColor="#FE5C45"
                              trailColor="#f5f5f5"
                              className="flex-1"
                          />
                          <span className="text-gray-600 midtitle">
                              {data?.rating_counts?.one_star}
                          </span>
                      </div>
                      <div
                          className="flex items-center gap-2 mb-2 antdprogressber"
                      >
                          <span className="text-gray-600 midtitle">
                              2 Stars
                          </span>
                          <Progress
                              percent={(data?.rating_counts?.two_star / data?.reviews?.length) * 100}
                              showInfo={false}
                              strokeColor="#FE5C45"
                              trailColor="#f5f5f5"
                              className="flex-1"
                          />
                          <span className="text-gray-600 midtitle">
                              {data?.rating_counts?.two_star}
                          </span>
                      </div>
                      <div
                          className="flex items-center gap-2 mb-2 antdprogressber"
                      >
                          <span className="text-gray-600 midtitle">
                              3 Stars
                          </span>
                          <Progress
                              percent={(data?.rating_counts?.three_star / data?.reviews?.length) * 100}
                              showInfo={false}
                              strokeColor="#FE5C45"
                              trailColor="#f5f5f5"
                              className="flex-1"
                          />
                          <span className="text-gray-600 midtitle">
                              {data?.rating_counts?.three_star}
                          </span>
                      </div>
                      <div
                          className="flex items-center gap-2 mb-2 antdprogressber"
                      >
                          <span className="text-gray-600 midtitle">
                              4 Stars
                          </span>
                          <Progress
                              percent={(data?.rating_counts?.four_star / data?.reviews?.length) * 100}
                              showInfo={false}
                              strokeColor="#FE5C45"
                              trailColor="#f5f5f5"
                              className="flex-1"
                          />
                          <span className="text-gray-600 midtitle">
                              {data?.rating_counts?.four_star}
                          </span>
                      </div>
                      <div
                          className="flex items-center gap-2 mb-2 antdprogressber"
                      >
                          <span className="text-gray-600 midtitle">
                              5 Stars
                          </span>
                          <Progress
                              percent={(data?.rating_counts?.five_star / data?.reviews?.length) * 100}
                              showInfo={false}
                              strokeColor="#FE5C45"
                              trailColor="#f5f5f5"
                              className="flex-1"
                          />
                          <span className="text-gray-600 midtitle">
                              {data?.rating_counts?.five_star}
                          </span>
                      </div>
                  </div>
              </div>
          </div>

          <div className="space-y-6 bg-[#FBF1E3] border-2 border-dashed border-text rounded-[20px] p-6 md:p-[60px]">
              <div className="mb-8 rounded-lg">
                  <h3 className="midtitle text-text !font-bold mb-4">
                    {i18n.t("Review")} ({data?.reviews?.length})
                  </h3>
                  <div className="space-y-6">
                      {data?.reviews?.map((comment, index) => (
                          <div
                              key={index}
                              className="pb-8 border-b-2 border-dashed last:border-b-0 border-text last:pb-0"
                          >
                              <div className="pb-8 last:pb-0">
                                  <div className="flex items-start gap-3">
                                      <img
                                          src={comment?.user?.image}
                                          alt={comment?.user?.name}
                                          className="w-10 md:w-[70px] h-10 md:h-[70px] rounded-xl border-2 border-text border-dashed"
                                      />
                                      <div className="relative flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                              <span className="midtitle text-text !font-bold">
                                                  {comment?.user?.name}
                                              </span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                              <Rate
                                                  disabled
                                                  value={comment?.rating}
                                                  className="mb-2 text-sm text-teal-blue"
                                              />
                                              <span className="text-gray-500 midtitle">
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
