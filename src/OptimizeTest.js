import React, { useEffect, useState } from "react";

const Textview = React.memo(({text}) => {
    useEffect(()=>{
        console.log("TextView 호출");
    })
    return <div>{text}</div>
})

/*React.memo() 안에 기능(함수)을 넣으면, 그 함수의 parameter(props)가 변할 때만 React.memo인 컴포넌트가 리렌더링된다. */

const areEqual = (prevProps, nextProps)=>{
    if(prevProps.obj.count === nextProps.obj.count)return true;
    
    return false;
}

/* React.memo는 강화된 컴포넌트를 만든다. 여기에는 두개의 parameter가 설정으로 들어가는데, 첫번째는 함수, 두번째는 의존함수이다

첫번째는 최적화 대상 기능으로써, 그 함수가 받는 props가 setState에 의해 상태가 변할때에만 해당 기능을 수행하는 강화 컴포넌트가 리렌더링 된다.

두번째로는, React.memo의 props가 얕은 비교를 하는 대상에 대해서만 동작하는 특성에 대해 사용자 설정을 가하기 위해 사용된다.
props가 기본적으로 string이나 number라면 제대로 동작하지만, 객체나 배열의 경우 props로 넘겨지는 순간 새로운 객체나 배열이 new 되어서 전달되므로, 매 순간 새로운 상태가 생긴 것으로 연산되어 강화 컴포넌트가 매번 리렌더링된다.

따라서 areEqual와 같은, 깊은 비교를 수행하는 함수를 만들어 React.memo의 두번째 인자로 주면, 깊은 비교를 수행하는 props를 받아도 React.memo가 해당 props로 무언가 기능하는 컴포넌트를 최적화 할 수 있다.
*/

const Countview = React.memo(({count}) => {
    useEffect(()=>{
        console.log("CountView 호출");
    })
    return <div>{count}</div>
})



const OptimizeTest = () =>{
    const [count,setCount] = useState(1);
    const[text,setText] = useState("");
    const [obj, setObj] =useState({
        count:1,
    }) //객체는 깊은 비교를 해야함 만약 비교할거면

    return(
        <div style={{padding: 50}}> 
            <div>
                <h2>Count</h2>
                <Countview count={count}></Countview>
                <button onClick={()=>{setCount(count+1)}}>+</button>
            </div>
            <div>
                <h2>Text</h2>
                <Textview text = {text}></Textview>
                <input value={text} onChange={(e)=>{setText(e.target.value)}}/>
            </div>
        </div>
    ) 
}

export default OptimizeTest;

//컴포넌트 재사용에 대한 실습용 컴포넌트