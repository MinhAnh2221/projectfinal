import React, { Fragment } from 'react';
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent';
import CardComponent from '../../components/CardComponent/CardComponent';
import {  Row, Pagination, Col } from 'antd';
import {WrapperProducts, WrapperNavBar} from './style'
const TypeProductPage = () => {
  const onChange= () => {}
  return (
    <div style= {{padding: '0 120px', background: '#efefef' }}>
    <Row style={{ flexWrap: 'nowrap', paddingTop: '10px'}}>
      <WrapperNavBar span={4} >
      <NavbarComponent />
      </WrapperNavBar>
      <Col span={20}> 
      <WrapperProducts >
      <CardComponent />
    
      </WrapperProducts>
      <Pagination defaultCurrent={20} total={2} onChange={onChange} style={{textAlign: 'center', marginTop: '10px'}}/>
      </Col> 
      </Row>
     
    </div>
   
  );
}

export default TypeProductPage;