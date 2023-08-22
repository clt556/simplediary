import React,{ useContext, useRef, useState } from "react"
import ReactLinkify from "react-linkify";
import { DiaryDispatchContext } from "./App";

const DiaryItem = ({author, content, created_date, emotion,id}) => {
    const {onRemove,onEdit} = useContext(DiaryDispatchContext);
    const handleRemove = () => {
        if(window.confirm(`${id} 번째 일기를 정말 삭제하시겠습니까?`)){onRemove(id)};
    }

    const[localContent, setLocalContent] = useState(content);

    const[isEdit, setIsEdit] = useState(false);
    const toggleIsEdit = () => {
        setIsEdit(!isEdit);
    }

    const handleQuitEdit = () => {
        setIsEdit(false);
        setLocalContent(content);
    }

    const localContentInput = useRef();
    const handleEdit = () => {
        
        if(localContent.length < 5){
            localContentInput.current.focus();
            return;
        }

        if(window.confirm(`${id}번 째 일기의 내용을 수정하시겠습니까?`)){
            onEdit(id, localContent);
            toggleIsEdit();
        }
    }


    return <div className="DiaryItem">
        <div className="info">
            <span>작성자: {author} | 감정점수: {emotion}</span>
            <br></br>
            <span className="date">{new Date(created_date).toLocaleString()}</span>
        </div>
        <div className="content">
            <ReactLinkify>
            {isEdit ? <>
                <textarea ref={localContentInput} value={localContent} onChange={(e)=>setLocalContent(e.target.value)}></textarea>
            </> : <>{content}</>}
            </ReactLinkify>
        </div>
        {isEdit ? <>
            <button onClick={handleEdit}>완료</button>
            <button onClick={handleQuitEdit}>취소</button>
        </> : <>
            <button onClick={handleRemove}>삭제</button>
            <button onClick={toggleIsEdit}>수정</button>
        </>
        }
        
    </div>
}

export default React.memo(DiaryItem);