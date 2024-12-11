import React, { useState } from "react";
import { Menu } from "antd";
import { UserOutlined, FormOutlined } from '@ant-design/icons';

import AdminUser from "../../components/AdminUser/AdminUser";
import AdminProduct from "../../components/AdminProduct/AdminProduct";
import AdminOrder from "../../components/AdminOrder/AdminOrder";

const AdminPage = () => {
  const items = [
    {
      key: 'user',
      label: 'Người dùng',
      icon: <UserOutlined />,
    },
    {
      key: 'product', 
      label: 'Sản Phẩm',
      icon: <FormOutlined />,
    },{
      key: 'order',
      label: 'Đơn hàng',
      icon: <FormOutlined />,
    }
  ];

  const [keySelected, setKeySelected] = useState('user'); // Mặc định chọn "user" khi vào trang

  const handleOnClick = (e) => {
    console.log('click ', e.key); // Sử dụng e.key để lấy key từ sự kiện click
    setKeySelected(e.key);
  };

  const renderPage = (key) => {
    switch(key) {
      case 'user':
        return <AdminUser />;
      case 'product':
        return <AdminProduct />;
      case 'order':
        return <AdminOrder/>;
      default: 
        return <></>;
    }
  };

  return (
    <div style={{display: 'flex'}}>
      <Menu
        onClick={handleOnClick}
        style={{
          width: 256,
          boxShadow: '1px 1px 2px #ccc',
          height: '100vh',
        }}
        defaultSelectedKeys={['user']} // Đặt mặc định là "user"
        mode="inline"
        items={items}  
      />
      <div style={{ padding: '16px' }}>
        {renderPage(keySelected)}
      </div>
    </div>
  );
};

export default AdminPage;
