import React from 'react';
import { useFetch } from '../../helpers/hooks';
import { publicGalleryList } from '../../helpers/backend';
const ImageGallery = () => {
    const [gallery,getGallery]=useFetch(publicGalleryList,{});
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mt-5'>
            {(gallery?.docs?.slice(0,5))?.map(image => (
                <img key={image?.id} src={image?.image} alt={image?.id} className='w-full h-[525px] object-cover' />
            ))}
        </div>
    );
};

export default ImageGallery;
