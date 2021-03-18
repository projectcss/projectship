import React from 'react';
import classNames from 'classnames';

export enum ButtonSize {
    Large = 'lg',
    Small = 'sm'
}

export enum ButtonType {
    Primary = 'primary',
    Default = 'default',
    Danger = 'danger',
    Link = 'Link'
}

interface BaseButtonProps {
    classNmae?: string;
    disabled?: boolean;
    size?: ButtonSize;
    btnType?: ButtonType;
    children: React.ReactNode;
    href?: string;
}

type NativeButtonProps = BaseButtonProps & React.ButtonHTMLAttributes<HTMLElement>
type AnchorButtonProps = BaseButtonProps & React.AnchorHTMLAttributes<HTMLElement>
//将所有属性设置为可选属性，避免在a链接上使用button的必须属性
export type ButtonProps =Partial<NativeButtonProps & AnchorButtonProps>
const Button: React.FC<ButtonProps> = (props)=>{
    const {
        btnType,
        size,
        disabled,
        children,
        href,
        //用户自定义class
        className,
        ...resprops
    } = props;
    const classes = classNames('btn', className, {
        [`btn-${btnType}`]: btnType,
        [`btn-${size}`]: size,
        [`disabled`]: (btnType===ButtonType.Link) && disabled
    })

    if(btnType === ButtonType.Link) {
        return <a className={classes} href={href} {...resprops}>{children}</a>
    } else {
        return <button {...resprops} className={classes} disabled={disabled}>{children}</button>
    }
}

Button.defaultProps = {
    disabled: false,
    btnType: ButtonType.Default
}

export default Button;