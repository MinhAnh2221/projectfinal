import React from 'react';
import { Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const ButtonInputSearch = (props) => {
  const { size, placeholder, onChange } = props;
  
  return (
    <div style={{ display: 'flex' }}>
      <Input size={size} placeholder={placeholder} onChange={onChange} />
      <Button size={size} shape="circle" icon={<SearchOutlined />} {...props} />
    </div>
  );
};

export default ButtonInputSearch;
