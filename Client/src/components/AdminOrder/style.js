import styled from "styled-components";
import { Upload } from "antd";
export const WrapperHeader = styled.h1 `
    color: #000;
    font-size: 14px;
    
` 
export const WrapperUploadFile = styled(Upload)`
  & .ant-upload-list {
    display: none;
  }
  & .ant-upload-list-text {
    display: none;
  }
  display: flex;
  flex-direction: column;
`;
