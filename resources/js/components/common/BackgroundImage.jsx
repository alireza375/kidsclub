import React from 'react'

export default function BackgroundImage({ src, alt, className }) {
  return (
      <div className="absolute inset-0 -z-50">
          <img
              src={src}

              alt={alt}
              className={`w-[100%] h-[100%] ${className?className:' xl:object-fill object-cover'}`}
          />
      </div>
  )
}
