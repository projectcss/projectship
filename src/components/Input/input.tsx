import React, {ReactElement, ChangeEvent, InputHTMLAttributes} from 'react'
import classNames from 'classnames'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import Icon from '../Icon/icon'

type InputSize = 'lg' | 'sm';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLElement>, 'size' > {
    
    /**是否禁用 Inpnt */

    disabled?: boolean;

    /**设置input大小，支持的是lg或者是sm */

    size?: InputSize;

    /**添加图标，在右侧添加一个图标用于提示 */

    icon?: IconProp;

    /**添加前缀，用于配置一些固定的组合 */

    prepend?: string | ReactElement;

    /**添加后缀 用于配置一些固定组合 */

    append?: string | ReactElement;

    /**监听键盘输入，触发回调函数 */

    onChange?: (e: ChangeEvent<HTMLInputElement>) =>void;
}

/**
 * Input 输入框 通过鼠标或键盘输入内容，是最基础的表单域的包装。
 * 
 * ~~~js
 * // 这样引用
 * import { Input } from 'vikingship'
 * ~~~
 * 支持 HTMLInput 的所有基本属性
 */

const Input: React.FC<InputProps> = (props) => {
    const {
        disabled,
        size,
        icon,
        prepend,
        append,
        style,
        ...restProps
    } = props
    const cname = classNames('viking-input-wrapper', {
        [`input-size-${size}`]: size,
        'is-disable': disabled,
        'input-group': prepend || append,
        'input-group-append': !!append,
        'input-group-prepend': !!prepend
    })
    const fixControlledValue = (value: any) => {
        if(typeof value === 'undefined' || value === null) {
            return '';
        }
        return value;
    }

    if('value' in props) {
        delete restProps.defaultValue;
        restProps.value = fixControlledValue(props.value);
    }
    return (
        <div className={cname} style={style}>
            {prepend && <div className="viking-input-group-prepend">{prepend}</div>}
            {icon && <div className="icon-wrapper"><Icon icon={icon} title={`title-${icon}`}/></div>}
            <input
                disabled={disabled}
                className="viking-input-inner"
                {...restProps}
            />
            {append && <div className="viking-input-group-append">{append}</div>}
        </div>
    )
}
Input.defaultProps={
    disabled: false,
}

export default Input;