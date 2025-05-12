import React, { useState } from "react";

const ImageGallery = ({ data}) => {
    const [selectedImage, setSelectedImage] = useState(data?.product?.thumbnail_image);
    return (
        <div className="w-full ">
            {/* Main Image */}
            <div className="relative aspect-square  w-full overflow-hidden rounded-lg mb-4">
                <img
                    src={selectedImage?selectedImage:data?.product?.thumbnail_image }
                    alt={`Product image `}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-2">
                {data?.product?.images?.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(image)}
                        className={`relative xl:h-[96px] lg:h-[70px] md:h-14 h-12 xl:w-[96px] lg:w-[70px] md:w-14 w-12 flex-shrink-0 overflow-hidden rounded-lg border-2 ${selectedImage === index ? "border-primary" : "border-transparent"
                            }`}
                    >
                        <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ImageGallery;
