import styled from "styled-components";
import { Col, Image, InputNumber } from "antd";

export const WrapperStyleImageSmall = styled(Image)`
        height: 64px;
        width: 64px;
`
export const WrapperStyleImageColImage = styled(Col) `
        flex-basics : unset;
        display: flex;
`
export const WrapperStyleNameProduct = styled.h1`
    color: rgb(36, 36, 36);
    font-size: 24px;
    font-weight: 300;
    line-height: 32px;
    word-break: break-word;
    padding: 10px

`
export const WrapperStyleTextSell = styled.span`
    font-size : 15px;
    line-height: 24px;
    color: rgb(120, 120, 120);

`
export const WrapperPriceProduct = styled.div`
    background: rgb(250, 250, 250);
    border-radius: 4px;



`
export const WrapperPriceTextProduct = styled.h1`
    font-size: 32px;
    line-height: 40px;
    margin-right: 8px;
    font-weight:500;
    padding: 10px;
    margin-top: 10px;
`
export const WrapperAddressProduct = styled.div`
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  background-color: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-top: 10px;
  text-align: justify;
  word-wrap: break-word;
   
`
export const WrapperSizeProduct = styled.h1`
    display: flex;
    gap: 4px;
    align-items: center;
    width: 120px;
    border: 1px solid #ccc;
    border-radius: 4px
`

export const WrapperInputNumber = styled(InputNumber)`
    &.ant-input-number.ant-input-number-sm{
        width: 60px;
        border-top: none;
       boder-bottom: none;
    }
`
