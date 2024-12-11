import Slider from 'react-slick';
import React from 'react';
import {Image} from 'antd';
const SliderComponents = ({arrImages}) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000
  };
  return (
   <Slider {...settings}>
    {arrImages.map((image) => {
      return(
        <Image key={image} src= {image} alt="slide" preview= {false} width= '100%' height='247px' />

      )
    })}
   </Slider> 
  );
}

export default SliderComponents;