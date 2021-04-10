import React, { ChangeEvent, useEffect, useState } from 'react'
import {TodoProps} from './todolist'
export interface ItemListProps{
    todolists: TodoProps[];
    handleChangeCompleted: (index:number, completed:boolean) => void;
    handleDeleteList: (index:number) => void;
    countNotCompleted:number;
    handleClearAllList: () => void;
}

const ItemList: React.FC<ItemListProps> = (props) => {
    const {
        todolists,
        handleChangeCompleted,
        handleDeleteList,
        countNotCompleted,
        handleClearAllList
    } =props; 
    const [states] = useState(['all', 'active', 'completed']);
    const [filter, setFilter] = useState<string>('all');
    const [showTodoList, setShowTodoList] = useState<TodoProps[]>(todolists)
    //删除任务
    const handleDelete = (id:number) => {
        handleDeleteList(id)
    }

    //改变checkbox状态
    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>, id: number) => {
        handleChangeCompleted(id,e.target.checked)
    }
    //点击修改states状态
    const handleChangeState = (state: string) => {
        setFilter(state);
        let newList: TodoProps[] = [];
        switch (state) {
            case 'all':
                newList = todolists;
                break;
            case 'active':
                newList = todolists.filter((item) => !item.completed);
                break;
            case 'completed':
                newList = todolists.filter((item) => item.completed);
                break;
        }
        setShowTodoList(newList);
    }
    //删除所有已完成任务
    const clearAllCompleted = () => {
        handleClearAllList()
    }
    useEffect(() => {
        setShowTodoList(todolists);
        handleChangeState(filter);
    },[todolists])
    return (
        <div className="item-wrapper">
            <div className="item-main">
                {
                    showTodoList.length>0?
                    showTodoList.map((item) => {
                        return (
                            <section className={`${"todo-item"} ${item.completed?"completed":''}`} key={item.id}>
                                <input 
                                    type="checkbox" 
                                    className="toggle" 
                                    onChange={(e) => {handleCheckboxChange(e,item.id)}}
                                    checked={item.completed}    
                                />
                                <label>{item.value}</label>
                                <span className="destroy" onClick={() => {handleDelete(item.id)}}></span>
                            </section>
                        )
                    })
                    :
                    <div className="nothave-suggestions">
                        <p>暂无数据</p>
                    </div>
                }
            </div>
            <footer className="action-item">
                <span className="left">{countNotCompleted} items length</span>
                <span className="tabs">
                    {
                        states.map((item,index) => {
                            return (
                                <span 
                                    key={index} 
                                    className={`${"state"} 
                                    ${filter === item?'actived':'' }`}
                                    onClick={() => {handleChangeState(item)}}
                                >
                                    {item}
                                </span>
                            )
                        })
                    }
                </span>
                <span className="clear" onClick={clearAllCompleted}>
                Clear Completed
                </span>
            </footer>
        </div>
    )
} 
export default ItemList;