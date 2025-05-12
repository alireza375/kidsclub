import React from "react";
import { PageHeader } from "../components/common/upperSection";
import { publicGalleryList } from "../helpers/backend";
import { useFetch, useTitle } from "../helpers/hooks";
import { Image, Skeleton } from "antd";
import { useSite } from "../context/site";

const Gallery = () => {
    const [gallery, getGallery, { loading }] = useFetch(publicGalleryList);
    const colors = ["#49D574", "#0C1A40", "#FDBA21", "#4CAF50"];
    const { sitedata } = useSite();
    useTitle(`${sitedata?.title || "KidStick"} | Gallery`);
    return (
        <div className="bg-[#FCF6EE]">
            <PageHeader title="Gallery" />
            <div className="custom-container py-[60px] md:py-[120px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {loading
                        ? Array(6)
                              .fill(null)
                              .map((_, i) => (
                                  <div
                                      key={i}
                                      className="w-full h-60 bg-gray-200 flex justify-center items-center rounded-lg"
                                  >
                                      <Skeleton.Image
                                          active
                                          className="w-full h-auto  object-center rounded-lg"
                                      />
                                  </div>
                              ))
                        : gallery?.docs?.map((image, index) => (
                              <div
                                  key={image?.id}
                                  className="w-full h-[325px] border-2 border-dashed"
                                  style={{
                                      borderColor:
                                          colors[index % colors?.length],
                                  }}
                              >
                                  <Image
                                      width={"100%"}
                                      height={"100%"}
                                      src={image?.image}
                                      alt={image?.id}
                                      className="!w-full !h-full  object-center"
                                  />
                              </div>
                          ))}
                </div>
            </div>
        </div>
    );
};

export default Gallery;
