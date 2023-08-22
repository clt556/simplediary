import React, {useState,useEffect} from 'react';

const UnmountTest =  () =>{
    useEffect(()=>{
        console.log(`mounted!#@!#`);
        return ()=>{ console.log(`unmounted!!@!@`)}; 
    },[])
    return <div>Unmount Testing component</div>
}
/*
    의존성 배열이 비어있으니 일회성인데, 만약 <div>Unmount Testing component</div> 이 부분의 렌더링을 조절을 하면, 이는 유용하게 쓰임
    useEffect 내부의 콜백 함수에서 리턴하는 함수는 언마운트 될 때만 실행되고, 그 이외 콜백함수 로직은 마운트 될 때만 실행된다.
    따라서
    console.log(`mounted!#@!#`); 이건 마운트 될 때만 (렌더링 on 시)
    console.log(`unmounted!!@!@`) 얘는 언마운트 될 때만 (렌더링 off시)
    따라서 렌더링 조절에 따른 다른 동작을 구현할 수 있다.
*/


const LifeCycle = () => {
    const [count,setCount] = useState(0);
    const[text,setText] = useState("");
    const[isVisible, setIsVisible] =useState(false);
    const toggle = () =>{
        setIsVisible(!isVisible);
    }
    

    useEffect(()=>{
        console.log("Mounted");
    },[]) //빈 배열의 의존성 배열은 1회성 useEffect를 생성

    useEffect(()=>{
        console.log("count가 바뀌었으므로 실행됨");
        if(count > 5){
            alert(`count가 6입니다. 1로 초기화함`)
            setCount(1);
        }
    },[count]) //count=6이 되는 순간 저 if문이 실행되야하므로, count에 의존해야함

    /*
        useEffect의 빈배열 설정은, 한번만 실행되는거라고 생각하면 됨
        빈 배열 안에 있는 state의 변화마다 실행되는게 useEffect임
        그리고 참고로 2번째 인자가 아무것도 없으면, 그때는 모든 렌더링마다 실행됨
    */ 

    return(
        <div style={{padding: 20}}>
            {count}
            <button onClick={()=>{setCount(count+1)}}>+</button>
            <input value={text} onChange={(e)=>setText(e.target.value)}></input>
            <button onClick={toggle}>on/off</button>
            {isVisible && <UnmountTest/>}
        </div>
    )
}

export default LifeCycle;