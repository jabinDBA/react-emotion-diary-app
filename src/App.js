import React, { useEffect, useReducer, useRef } from "react";

import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";

import Home from "./pages/Home";
import New from "./pages/New";
import Edit from "./pages/Edit";
import Diary from "./pages/Diary";
import DiaryList from "./components/DiaryList";

// Reducer Fuction
const reducer = (state, action) =>  {
  let newState = [];
  switch(action.type) {
    case 'INIT': {
      return action.data;
    }
    case 'CREATE':{
      newState = [action.data, ...state];
      break;
    }
    case 'REMOVE':{
      newState = state.filter((it) => it.id !== action.targetId);
      break;
    }
    case 'EDIT':{
      newState = state.map((it) => it.id === action.data.id ? {...action.data} : it);
      break;
    }
    default:
      return state;
  }

  localStorage.setItem("diary", JSON.stringify(newState));
  return newState;
};

// Context - prevents props drilling and delivery data & dispatch functions (onCreate, onRemove, onEdit) from the top-level component <App/>
export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

function App() {
  // Define useReducer
  const [data, dispatch] =  useReducer(reducer, []);

  useEffect(() => {
    const localData = localStorage.getItem('diary');
    if(localData){
      const diaryList = JSON.parse(localData).sort((a,b) => parseInt(b.id) - parseInt(a.id));
     
      if(diaryList.length >= 1){
        dataId.current = parseInt(diaryList[0].id) + 1;
        dispatch({type:"INIT", data:diaryList});
      }  
    }
  }, []);

  const dataId = useRef(0);   // Since we have 3 items in the dummy lists, the initial value of the reference is 4

  // Dispatch Functions
  // 1. CREATE
  const onCreate = (date, content, emotion) => {
    dispatch({type:"CREATE",
              data: {
                id: dataId.current,
                date: new Date(date).getTime(),
                content,
                emotion
              }
    });
    dataId.current += 1;
  };
  // 2. REMOVE
  const onRemove = (targetId) => {
    dispatch({type: "REMOVE",targetId});
  }
  // 3. EDIT
  const onEdit = (targetId, date, content, emotion) => {
    dispatch({type:"EDIT",
              data:{
                id: targetId,
                date: new Date(date).getTime(),
                content,
                emotion
              }
      });
  }

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={{onCreate, onRemove, onEdit}}>
        <BrowserRouter>
          <div className="App">
            <Routes>
              <Route path='/' element={<Home/>}/>
              <Route path='/new' element={<New/>}/>
              <Route path='/edit/:id' element={<Edit/>}/>
              <Route path='/diary/:id' element={<Diary/>}/>
            </Routes>
          </div>
        </BrowserRouter>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;