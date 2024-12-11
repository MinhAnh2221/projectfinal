
import styled from "styled-components";
import { Input, Button, Upload } from "antd";

export const WrapperHeader = styled.h1`
  text-align: center;
  font-size: 2.2rem;
  color: #ff5733";
  padding: 20px 0;
  margin-bottom: 30px;
  border-bottom: 2px solid #e0e0e0;
`;


export const WrapperContentProfile = styled.div`
  width: 1270px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f8f9fa ;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;


export const WrapperLabel = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 1rem;
  color: #333;
`;

export const WrapperInput = styled(Input)`
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  padding: 12px;
  width: 100%;
  font-size: 1rem;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;


export const ButtonUpdate = styled(Button)`
  background-color: #ff5733;
  color: #ffffff;
  border: none;
  font-size: 1rem;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: darken($#ff5733, 10%);
  }
`;
export const WrapperUploadFile = styled(Upload)`
  & .ant-upload.ant-upload-select.ant-upload-select-picture-card{
    width: 60px;
    height: 60px;
    border-radius: 50%
  }
  & .ant-upload-list-item-info{
    display: none
  }
`