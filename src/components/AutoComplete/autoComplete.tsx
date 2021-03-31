import React, { ChangeEvent, useState,ReactElement, useEffect, KeyboardEvent, useRef} from 'react'
import Input, { InputProps } from '../Input/input'
import  Icon from '../../components/Icon/icon'
import useDebounce from '../../../src/hooks/useDebounce'
import classNames from 'classnames'
import useClickOutside from '../../../src/hooks/useClickOutside'
import Transition from '../Transition/transition'

interface DataSourceObject{
    value: string;
}

export type DataSourceType<T = {}> = T & DataSourceObject;

//因为input组件上自带有onSelect属性，所以必须要使用omit忽略掉该属性才能重新定义
export interface AutoCompleteProps extends Omit<InputProps, 'onSelect'> {
    fetchSuggestions: (str: string) => DataSourceType[] | Promise<DataSourceType[]>;
    onSelect?: (item: DataSourceType) =>void;
    renderOption?: (item : DataSourceType) => ReactElement
}

const AutoComplete: React.FC<AutoCompleteProps> = (props) => {
    const {
      fetchSuggestions,
      onSelect,
      value,
      renderOption,
      ...restProps
    } = props
    const [inputValue, setInputValue] = useState(value)
    const [suggestions, setSuggestions] = useState<DataSourceType[]>([])
    const [loading,setLoading] = useState(false)
    const debouncedValue= useDebounce(inputValue,500)
    const [highlightIndex,setHighlightIndex] = useState(-1)
    const triggerSearch = useRef(false)
    const [ showDropdown, setShowDropdown] = useState(false)
    const compomemtRef = useRef<HTMLDivElement>(null)
    useClickOutside(compomemtRef, ()=>{setSuggestions([])})
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const item = e.target.value.trim();
        setInputValue(item);
        triggerSearch.current=true;
    }
    const handleSelect = (item: DataSourceType) => {
        setInputValue(item.value)
        setShowDropdown(false)
        if(onSelect) {
            onSelect(item)
        }
        triggerSearch.current=false;
    }
    const highlight = (index: number) => {
        if(index < 0){
            index = 0;
        }
        if(index >= suggestions.length){
            index = suggestions.length - 1;
        }
        setHighlightIndex(index);
    }
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        switch (e.keyCode) {
            case 13:
                if(suggestions[highlightIndex]){
                    handleSelect(suggestions[highlightIndex])
                }
                break;
            case 38:
                highlight(highlightIndex - 1)
                break;
            case 40:
                highlight(highlightIndex + 1)
                break;
            case 27:
                setShowDropdown(false)
                break;
            default:
                break;
        }
    }
    const renderTemplate = (item: DataSourceType) => {
        return renderOption? renderOption(item) : item.value
    }

    useEffect(()=>{
        if (debouncedValue&&triggerSearch.current) {
            setSuggestions([])
            const result = fetchSuggestions(debouncedValue);
            if(result instanceof Promise){
                setLoading(true)
                result.then((res)=>{
                    setLoading(false)
                    setSuggestions(res);
                    if (res.length > 0) {
                        setShowDropdown(true)
                    }
                })
            }else{
                setSuggestions(result);
                setShowDropdown(true)
                if (result.length > 0) {
                    setShowDropdown(true)
                } 
            }
        } else {
            setShowDropdown(false)
        }
        setHighlightIndex(-1)
    },[debouncedValue,fetchSuggestions])
    // console.log(suggestions)
    const generateDropdown = () => {
        return (
            <Transition
                in={showDropdown || loading}
                animation="zoom-in-top"
                timeout={300}
                onExited={() => {setSuggestions([])}}
            >
                <ul className="viking-suggestion-list">
                    {
                        loading&&
                        <div className="suggstions-loading-icon">
                            <Icon icon="spinner" spin/>
                        </div>
                    }
                    {
                        suggestions.length>0?suggestions.map((item, index) => {
                            const cnames = classNames('suggestion-item', {
                                'is-active': index === highlightIndex
                            })
                            return (
                                <li className={cnames} key={index} onClick={() => {handleSelect(item)}}>
                                    {renderTemplate(item)}
                                </li>
                            )
                        }):''
                    }
                    {
                        suggestions.length===0&&!loading&&triggerSearch&&
                        <div className="nothave-suggestions">
                            <p>暂无数据</p>
                        </div>
                    }
                </ul>
            </Transition>
        )
    }
    return (
        <div className="viking-auto-complete" ref={compomemtRef}>
            <Input
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            {...restProps}
            />
           {generateDropdown()}
        </div>
    )
}

export default AutoComplete