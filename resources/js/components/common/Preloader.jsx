import React from 'react';
import cercasAnimation from '../../../../resources/images/cercas-animation.json';
import Lottie from 'lottie-react';

const Preloader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white  z-[999] w-full h-full">
      <Lottie
        animationData={cercasAnimation}
        loop={true}
        autoplay={true}
        style={{ width: 600, height: 600 }}
      />
    </div>
  );
};

export default Preloader;