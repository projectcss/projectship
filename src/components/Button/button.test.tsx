import React from 'react'
import { render, fireEvent} from '@testing-library/react'
import Button, {ButtonProps, ButtonSize, ButtonType} from './button';

const defaultProps = {
    onClick: jest.fn()
}

describe("test Button component", () => {
    it("should render the correct default button", () => {
        const wrapper = render(<Button {...defaultProps}>Nice</Button>);
        const element = wrapper.getByText('Nice') as HTMLButtonElement;
        expect(element).toBeInTheDocument();
        expect(element.tagName).toEqual("BUTTON");
        expect(element).toHaveClass("btn btn-default");
        expect(element.disabled).toBeFalsy();
        fireEvent.click(element);
        expect(defaultProps.onClick).toHaveBeenCalled();
    })

    const testProps: ButtonProps = {
        btnType: ButtonType.Primary,
        size: ButtonSize.Large,
        className: 'klass',
        disabled: true
    }

    it("should render the correct component based on different props", () => {
        const wrapper = render(<Button {...testProps}>Nice</Button>);
        const element = wrapper.getByText('Nice');
        expect(element).toBeInTheDocument();
        //不同的类型测试不同的类
        expect(element).toHaveClass("btn btn-primary btn-lg klass");
        expect(element).toBeDisabled();
    })

    const LinktestProps: ButtonProps = {
        btnType: ButtonType.Link,
        href: "http://www.baidu.com"
    }

    it("should render a link when btnType equals link and href is provided", () => {
        const wrapper = render(<Button {...LinktestProps}>Link</Button>)
        const element = wrapper.getByText('Link');
        expect(element).toBeInTheDocument();
        expect(element.tagName).toEqual("A");
        expect(element).toHaveClass("btn btn-Link");
    })

    const disabledProps = {
        disabled: true,
        onClick: jest.fn()
    }

    it("should render disabled button when disabled set to true", () => {
        const wrapper = render(<Button {...disabledProps}>Nice</Button>);
        const element = wrapper.getByText('Nice') as HTMLButtonElement;
        expect(element).toBeInTheDocument();
        expect(element.disabled).toBeTruthy();
        fireEvent.click(element);
        expect(disabledProps.onClick).not.toHaveBeenCalled();
    })
})
