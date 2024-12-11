import React, { useState } from 'react';
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style';
import InputForm from '../../components/InputForm/InputForm';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { Image } from 'antd';
import logosignin from '../../assect/images/logosignin.jpg';
import { useNavigate } from 'react-router-dom';
import * as UserService from '../../services/UserService';
import { useMutation } from '@tanstack/react-query';

const SignUpPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState(''); // Trường nhập email
  const [password, setPassword] = useState(''); // Trường nhập mật khẩu
  const [confirmPassword, setConfirmPassword] = useState(''); // Trường xác nhận mật khẩu

  const navigate = useNavigate();

  // Sử dụng useMutation để xử lý việc đăng ký người dùng
  const mutation = useMutation({
    mutationFn: (data) => UserService.signupUser(data), // Gọi API từ UserService
    onSuccess: (data) => {
      if (data.status === 'OK') {
        navigate('/sign-in'); // Điều hướng về trang đăng nhập khi đăng ký thành công
      } else {
        alert(data.message); // Hiển thị thông báo lỗi nếu có
      }
    },
    onError: (error) => {
      alert('Đăng ký thất bại, vui lòng thử lại sau'); // Xử lý lỗi khi API thất bại
    }
  });

  // Hàm xử lý khi nhấn nút Đăng Ký
  const handleSignUp = () => {
    // Kiểm tra nếu password và confirmPassword không trùng khớp
    if (password !== confirmPassword) {
      alert('Mật khẩu và xác nhận mật khẩu không khớp');
      return;
    }

    // Gửi thông tin đăng ký qua API
    mutation.mutate({
      email,
      password,
      confirmPassword
    })
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.53)', height: '100vh' }}>
      <div style={{ width: '800px', height: '600px', borderRadius: '6px', backgroundColor: '#fff', display: 'flex' }}>
        <WrapperContainerLeft>
          <h1>Hello</h1>
          <p>Đăng nhập và tạo tài khoản</p>

          {/* Trường nhập email */}
          <InputForm
            type="email"
            placeholder="abc@gmail.com"
            value={email}
            onChange={(e) => setEmail(e)} // Cập nhật giá trị email
            style={{ marginBottom: '5px' }}
          />

          {/* Trường nhập mật khẩu */}
          <div style={{ marginBottom: '5px', position: 'relative' }}>
            <InputForm
              type={isShowPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e)} // Cập nhật giá trị password
              style={{ paddingRight: '40px' }}
            />
            <button
              type="button"
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                color: '#007BFF',
              }}
            >
              {isShowPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {/* Trường xác nhận mật khẩu */}
          <div style={{ marginBottom: '5px', position: 'relative' }}>
            <InputForm
              type={isShowConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e)} // Cập nhật giá trị confirm password
              style={{ paddingRight: '40px' }}
            />
            <button
              type="button"
              onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                color: '#007BFF',
              }}
            >
              {isShowConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {/* Hiển thị lỗi nếu có */}
          {mutation.isError && <span style={{ color: 'red' }}>Đăng ký thất bại, vui lòng thử lại</span>}

          {/* Nút Đăng ký */}
          <ButtonComponent
            disabled={!email || !password || !confirmPassword} // Vô hiệu hóa nếu các trường trống
            onClick={handleSignUp}
            size={40}
            styleButton={{
              background: 'rgb(255, 57, 69)',
              height: '48px',
              width: '100%',
              border: 'none',
              borderRadius: '4px',
              margin: '26px 0 10px',
            }}
            textButton={'Đăng Ký'}
            styleTextButton={{ color: '#fff' }}
          />

          <p>
            <WrapperTextLight>Quên mật khẩu?</WrapperTextLight>
          </p>
          <p>
            Bạn đã có tài khoản{' '}
            <WrapperTextLight onClick={() => navigate('/sign-in')}>Đăng Nhập</WrapperTextLight>
          </p>
        </WrapperContainerLeft>

        <WrapperContainerRight>
          <Image src={logosignin} preview={false} alt="image-logo" height="600px" width="300px" />
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default SignUpPage;
