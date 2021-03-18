import React from 'react';
import {fireEvent, render, RenderResult, waitFor} from '@testing-library/react';

import Menu, {MenuProps} from './menu';
import MenuItem from './menuitem';
import SubMenu from './subMenu';

const testProps: MenuProps = {
    defaultIndex: '0',
    onSelect: jest.fn(),
    className: 'test'
}

const testVerProps: MenuProps = {
    defaultIndex: '0',
    mode: 'vertical',
    defaultOpenSubMenus: ['4']
}

const NiceMenu = (props: MenuProps) => {
    return (
        <Menu {...props}>
            <MenuItem>
                active
            </MenuItem>
            <MenuItem disabled>
                disabled
            </MenuItem>
            <SubMenu title="dropdown">
                <MenuItem>
                    drop1
                </MenuItem>
            </SubMenu>
            <MenuItem>
                xyz
            </MenuItem>
            <SubMenu title="opened">
                <MenuItem>
                    opened1
                </MenuItem>
            </SubMenu>
        </Menu>
    )
}

const createStyleFile = () => {
    const cssFile: string = `
        .viking-submenu {
            display: none;
        }

        .viking-submenu.menu-opened {
            display: block;
        }
    `

    const style = document.createElement("style")
    // style.type = 'text/css';
    style.innerHTML = cssFile;
    return style;
}

let wrapper:RenderResult, wrapper2:RenderResult, menuElement: HTMLElement, activeElement: HTMLElement, disableElement: HTMLElement
describe("test Menu ans MenuItem component", () => {

    //在每次测试之前都执行该方法
    beforeEach(() => {
       wrapper = render(NiceMenu(testProps));
       menuElement = wrapper.getByTestId("test-menu");
       activeElement = wrapper.getByText("active");
       disableElement = wrapper.getByText("disabled");
       //将css文件插入wrapper
       wrapper.container.append(createStyleFile());
    })
    it("should render corrent Menu and MenuItem based on default props", () => {
        expect(menuElement).toBeInTheDocument();
        expect(menuElement).toHaveClass("viking-menu test");
        // expect(menuElement.getElementsByTagName("li").length).toEqual(3);
        expect(menuElement.querySelectorAll(":scope > li").length).toEqual(5);
        expect(activeElement).toHaveClass("menu-item is-active");
        expect(disableElement).toHaveClass("menu-item is-disabled");
    })

    it("click items should change active ans call the right callback", () => {
        const thirdItem = wrapper.getByText("xyz");
        fireEvent.click(thirdItem);
        expect(thirdItem).toHaveClass("is-active");
        expect(activeElement).not.toHaveClass("is-active");
        expect(testProps.onSelect).toHaveBeenCalledWith('3');
        fireEvent.click(disableElement);
        expect(testProps.onSelect).not.toHaveBeenCalledWith('1');
        expect(activeElement).not.toHaveClass("is-active");
    })

    it('should show dropdown items when hover on subMenu', async () => {
        expect(wrapper.queryByText('drop1')).not.toBeInTheDocument();
        const dropdownElement = wrapper.getByText('dropdown');
        fireEvent.mouseEnter(dropdownElement);
        //这是个异步测试，当鼠标移上去之后300ms之后才会隐藏，但是此时这条语句不会等待300ms，所以需要使用asyns和await方法
        await waitFor(() => {
          expect(wrapper.queryByText('drop1')).toBeVisible();
        })
        fireEvent.click(wrapper.getByText('drop1'));
        expect(testProps.onSelect).toHaveBeenCalledWith('2-0');
        fireEvent.mouseLeave(dropdownElement);
        await waitFor(() => {
          expect(wrapper.queryByText('drop1')).not.toBeVisible();
        })
        fireEvent.mouseLeave(dropdownElement)
        await waitFor(() => {
          expect(wrapper.queryByText('drop1')).not.toBeVisible();
        })
    })
})

describe ("test Menu and MenuItem component in vertical mode", () => {
    beforeEach(() => {
        wrapper2 = render(NiceMenu(testVerProps));
        wrapper2.container.append(createStyleFile());
    })

    it("should render vertical mode when mode is set to vertical", () => {
        const menuElement:HTMLElement = wrapper2.getByTestId("test-menu");
        expect(menuElement).toHaveClass("menu-vertical")
    })

    it("should show dropdown items when click on subMenu for vertical mode", () => {
        const dropdownItem = wrapper2.queryByText("drop1");
        expect(dropdownItem).not.toBeInTheDocument();
        fireEvent.click(wrapper2.getByText("dropdown"));
        expect(dropdownItem).not.toBeInTheDocument();
    })

    it("should show subMenu dropdown when defaultOpenSubMenus contains SubMenu index", () => {
        expect(wrapper2.queryByText("opened1")).toBeVisible();
    })
})