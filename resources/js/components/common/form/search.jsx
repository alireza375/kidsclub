import React from 'react'
import {FiSearch} from "react-icons/fi";
import { useI18n } from "../../../providers/i18n";

const SearchInput = ({className, wrapperClassName, value, onChange, placeholder}) => {
    const i18n = useI18n();

    return (
<div className={`relative flex items-center mr-2 font-nunito ${wrapperClassName || ''}`}>
    <FiSearch className="absolute left-3 text-gray-500 text-xl pointer-events-none" />
    <input
        className={`form-input w-full text-base sm:text-lg border px-10 py-2 rounded-md border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-200 ease-in-out ${className || ''}`}
       
        value={value}
        onChange={onChange}
        placeholder={placeholder || i18n?.t('Search')}
    />
</div>


    )
}
export default SearchInput
