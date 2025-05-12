import React from 'react'
import { Link } from "react-router-dom"


const Icon = ({ icon, className }) => {
    return (
        <Link to={"#"}>
            <div className={`w-7 h-7 rounded-full text-white  flex justify-center items-center ${className}`}>
                {icon}
            </div>
        </Link>
    )
}
export default Icon