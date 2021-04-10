import React, { ChangeEvent, useState, KeyboardEvent, useEffect, useRef } from 'react'
import Input from '../Input/input'
import ItemList from './items'
//定义任务的一些状态
export interface TodoProps{
    value:string;
    completed:boolean;
    id:number;
}
const TodoList: React.FC = (props) => {
    const keyId = useRef(100);
    const [countNotCompleted,setCountNotCompleted] = useState(0);
    const [inputValue, setInputValue] = useState<string>('')
    const [todolists, setTodoLists] = useState<TodoProps[]>([{value:'vsrver',completed:false,id:99}])
    //监听输入框的改变，并实现双向绑定
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const item = e.target.value.trim();
        setInputValue(item); 
    }
    //按下回车键加入新的的todo
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if(e.keyCode === 13) {
            if(!inputValue) {
                alert('输入框内容为空！！！');
                return;
            }
            setTodoLists([...todolists,{value:inputValue,completed:false, id:keyId.current}]);
            keyId.current++;
            setInputValue('');
        }
    }
    // 点击checkbox时改变任务的状态
    const handleChangeCompleted = (id: number, completed:boolean) => {
        let newList = todolists.map((item) => {
            return id===item.id? {value:item.value, completed:completed,id:item.id} : item;
        })
        setTodoLists(newList);
    }

    //删除任务
    const handleDeleteList = (id:number) => {
        let newLists:TodoProps[] = todolists.filter((item) => id!==item.id)
        setTodoLists(newLists);
    }

    //删除所有已经完成的任务
    const handleClearAllList = () => {
        let newList: TodoProps[] = todolists.filter((item) => !item.completed)
        setTodoLists(newList);
    }
    useEffect(() => {
        //统计没有完成的任务个数
        let cnt:number = todolists.reduce((sum,item) => {
            return item.completed ? sum+0:sum+1;
        },0)
        setCountNotCompleted(cnt);
    }, [todolists]);
    return (
        <div className="app">
            <div className="cover"></div>
            <header className="app-header">
                <h2>todos</h2>
            </header>
            <section className="section-context">
                <Input 
                    placeholder="What needs to be done?"
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    size="lg"
                />
                <ItemList 
                    todolists={todolists} 
                    handleChangeCompleted={handleChangeCompleted}
                    handleDeleteList={handleDeleteList}
                    countNotCompleted={countNotCompleted}
                    handleClearAllList={handleClearAllList}
                />
            </section>
        </div>
    )
}

export default TodoList;