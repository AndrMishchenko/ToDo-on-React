import './App.css';
import {useState, usEffect, useEffect} from 'react';
import sun from './Photo/sun.svg';
import {db} from './firebase.js';
import { addDoc, collection, onSnapshot, query } from 'firebase/firestore';

function App() {

  const [darkTheme, setDarkTheme] = useState(true);
  const [lightTheme, setLightTheme] = useState(false);

  const [sendTodo, setSendTodo] = useState('');
  const [readTodo, setReadTodo] = useState([])

  const time = new Date().getTime();

  const changeTheme = () => {
    if(darkTheme){
      setDarkTheme(false)
      setLightTheme(true)
    }
  }

  const send = async() => {
    if(sendTodo === ''){
      alert('enter task')
    }else await addDoc(collection(db, 'ToDo'), {
      task:sendTodo,
      time:time
    })
    setSendTodo('')
  }

  useEffect(() => {
    const q = query(collection(db, 'ToDo'))
    const subscribe = onSnapshot(q, (querySnapshot) => {
      let newArr = []
      querySnapshot.forEach((doc) => {
        newArr.push({...doc.data()})
      })
      setReadTodo(newArr);
      newArr.sort((a,b) => a.time - b.time).reverse()
    })
    return() => subscribe()
  },[])

  return (
    <>
      {darkTheme && (
        <>
        <div className='dark-theme-wrapper'>
          <div className='dark-theme-img'></div>
          <div className='dark-theme-mob-img'></div>
          <div className='dark-theme-todo-wrapper'>
            <div className='dark-theme-todo-wrapper-titel'>
              <p className='dark-theme-todo-wrapper-titel-text'>TODO</p>
              <img className='dark-theme-todo-wrapper-titel-img' onClick={changeTheme} src={sun}></img>
            </div>
            <div className='dark-theme-block-input'>
              <div className='dark-theme-block-input-status'>
                <div className='status-circle'></div>
              </div>
              <input 
                className='dark-theme-input'
                value={sendTodo}
                onChange={(e) => setSendTodo(e.target.value)}
              ></input>
              <div 
                className='add-todo-dark'
                onClick={send}  
              >+</div>
            </div>
            <div className='todo-task'>
              {readTodo.map(task => (
                <div className='task'>{task.task}</div>
              ))}
            </div>
          </div>
        </div>
        </>
      )}

      {lightTheme && (
        <>
        
        </>
      )}
    </>
    
  );
}

export default App;
