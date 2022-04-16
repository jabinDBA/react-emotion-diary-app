import { useNavigate } from "react-router-dom";
import { useState, useRef, useContext, useEffect, useCallback } from "react";

import {DiaryDispatchContext} from './../App';

import MyHeader from "./MyHeader";
import MyButton from "./MyButton";
import EmotionItem from "./EmotionItem";

import { getStringDate } from "../util/date";
import { emotionList } from "../util/emotion";


const DiaryEditor = ({isEdit, originData}) => {
    const contentRef = useRef();
    const [content, setContent] = useState("");
    const [emotion, setEmotion] = useState(3);
    const [date, setDate] = useState(getStringDate(new Date()));
    const navigate = useNavigate();

    const {onCreate, onEdit, onRemove} = useContext(DiaryDispatchContext);

    const handleClickEmotion = useCallback((emotion) => {
        setEmotion(emotion);
    }, []);

    const handleSubmit = () => {
        if(content.length < 1){
            contentRef.current.focus();
            return;
        }

        if(window.confirm( isEdit ? "Would you like to edit the diary?" : "Would you like to create a new diary?" )) {
            if(!isEdit){
                onCreate(date, content, emotion);
            } else {
                onEdit(originData.id, date, content, emotion);
            }
        }
        navigate('/', {replace: true});
    }

    const handleRemove = () => {
        if(window.confirm("Would you like to delete this diary?")){
            onRemove(originData.id);
            navigate("/", {replace:true});
        }
    }

    useEffect(()=>{
        if(isEdit){
            setDate(getStringDate(new Date(parseInt(originData.date))));
            setEmotion(originData.emotion);
            setContent(originData.content);
        }
    }, [isEdit, originData]);

    return (
        <div className="DiaryEditor">
            <MyHeader 
                headText={ isEdit ? "Edit a Diary" : "New Diary"} 
                leftChild={<MyButton text={"< Back"} onClick={()=>navigate(-1)} />}
                rightChild={ isEdit && (<MyButton text={"Delete"} type={"negative"} onClick={handleRemove}/>)} 
            />
            <div>
                <section>
                    <h4>Today's Date</h4>
                    <div className="input_box">
                        <input className="input_date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            type="date" 
                        />
                    </div>
                </section>
                <section>
                    <h4>Today's Emotion</h4>
                    <div className="input_box emotion_list_wrapper">
                        {emotionList.map((it) => (
                            <EmotionItem 
                                key={it.emotion_id} 
                                {...it} 
                                onClick={handleClickEmotion}
                                isSelected={it.emotion_id === emotion}
                            />
                        ))}
                    </div>
                </section>
                <section>
                    <h4>Today's Content</h4>
                    <div className="input_box text_wrapper">
                            <textarea
                                placeholder="How's your day?"
                                ref={contentRef}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                    </div>
                </section>
                <section>
                    <div className="control_box">
                            <MyButton text={"Discard"} onClick={() => navigate(-1)}/>
                            <MyButton text={"Complete"} type={"positive"} onClick={handleSubmit}/>
                    </div>
                </section>
            </div>
        </div>
    )
};

export default DiaryEditor;