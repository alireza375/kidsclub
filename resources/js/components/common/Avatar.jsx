import React from "react";

const Avatar = ({ name, classes, bgColor = "bg-gray-300", textColor = "text-white" }) => {
    // Get the first letter of the name
    const getInitial = (name) => {
        return name && name.trim().length > 0 ? name.charAt(0).toUpperCase() : "?";
    };


    return (
        <div
            className={`${bgColor} ${textColor} ${classes} flex items-center justify-center rounded-full font-bold`}
        >
            {getInitial(name)}
        </div>
    );
};

export default Avatar;
