import React, { useEffect, useState } from "react";
import { WrapperHeader, WrapperContentProfile, WrapperLabel, WrapperInput, ButtonUpdate } from "./style";
import { Form } from "antd";
import * as UserService from '../../services/UserService';
import { jwtTranslate } from "../../ultilis";

const Profile = () => {
  const storageAccessToken = localStorage.getItem('access_token');
  const [form] = Form.useForm();
  const [stateUser, setStateUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: ''
  });

  useEffect(() => {
    const fetchDataUser = async () => {
      try {
        const res = await UserService.getDetailsUser(
          jwtTranslate(storageAccessToken)?.id
        );
        const userData = res.data;
        setStateUser({
          name: userData.name,
          email: userData.email,
          phone: userData.phone || " ",
          address: userData.address || " ",
          avatar: userData.avatar || " ",
        });
        form.setFieldsValue({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
          avatar: userData.avatar
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataUser();
  }, [form, storageAccessToken]);

  const handleUpdate = async () => {
    const updatedUser = {
      ...stateUser,
      ...form.getFieldsValue(),
    };
    const res = await UserService.updateUser(jwtTranslate(storageAccessToken)?.id, updatedUser);
    if (res.status === "OK") {
      // Có thể hiển thị thông báo thành công ở đây
    } else {
      // Xử lý lỗi ở đây
    }
  };

  const handleChange = (changedFields) => {
    setStateUser((prevState) => ({
      ...prevState,
      ...changedFields,
    }));
  };

  return (
    <WrapperContentProfile>
      <WrapperHeader>Thông tin người dùng</WrapperHeader>
      
      <Form
        form={form}
        layout="vertical"
        style={{
          maxWidth: 600,
          margin: "0 auto",
        }}
        onValuesChange={(_, values) => handleChange(values)} // Gọi hàm handleChange khi giá trị thay đổi
      >
        <Form.Item
          label={<WrapperLabel>Name</WrapperLabel>}
          name="name"
          rules={[{ required: true, message: "Please input your name" }]}
        >
          <WrapperInput />
        </Form.Item>

        <Form.Item
          label={<WrapperLabel>Email</WrapperLabel>}
          name="email"
          rules={[{ required: true, message: "Please input your email" }]}
        >
          <WrapperInput />
        </Form.Item>

        <Form.Item
          label={<WrapperLabel>Phone</WrapperLabel>}
          name="phone"
          rules={[{ required: true, message: "Please input your phone number" }]}
        >
          <WrapperInput />
        </Form.Item>

        <Form.Item
          label={<WrapperLabel>Address</WrapperLabel>}
          name="address"
          rules={[{ required: true, message: "Please input your address" }]}
        >
          <WrapperInput />
        </Form.Item>

        <Form.Item
          label={<WrapperLabel>Avatar</WrapperLabel>}
          name="avatar"
          rules={[{ required: true, message: "Please input your avatar URL" }]}
        >
          <WrapperInput />
        </Form.Item>

        <Form.Item>
          <ButtonUpdate onClick={handleUpdate}>
            Cập Nhật
          </ButtonUpdate>
        </Form.Item>
      </Form>
    </WrapperContentProfile>
  );
};

export default Profile;
