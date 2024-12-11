import React, { useState } from 'react';
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style';
import InputForm from '../../components/InputForm/InputForm';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { Image } from 'antd';
import logosignin from '../../assect/images/logosignin.jpg';
import { useLocation, useNavigate } from 'react-router-dom';
import * as UserService from '../../services/UserService'; 
import { jwtTranslate } from "../../ultilis";

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [isShowPassword, setIsShowPassword] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async () => {
    const res = await UserService.loginUser({ email, password });
    if (res?.status === "OK") {

      localStorage.setItem('access_token', res?.data?.access_token)
     
      const user = jwtTranslate(res?.data?.access_token);
      console.log('location', location)
      if(location?.state){
        navigate(location?.state)
      }
      if (user?.isAdmin) {
        navigate("/system/admin");
      } else {
        navigate("/");
      }
    } 
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.53)', height: '100vh' }}>
      <div style={{ width: '800px', height: '450px', borderRadius: '6px', backgroundColor: '#fff', display: 'flex' }}>
        <WrapperContainerLeft>
          <h1>Hello</h1>
          <p>Đăng nhập và tạo tài khoản</p>
          <InputForm 
            style={{ marginBottom: '10px' }} 
            placeholder='abc@gmail.com' 
            value={email} 
            onChange={setEmail} 
          />
          <div style={{ marginBottom: '10px', position: 'relative' }}>
            <InputForm
              type={isShowPassword ? 'text' : 'password'}
              placeholder='password'
              value={password} 
              onChange={setPassword} 
              style={{ paddingRight: '40px' }}
            />
            <button
              type='button'
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
  
          <ButtonComponent
            size={40}
            styleButton={{
              background: 'rgb(255, 57, 69)',
              height: '48px',
              width: '100%',
              border: 'none',
              borderRadius: '4px',
              margin: '26px 0 10px',
            }}
            textButton={'Đăng Nhập'}
            styleTextButton={{ color: '#fff' }}
            onClick={handleLogin} 
          />
           
          <p>
            <WrapperTextLight>Quên mật khẩu?</WrapperTextLight>
          </p>
          <p>
            Chưa có tài khoản{' '}
            <WrapperTextLight onClick={() => navigate('/sign-up')}>Tạo tài khoản</WrapperTextLight>
          </p>
        </WrapperContainerLeft>

        <WrapperContainerRight>
          <Image src={logosignin} preview={false} alt='image-logo' height='450px' width='400px' />
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default SignInPage;
