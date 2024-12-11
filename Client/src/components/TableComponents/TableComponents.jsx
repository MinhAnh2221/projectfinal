import React, { useState } from "react";
import { Radio, Divider, Table } from "antd";

const TableComponents = ({ selectionType = 'checkbox', ...otherProps }) => {
  // Ví dụ về dữ liệu cột và hàng cho Table
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
  ];

  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`Selected Row Keys: ${selectedRowKeys}`, 'Selected Rows: ', selectedRows);
    },
  };

  return (
    <Table
      rowSelection={{
        type: selectionType, // Loại lựa chọn sẽ thay đổi giữa 'checkbox' và 'radio'
        ...rowSelection,
      }}
      columns={columns}
      dataSource={data}
      {...otherProps}
    />
  );
};

export default TableComponents;
