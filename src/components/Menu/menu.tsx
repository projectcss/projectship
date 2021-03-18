import React, {createContext, useState} from 'react';
import classNames from 'classnames';
import { MenuItemProps } from './menuitem';

type MenuMode = 'horizontal' | 'vertical'; //横向 | 竖向
type SelectCallback = (selectedIndex: string) => void;

//定义Menu组件prosp数据类型及数据类型
export interface MenuProps {
    defaultIndex?: string;
    className?: string;
    mode?: MenuMode;
    style?: React.CSSProperties;
    onSelect?: SelectCallback;
    defaultOpenSubMenus?: string[];
}

interface IMenuContext {
    index: string;
    onSelect?: SelectCallback;
    mode?: MenuMode;
    defaultOpenSubMenus?: string[];
}

export const MenuContext = createContext<IMenuContext>({index: '0'});

const Menu: React.FC<MenuProps> = (props) => {
    const {defaultIndex, className, mode, style, onSelect, children, defaultOpenSubMenus} = props;
    const classes = classNames('viking-menu', className, {
        'menu-vertical': mode === 'vertical',
        "menu-horizontal": mode !== 'vertical'
    })
    const [currentActive, setActive] = useState(defaultIndex);
    const handleClick = (index: string)=>{
        setActive(index);
        //onSelect为callback或者undefine
        if(onSelect){
            onSelect(index);
        }
    }
    const passContext: IMenuContext = {
        //currentActive是number或者undefine类型，所以不能直接赋值给index
        index: currentActive ? currentActive : '0',
        onSelect: handleClick,
        mode,
        defaultOpenSubMenus
    }
    const renderChildren = () =>{
        return React.Children.map(children, (child, index) => {
            //React node包含很多属性，需要通过断言来指定child为functionComponent
            const childElement = child as React.FunctionComponentElement<MenuItemProps>;
            const { displayName } = childElement.type;
            if(displayName === 'MenuItem' || displayName === "SubMenu") {
                //使用cloneElement给child添加index属性
                return React.cloneElement(childElement, {
                    index:index.toString()
                })
            }else {
                console.error("Warning: Menu has a child which is not a MenuItem")
            }
        })
    }
    return (
        <ul className={classes} style={style} data-testid="test-menu">
            <MenuContext.Provider value={passContext}>
                {renderChildren()}
            </MenuContext.Provider>
        </ul>
    )
}

//定义默认props
Menu.defaultProps = {
    defaultIndex: '0',
    mode: 'horizontal',
    defaultOpenSubMenus: []
}

export default Menu;