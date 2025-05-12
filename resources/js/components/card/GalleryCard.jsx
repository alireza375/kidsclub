import React from "react";
import { StylesBorder } from "../../styles/styles";
import { Link } from "react-router-dom";

const GalleryCard = ({bg, border, image, heading,id}) => {
    const addOpacityToColor = (color, opacity) => {
        const [r, g, b] = color.match(/\w\w/g).map((c) => parseInt(c, 16));
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };
    return (

        <div style={StylesBorder(border, 4)}>
          <div className={`rounded-md`}>
            <img className="w-full rounded-t-[4px] md:h-[160px] object-fill" src={image} alt="" />
            <div to={`/service/${id}`} className={`p-4  flex items-center justify-center rounded-b-[4px] bg-opacity-50`} style={{ backgroundColor: addOpacityToColor(bg, 0.5) }}>
           <Link to={`/service/${id}`} ><h3 className="font-nunito font-bold text-2xl text-center line-clamp-1 text-[#0C1A40]">{heading}</h3></Link>
            </div>
          </div>
        </div>


    );
};

export default GalleryCard;
