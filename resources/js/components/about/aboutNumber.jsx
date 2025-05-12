import React from "react";
// import bg from "../../../images/numberBg.png";
import bg from '../../../images/numberBg.png';

const AboutNumber = () => {
    const numberData = [
        { number: 25, title: "Total Groups" },
        { number: 20, title: "Qualified Teachers" },
        { number: 30, title: "Students Enrolled" },
        { number: 10, title: "Year of Experience" },
    ];
    return (
        <div
            className="flex items-center justify-center bg-cover h-[37vh]"
            style={{ backgroundImage:  `url(${bg})` }}
        >
            <div className="custom-container grid grid-cols-2 md:grid-cols-4 grid-flow-col justify-stretch last:text-center">
                {numberData.map((data, index) => (
                    <div
                        key={index}
                        className=" text-[#0C1A40]"
                    >
                        <div className="">
                            <h1 className="heading3">
                                {data.number}
                            </h1>
                            <p className="description !font-bold">
                                {data.title}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AboutNumber;
