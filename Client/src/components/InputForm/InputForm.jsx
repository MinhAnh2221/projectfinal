import React from 'react';
import { WapperInputStyle } from './style'; // Đảm bảo đường dẫn chính xác

const InputForm = (props) => {
  const handleOnChangeInput = (e) => {
    if (typeof props.onChange === 'function') {
      // Kiểm tra kỹ lưỡng e.target và e.target.value
      if (e && e.target && e.target.value !== undefined) {
        props.onChange(e.target.value);
      } else {
        console.error('Event target or target.value is undefined:', e);
      }
    } else {
      console.warn('onChange is not a function or is not provided');
    }
  };

  const { placeholder = 'InPut Text', value = '', ...rests } = props; // Đặt giá trị mặc định cho placeholder và value

  return (
    <WapperInputStyle
      placeholder={placeholder}
      value={value} // Đảm bảo giá trị mặc định cho value
      {...rests}
      onChange={handleOnChangeInput} // Gọi hàm xử lý khi có sự kiện onChange
    />
  );
};

export default InputForm;
