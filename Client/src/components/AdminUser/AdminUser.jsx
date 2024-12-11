import React, { useState, useEffect, useReducer } from "react";
import { WrapperHeader } from "./style";
import { Button, Modal, Form, Input, message, Table, Space } from "antd";
import { UsergroupAddOutlined, ClearOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import * as UserService from "../../services/UserService";
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const AdminUser = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stateUser, setStateUser] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  //them
  const [stateUserEdit, setStateUserEdit] = useState({
    email: '',
    name: '',
    phone: '',
    id: '' // Added ID here
  });
  const [dataUser, setDataUser] = useState([]);
  const [isModalEditOpen, setisModalEditOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useReducer(null);
  const fetchUserData = async () => {
    const res = await UserService.getAll();
    if (res.status === 'OK') {
      setDataUser(res.data);
    } else {
      message.error("Failed to fetch user data.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);


  const deleteUserMutation = useMutation({
    mutationFn: (userId) => UserService.deleteUser(userId),
    onSuccess: (data) => {
      if (data.status === 'OK') {
        message.success('User deleted successfully!');
        fetchUserData();
      } else {
        message.error(data.message);
      }
    },
    onError: () => {
      message.error('Failed to delete user, please try again later.');
    }
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    resetForm();
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setisModalEditOpen(false);
    setStateUser({ email: '', name: '', password: '', confirmPassword: '', phone: '' });
    setStateUserEdit({ email: '', name: '', phone: '', id: '' }); // Reset stateUserEdit
  };

  const onFinish = async () => {

  };

  const handleOnChange = (e) => {
    setStateUser({
      ...stateUser,
      [e.target.name]: e.target.value
    });
  };
  //them
  const handleOnChangeEdit = (e) => {
    setStateUserEdit({
      ...stateUserEdit,
      [e.target.name]: e.target.value
    });
  };
  const onFinishEdit = async () => {
    try {
      const res = await UserService.updateUser(stateUserEdit.id, stateUserEdit)
      if (res.status === 'OK') {
        fetchUserData()
        setisModalEditOpen(false)
      }
    } catch (error) {
      message.error('User operation failed');
    }
  };
  

  const handleDetailsUser = async (record) => {
    formEdit.setFieldsValue({
      email: record.email,
      name: record.name,
      phone: record.phone,
      password: record.password,
      id: record._id // Set ID when opening edit modal
    });

    setStateUserEdit({
      email: record.email,
      name: record.name,
      phone: record.phone,
      password: record.password,
      id: record._id // Store ID in stateUserEdit
    });

    setisModalEditOpen(true);
  };

  const handleDeleteUser = async (record) => {
    await deleteUserMutation.mutateAsync(record._id);
  };
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          
          
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    
  });

  const [formEdit] = Form.useForm();
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps('name')
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.length - b.email.length
    },
    {
      title: 'Password',
      dataIndex: 'password',
      key: 'password',
      sorter: (a, b) => a.password.length - b.password.length
    },
    
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      sorter: (a, b) => a.phone.length - b.phone.length
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleDetailsUser(record)}>
            Edit
          </Button>
          <Button type="link" icon={<ClearOutlined />} onClick={() => handleDeleteUser(record)}>
            Delete
          </Button>
        </div>
      ),
    }
  ];

  return (
    <div>
      <WrapperHeader>Quản Lý Người Dùng</WrapperHeader>
      <div style={{ marginTop: '10px' }}>
        <Button
          style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }}
          onClick={showModal}
        >
          <UsergroupAddOutlined style={{ fontSize: '60px' }} />
        </Button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <Table
          rowSelection
          columns={columns}
          dataSource={dataUser.map((user, index) => ({ ...user, key: index }))}
        />
      </div>
      <Modal title={"Tạo Người Dùng"} open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
          >
            <Input value={stateUser.email} onChange={handleOnChange} name="email" />
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input value={stateUser.name} onChange={handleOnChange} name="name" />
          </Form.Item>


          <>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password value={stateUser.password} onChange={handleOnChange} name="password" />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password value={stateUser.confirmPassword} onChange={handleOnChange} name="confirmPassword" />
            </Form.Item>
          </>


          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input value={stateUser.phone} onChange={handleOnChange} name="phone" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal title={"Edit User"} open={isModalEditOpen} onCancel={handleCancel} footer={null}>
        <Form
          form={formEdit}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinishEdit} // Update user on form submit
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
          >
            <Input onChange={handleOnChangeEdit} name="email" />
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input onChange={handleOnChangeEdit} name="name" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input onChange={handleOnChangeEdit} name="phone" />
          </Form.Item>
          <Form.Item
            label="PassWord"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input onChange={handleOnChangeEdit} name="password" />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUser;
