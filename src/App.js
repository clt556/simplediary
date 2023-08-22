import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import './App.css';
import DiaryEditor from './DiaryEditor';
import DiaryList from './DiaryList';
import LifeCycle from './LifeCycle';
import OptimizeTest from './OptimizeTest';

const reducer = (state,action) =>{
  switch(action.type){
    case `INIT`:{
      return action.data;
    }
    case `CREATE`:{
      const newItem = {
        ...action.data
      }
      return [newItem,...state];
    }
    case `REMOVE`:{
      return state.filter((it) => it.id !== action.targetId);
    }
    case `EDIT`:{
      return state.map((it)=>it.id ===action.targetId? {...it,content:action.newContent}:it);
    }

    default:{
      return state;
    }
  }
}

/*
  state를 정의하는 방법에는 useState를 사용할 수도 있지만, 
  useReducer를 사용할 수도 있다.

  1.const [state,dispatch] = useReducer(reducer,초기값); 으로 정의한다. reducer는 상태에 대한 action을 정의하는 함수이다.

  2.reducer를 정의하는데, 케이스마다 state가 업데이트되는 방식을 서술한다. 즉 setState가 되는 모든 부분에 대해 서술해야함.

  setState가 되는 기능에서, dispatch를 정의하는데 dispatch에서 type은 reducer의 type, 그리고 전달하는 데이터에 대한 정보를 기입한다.
  그럼 reducer에서, 해당 case에서 전달받은 데이터를 기반으로(reducer에서는 action. 형태로 데이터에 접근) 업데이트할 데이터를 만들어서 return 한다.
*/

export const DiaryStateContext = React.createContext();

export const DiaryDispatchContext = React.createContext();

/*
  React.createContext()를 통해 App.js에서의 데이터들을 전달하는 것을 중앙화할 수 있는듯

  React.creataContext()가 하나의 주머니라고 생각함

  각 주머니는 렌더링에서 태그 형태로 사용하며, 그 태그 안에 value 속성값을 넣어 그 속성값을 태그 안에 존재하는 임의의 컴포넌트에게 전달할 수 있다.

  그 임의의 자식 컴포넌트는, 더이상 prop으로 value에서 건네준 데이터를 받을 필요 없이,

  const {onCreate} = useContext(DiaryDispatchContext);
  와 같이 받아서, 본인의 렌더링에 사용할 수 있다.

  참고로 React.createContext()같은 경우도 컴포넌트이므로 value에 해당하는 데이터는 prop으로 취급함.
  결과적으로 해당 prop이 변하면 컴포넌트가 재생성되고, 이는 해당 context 태그 아래에 있는 모든 컴포넌트의 리렌더링을 초래하므로
  value에 해당하는 파트에 최적화를 먼저 시행한 데이터나 기능을 넣어서 전달해야한다.
*/

function App() {

  //API 호출해보기
  const getData = async()=>{
    const res = await fetch('https://eldenring.fanapis.com/api/creatures?limit=100').then((res)=>res.json());

    const initData = res.data.slice(0,20).map((it)=>{
      return{
        author:it.name + `\n` +it.location,
        content:it.description + `\n` + it.image,
        emotion:Math.floor(Math.random()*5)+1,
        created_date:new Date().getTime(),
        id: dataId.current++,
      }
    })
    dispatch({type:"INIT",data:initData});

    console.log(res);
    console.log(typeof res);
  }
  useEffect(()=>{
    getData();
  },[]);
  

  //const [data,setData] = useState([]);

  const [data,dispatch] = useReducer(reducer, [])

  const dataId = useRef(0);

  const onCreate = useCallback((author, content, emotion) =>{
    dispatch({type:`CREATE`,
    data:{
      author:author,
      content:content,
      emotion:emotion,
      created_date:new Date().getTime(),
      id:dataId.current,
    }})
    
    dataId.current += 1;
  },[])

  /*
  onCreate를 useCallback으로 감싸고 빈 배열을 두번째 인자로 주면, 함수는 처음에만 생성되어 메모리에 올라간다.

  문제는 빈 배열을 전달할 시, 처음 생성된 함수는 data를 null로 가지고 있다. 따라서 null인 data를 가진 함수를 계속 재활용 하게 되므로, 업데이트 시 업데이트한 항목 하나만 계속 리렌더링되고, 기존 데이터를 렌더링하는데 본 함수를 사용할 수 없다.

  그래서 setData((data) => [newItem,...data]); 와 같이 아예 그냥 함수의 기능에 함수형 작업으로 작동하도록 변경해준다.
  그렇게 하면 외부의, 최신의 data를 받아가지고 setData 할 수 있다.
  
  결과적으로 함수는 1회 생성되서 메모리에 올라가고, 함수 기능은 제대로 되는, 최적화가 완료됨.
  */

  const onRemove = useCallback((targetId) => {
    dispatch({type:`REMOVE`,targetId})
    console.log(`${targetId}가 삭제되었습니다.`)
  },[]) 

  const onEdit = useCallback((targetId, newContent) =>{
    dispatch({type:`EDIT`,targetId,newContent})
    
  },[])

  const memoizedDispatches = useMemo(()=>{
    return {onCreate, onRemove, onEdit}
  },[])

  const getDiaryAnalysis = useMemo(
    ()=>{
    console.log("다이어리 데이터 분석 시작");
    const goodCount = data.filter((it) => it.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100;
    return {goodCount, badCount, goodRatio}
  }, [data.length]); 
  //useMemo의 콜백함수로 실행 로직을 넣고, 의존성 배열도 넣음
  //이렇게 할 시, data 상태의 길이가 변할 때에만 getDiaryAnalysis가 실행된다.
  const {goodCount,badCount,goodRatio} = getDiaryAnalysis; //비구조화 할당

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={memoizedDispatches}>
    <div className="App">
      <DiaryEditor/>
      <div>전체일기: {data.length}</div>
      <div>good 무드 개수: {goodCount}</div>
      <div>bac 무드 개수: {badCount}</div>
      <div>good 비율: {goodRatio}</div>
      <OptimizeTest/>
      <DiaryList/>
    </div>
    </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;
