import React from 'react';
import { WrapperLableText, WrapperTextValue, WrapperContent, WrapperTextPrice  } from './style';
import { Checkbox, Col, Flex, Rate, Row } from 'antd';

const NavbarComponent = () => {
  const onChange = () => {}
  const renderContent = (type, options) => {
    switch (type) {
      case 'text':
        return options.map((option, index) => {
           
          return <WrapperTextValue > {option}  </WrapperTextValue >;
          
        });
        case'checkbox' :
          return  (<Checkbox.Group style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }} onChange={onChange}>
            {options. map((options) => {
              return (
                    <Checkbox  value={options.value}>{options.lable}</Checkbox>

              )

            })}
        </Checkbox.Group>)
        case'star' :
        return options. map((option) => {
          console.log('check', option)
            return (
              <div style={{display: 'flex' , gap: '12px'}}>
              <Rate style={{ fontSize: '12px', }} allowHalf defaultValue={option} />
              <span> {`tu ${option} sao`}</span>
              </div>
            )
          
          })
          case'Price' :
          return options. map((option) => {
            console.log('check', option)
              return (
               <WrapperTextPrice>{option}</WrapperTextPrice>
              )
            
            })
      default:
        return null;
    }
  }

  return (
    <div style={{backgroundColor: '#fff'}}>
      <WrapperLableText>Label</WrapperLableText>
      <WrapperContent>
        {renderContent('text', ['giay', 'vi', 'tui sach', 'that lung'])}
        </WrapperContent>
        <WrapperContent>
        {renderContent('checkbox', [
          {value: 'a', lable: "A"},
          {value: 'b', lable: "B"},
        ])}
      </WrapperContent>
      <WrapperContent>
        {renderContent('star', [3, 4, 5])}
      </WrapperContent>
      <WrapperContent>
        {renderContent('Price', ['1.000.000VND', '2.000.000VND', '3.000.000VND'])}
      </WrapperContent>
    </div>
  );
}

export default NavbarComponent;
