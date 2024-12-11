import React from 'react';
import { Card, Space,  } from 'antd';
import Meta from 'antd/es/card/Meta';
import { StyleNameProduct, WrapperReportText, WrapperPriceText, WrapperDiscoutText, WrapperCardStyle, WrapperStyleTextSell } from './style';
import {StarOutlined} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const CardComponent = (props) => {
  const {countInStock, description, image,name,price,rating,type, selled, discount, id} = props
  const navigate = useNavigate()
  const handleDetailsProduct = (id) => {
    navigate(`/productDetails/${id}`)

  }
  return (
    <WrapperCardStyle
    hoverable
    headStyle={{width: '50px', height: '200px'}}
    style={{ width: 240 }}
    bodyStyle={{padding: '10px'}}
    cover={<img alt="example" src={image} />}
    onClick={() => handleDetailsProduct(id)}
  >
    <StyleNameProduct>{name}</StyleNameProduct>
    <WrapperReportText>
    <span>
    <span>{rating}</span>
    <StarOutlined style={{fontSize: '12px', color: 'yellow'}} />
    </span>
    <WrapperStyleTextSell>{selled}</WrapperStyleTextSell>
    </WrapperReportText>
    <WrapperPriceText > {price.toLocaleString()}<WrapperDiscoutText> - {discount || 5} %</WrapperDiscoutText></WrapperPriceText>
  </WrapperCardStyle>
  );
}

export default CardComponent;