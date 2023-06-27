import './App.css';
import {useState, useEffect} from 'react';
import sun from './Photo/sun.svg';
import close from './Photo/close.svg'
import {db} from './firebase.js';
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc, getDoc} from 'firebase/firestore';

function App() {

  const [darkTheme, setDarkTheme] = useState(true);
  const [lightTheme, setLightTheme] = useState(false);

  const [sendTodo, setSendTodo] = useState('');
  const [readTodo, setReadTodo] = useState([]);

  const [activeTask, setActiveTask] = useState([]);
  const [completedTask, setCompletedTask] = useState([]);

  const [todo, setTodo] = useState('all')

  const [taskId, setTaskId] = useState('');

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
      time:time,
      completed: false
    })
    setSendTodo('')
  }

  useEffect(() => {
    const q = query(collection(db, 'ToDo'))
    const subscribe = onSnapshot(q, (querySnapshot) => {
      let newArr = []
      querySnapshot.forEach((doc) => {
        newArr.push({...doc.data(), id:doc.id})
      })
      setReadTodo(newArr);
      newArr.sort((a,b) => a.time - b.time).reverse();

      if (newArr.length > 0) {
        setTaskId(newArr[0].id);
      }
    })
    return() => subscribe()
  },[])

  const all = () => {
    setTodo('all')
  }

  const active = async() => {
    setTodo('active')
    const activeTask = readTodo.filter(task => !task.completed)
    setActiveTask(activeTask)
  }

  const complited = () => {
    setTodo('completed')
    const comp = readTodo.filter(task => task.completed)
    setCompletedTask(comp)
  }
  
  const changeStatus = async(taskId) => {
    const getTask = doc(db, 'ToDo', taskId);
    const screen = await getDoc(getTask)

    if(screen.exists()){
      const findTask = readTodo.findIndex(task => task.id === taskId);
      const copyReadToDo = [...readTodo];
      const linkTask = copyReadToDo[findTask];
      linkTask.completed = !linkTask.completed;

      updateDoc(getTask, {
        completed: linkTask.completed
      })

      setReadTodo(copyReadToDo)
    }else{
      return
    }
  }

  const deleteTask = (taskId) => {
    deleteDoc(doc(db, 'ToDo', taskId))
  }

  const deleteActiveTask = (taskActiveDel) => {
    const getTodo = doc(db, 'ToDo', taskActiveDel)
    const getActiveTask = activeTask.findIndex(task => task.id === taskActiveDel);
    if(getActiveTask >= 0){
      const newActiveArr = [...activeTask];
      const linkNewActiveArr = newActiveArr[getActiveTask]
      linkNewActiveArr.completed = !linkNewActiveArr.completed
      newActiveArr.splice(getActiveTask, 1);
      setActiveTask(newActiveArr)
      updateDoc(getTodo, {
        completed: linkNewActiveArr.completed
      })
    }
  }

  const deleteCompletedTask = async (taskDel) => {
    const getCompTaskId = completedTask.findIndex((task) => task.id === taskDel);
    if (getCompTaskId >= 0) {
      const newArrCompTask = [...completedTask];
      newArrCompTask.splice(getCompTaskId, 1);
      setCompletedTask(newArrCompTask);
      await deleteDoc(doc(db, 'ToDo', taskDel));
    }
  };

  const clearCompletedTasks = async () => {
    const allDellCompTask = readTodo.filter(task => task.completed)
    allDellCompTask.forEach(async (task) => {
      await deleteDoc(doc(db, 'ToDo', task.id))
      setCompletedTask([])
    })
  };

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
              {todo === 'all' && (
                <>
                  <div className='dark-all-todo'>
                    {readTodo.map(task => (
                      <div 
                        className={task.completed ? 'dark-todo-complited' : 'dark-todo'}
                        onClick={() => changeStatus(task.id)}
                        >
                        <div className='dark-todo-status'>
                          <div className={task.completed ? 'dark-todo-status-circle-complited' : 'dark-todo-status-circle'}></div>
                        </div>
                        {task.task}
                        <div className='dark-todo-delete'>
                          <img 
                            src={close}
                            onClick={() => deleteTask(task.id)}
                          ></img>
                        </div>   
                      </div>
                    ))}
                  </div>
                </>
              )}

              {todo === 'active' && (
                <>
                  <div className='dark-active-todo'>
                    {activeTask.map(activeTask => (
                      <div 
                        className='dark-todo'
                        onClick={() => deleteActiveTask(activeTask.id)}
                      >
                        <div className='dark-todo-status'>
                          <div className='dark-todo-active-status-circle'></div>
                        </div>
                        {activeTask.task}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {todo === 'completed' && (
                <>
                  <div className='dark-completed-todo'>
                    {completedTask.map((completedTask) => (
                      <div className='dark-todo-complited'>
                        <div className='dark-todo-status'>
                          <div className='dark-todo-status-circle-complited'></div>
                        </div>
                        {completedTask.task}
                        <div className='dark-todo-delete'>
                          <img 
                            src={close}
                            onClick={() => deleteCompletedTask(completedTask.id)}
                          ></img>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className='dark-bottom-menu'>
                <div className='dark-current-todo'>{readTodo.length > 0 ? <p><span className='number'>{readTodo.length}</span> items left</p> : <p>none items left</p>}</div>
                <div className='dark-todo-state'>
                  <div 
                    className={todo === 'all' ? 'all-active' : 'all'} 
                    onClick={all}
                  >All</div>
                  <div 
                    className={todo === 'active' ? 'active-active' : 'active'} 
                    onClick={active}
                  >Active</div>
                  <div 
                    className={todo === 'completed' ? 'completed-active' : 'completed'} 
                    onClick={complited}
                  >Completed</div>
                </div>
                <div 
                  className='dark-todo-clear' onClick={clearCompletedTasks}
                >Clear Completed</div>
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
