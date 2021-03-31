import React, { useState } from 'react';
import Button, {ButtonSize, ButtonType} from './components/Button/button';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import Menu from './components/Menu/menu';
import MenuItem from './components/Menu/menuitem'; 
import SubMenu from './components/Menu/subMenu';
import Transition from './components/Transition/index'
import Input from './components/Input/index'
import axios from 'axios'
library.add(fas);
function App() {
  const [show,setShow] = useState(false);
  return (
    <div className="App">
      <div onClick={()=>{
        axios.get('https://jsonplaceholder.typicode.com/todos/1').then((res)=>{
          console.log(res.data)
        })
        console.log(1)
      }}>
        click
      </div>
      <header className="App-header">
        <Input
          style={{width: '400px'}}
          placeholder="placeholder"
          icon="search"
          // prepend="https"
          // append=".com"
        />

        <Menu  
          // mode="vertical"
          defaultIndex={'0'} 
          onSelect={(index) => { console.log(index) }}
          defaultOpenSubMenus={['2']}
          >  
          <MenuItem>
            cool link
          </MenuItem>
          <MenuItem  disabled>
            cool link 2          
          </MenuItem>
          <SubMenu title={"shop"}>
            <MenuItem>
              sub cool link
            </MenuItem>
            <MenuItem>
              sub cool link 2          
            </MenuItem>
          </SubMenu>
          <MenuItem>
            cool link 3
          </MenuItem>
        </Menu>
        <Button onClick={() => { console.log(1) }}>Hello</Button>
        <Button disabled={true}>Disabled Button</Button>
        <Button onClick={()=>setShow(!show)} btnType={ButtonType.Primary} size={ButtonSize.Large}>Large Primary</Button>
        <Button btnType={ButtonType.Danger} size={ButtonSize.Small}>Small Danger</Button>
        <Button btnType={ButtonType.Link} href='http://www.baidu.com'>Baidu Link</Button>
        <Button btnType={ButtonType.Link} disabled={true}>Disabled Link</Button>
        <Transition
          in={show}
          timeout={300}
          animation="zoom-in-left"
        >
          <div>
          <p>
            Edit<code>src/App.tsx</code>and  save yo relode
          </p>
          <p>
            Edit<code>src/App.tsx</code>and  save yo relode
          </p>
          <p>
            Edit<code>src/App.tsx</code>and  save yo relode
          </p>
          <p>
            Edit<code>src/App.tsx</code>and  save yo relode
          </p>
          <p>
            Edit<code>src/App.tsx</code>and  save yo relode
          </p>
          </div>
        </Transition>
      </header>
    </div>
  );
}

export default App;
