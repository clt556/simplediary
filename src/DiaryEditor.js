import React, { useContext, useEffect } from "react";
import { useState, useRef } from "react";
import { DiaryDispatchContext } from "./App";

const DiaryEditor = React.memo(() => {
    useEffect(()=>{console.log(`DiaryEditor 렌더됨`)})

    const {onCreate} = useContext(DiaryDispatchContext);
    const authorInput = useRef();
    const contentInput = useRef();

    const [state,setState] = useState({
        author:"",
        content:"",
        emotion: 1,
    })

    const [showHintAuthor, setShowHintAuthor] = useState(false);
    const handleFocusAuthor = () => {
        setShowHintAuthor(true);
    }
    const handleBlurAuthor =  () => {
        setShowHintAuthor(false);
    }

    const handleChangeState =  (e) => {
        setState({
            ...state,
            [e.target.name] : e.target.value,
        })

    }

    const [showHintContent, setShowHintContent] = useState(false);
    const handleFocusContent = () => {
        setShowHintContent(true);
    }
    const handleBlurContent =  () => {
        setShowHintContent(false);
    }


    const handleSubmit = () => {
        if(state.author.length < 1){
            authorInput.current.focus();
            return;
        }
        if(state.content.length < 5){
            contentInput.current.focus();
            return;
        }

        onCreate(state.author, state.content, state.emotion);
        setState({
            author:"",
            content:"",
            emotion:1,
        })

        alert("저장 성공");
    }

    return(
        <div className="DiaryEditor">
            <h2>오늘의 일기</h2>
            <div>
                <input 
                ref={authorInput}
                name = "author"
                value={state.author} 
                onChange={handleChangeState}
                onFocus={handleFocusAuthor}
                onBlur={handleBlurAuthor}
                />
                <br/>
                {showHintAuthor && state.author.length < 1 &&<span id="alarm">(1글자 이상 입력하시오)</span>}
            </div>
            <div>
                <textarea
                ref={contentInput}
                name = "content"
                value={state.content}
                onChange={handleChangeState}
                onFocus={handleFocusContent}
                onBlur={handleBlurContent}
                />
                <br/>
                {showHintContent && state.content.length < 5 &&<span id="alarm">(5글자 이상 입력하시오)</span>}
            </div>
            <div>
                <select
                name = "emotion"
                value ={state.emotion}
                onChange={handleChangeState}
                >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                </select>
            </div>
            <div>
                <button
                onClick={handleSubmit}
                >
                    저장
                </button>
            </div>
            
        </div>
    )
})

export default DiaryEditor;

/* 최적화를 수행할 때, export default React.memo(DiaryEditor) 와 같이 작성해도 상관없음*/