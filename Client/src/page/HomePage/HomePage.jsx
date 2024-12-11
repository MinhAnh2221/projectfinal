import React, { useState } from 'react';
import TypeProduct from '../../components/TypeProduct/TypeProduct';
import { WrapperTypeProduct, WrapperButtonMore, WrapperProducts } from './style';
import SliderComponents from '../../components/SliderComponent/SliderComponent';
import slide1 from '../../assect/images/slide1.jpg';
import slide2 from '../../assect/images/slide2.jpg';
import slide3 from '../../assect/images/slide3.jpg';
import slide4 from '../../assect/images/slide4.jpg';
import CardComponent from '../../components/CardComponent/CardComponent';
import { useQuery } from '@tanstack/react-query'; 
import * as ProductService from '../../services/ProductService';

const HomePage = () => {
 
  const [limit, setLimit] = useState(3);

  // Hàm lấy dữ liệu sản phẩm
  const fetchProductAll = async (limit) => {
    const res = await ProductService.getAllProduct(limit); 
    return res.data;
  };

  // Sử dụng useQuery để lấy dữ liệu sản phẩm
  const { isLoading, data: products } = useQuery({
    queryKey: ['products', limit],
    queryFn: () => fetchProductAll(limit),
    retry: 3,
    retryDelay: 1000,
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!products || products.length === 0) {
    return <div>Không có sản phẩm nào!</div>;
  }

  return (
    <div style={{ padding: '0 120px' }}>
     
      
      <SliderComponents arrImages={[slide1, slide2, slide3, slide4]} />

      <WrapperProducts>
        {Array.isArray(products) && products.map((product,index) => (
          <CardComponent 
            key={index}
            countInStock={product.countInStock} 
            description={product.description} 
            image={product.image} 
            name={product.name}
            price={product.price}
            rating={product.rating}
            type={product.type}
            selled={product.selled}
            discount={product.discount}
            id={product._id}
          /> 
        ))}
      </WrapperProducts>

      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <WrapperButtonMore
          textButton={"Xem Thêm"}
          type="outline"
          styleButton={{
            border: '1px solid rgb(11, 116, 229)',
            color: 'rgb(11, 116, 229)',
            width: '240px',
            height: '38px',
            borderRadius: '4px'
          }}
          styleTextButton={{ fontWeight: 500 }}
          onClick={() => setLimit((prev) => prev + 1)}
        />
      </div>
    </div>
  );
};

export default HomePage;
