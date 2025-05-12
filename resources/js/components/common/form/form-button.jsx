import React, { useState } from 'react';
import { motion } from "framer-motion";
import { useLocation } from 'react-router-dom';
const FormButton = ({
  children,
  onClick,
  className = '',
  loadingText = 'Loading...',
  loading
}) => {



  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      type="submit"
      onClick={onClick}
      className={`border-2 font-nunito border-secondary lg:px-4 text-textMain md:px-4 h-fit py-2 px-4 whitespace-pre rounded transition-colors !font-medium duration-300 ease-in-out sm:text-base capitalize text-sm 
        ${loading ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-secondary hover:text-white'}  ${className}`}
      disabled={loading}
    >
      {loading ? loadingText : children}
    </motion.button>
  );
};

export default FormButton;
