import React, {useContext, useState} from 'react';
import classNames from 'classnames';
import { MenuContext } from './menu';
import { MenuItemProps } from './menuitem'
import { CSSTransition } from 'react-transition-group'
import Icon from '../Icon/icon';
import Transition from '../Transition/transition'

export interface SubMenuProps {
    index?: string;
    title: string;
    className?: string;
}

const SubMenu: React.FC<SubMenuProps> = ({index, title, children, className}) => {
    const context = useContext(MenuContext);
    const openedSubMenus = context.defaultOpenSubMenus as Array<string>;
    const isopened = (index && context.mode === "vertical")? openedSubMenus.includes(index) : false;
    const [menuOpen, setOpen] = useState(isopened);
    const classes = classNames("menu-item submenu-item", className, {
        "is-active": context.index === index,
        "is-vertical": context.mode === "vertical",
        "is-opened": menuOpen
    })
    //定义点击触发的事件
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setOpen(!menuOpen);
    }

    //定义鼠标移动事件
    let timer: any;
    const handleMouse = (e: React.MouseEvent, toggle: boolean) => {
        clearTimeout(timer);
        e.preventDefault();
        timer = setTimeout(() => {
            setOpen(toggle);
        },300)
    }
    
    //根据条件添加点击事件
    const clickEvents = context.mode === 'vertical' ? {
        onClick: handleClick
    } : {}

    //根据条件添加鼠标移动事件
    const hoverEvent = context.mode !== 'vertical' ? {
        onMouseEnter: (e: React.MouseEvent) => { handleMouse(e, true) },
        onMouseLeave: (e: React.MouseEvent) => { handleMouse(e,false) }
    } : {}
    const renderChildren = () => {
        const subMenuClasses = classNames("viking-submenu", {
            "menu-opened": menuOpen
        })
        const childElementComponent = React.Children.map(children, (child, i) => {
            const childElement = child as React.FunctionComponentElement<MenuItemProps>;
            const { displayName } = childElement.type;
            if(displayName === 'MenuItem'){
                return React.cloneElement(childElement, {
                    index: `${index}-${i}`
                })
            }else {
                console.error("Warning: SubMenu has a child which is not a MenuItem component")
            }
        })
        //利用unmountOnExit来控制child的显示和隐藏
        return (
            <Transition
            in={menuOpen}
            timeout={300}
            animation="zoom-in-top"
            >
                <ul className={subMenuClasses}>
                    {childElementComponent}
                </ul>
            </Transition>
        )
    }
    return(
        <li key={index} className={classes} {...hoverEvent}>
            <div className={'submenu-title'} {...clickEvents}>
                {title}
                <Icon icon="angle-down" className="arrow-icon"/>
            </div>
            {renderChildren()}
        </li>
    )
}

SubMenu.displayName = "SubMenu";
export default SubMenu;