import './App.css';
import {useState, usEffect} from 'react';
import sun from './Photo/sun.svg';
import {db} from './firebase.js';

function App() {

  const [darkTheme, setDarkTheme] = useState(true);
  const [lightTheme, setLightTheme] = useState(false);

  const changeTheme = () => {
    if(darkTheme){
      setDarkTheme(false)
      setLightTheme(true)
    }
  }


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
              ></input>
              <div className='add-todo-dark'>+</div>
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
