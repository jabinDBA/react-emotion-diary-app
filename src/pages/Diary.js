import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DiaryStateContext } from "../App";
import MyButton from "../components/MyButton";
import MyHeader from "../components/MyHeader";

import { getStringDate } from "../util/date";
import { emotionList } from "../util/emotion";

const Diary = () => {

    const navigate = useNavigate();
    const {id} = useParams();
    const diaryList = useContext(DiaryStateContext);
    const [data, setData] = useState();

    useEffect(() => {
        const titleElement = document.getElementsByTagName('title')[0];
        titleElement.innerHTML = `Your Diary #${id}`;
    }, []);

    useEffect(()=>{
        if(diaryList.length >= 1){
            const targetDiary = diaryList.find(
                (it) => parseInt(it.id) === parseInt(id)
            );
            console.log(targetDiary);
            if(targetDiary){
                setData(targetDiary);
            } else {
                navigate("/", {replace:true});
            }
        }
    }, [diaryList, id])

    if(!data){
        return <div className="DiaryPage"> Loading... </div>
    } else {

        const curEmotionData = emotionList.find(
            (it) => parseInt(it.emotion_id) === parseInt(data.emotion)
        );
        console.log(curEmotionData);

        return (
            <div className="DiaryPage">
                <MyHeader 
                    headText={`${getStringDate(new Date(data.date))}`}
                    leftChild={
                        <MyButton text={"< Back"} onClick={() => navigate(-1)}/>
                    }
                    rightChild={
                        <MyButton text={"Edit"} onClick={() => navigate(`/edit/${data.id}`)} />
                    }
                />
                <article>
                    <section>
                        <h4>Today's Emotion</h4>
                        <div className={["diary_img_wrapper", `diary_img_wrapper_${data.emotion}`].join(" ")}>
                            <img src={curEmotionData.emotion_img} />
                            <div className="emotion_descript">
                                {curEmotionData.emotion_descript}
                            </div>
                        </div>
                    </section>
                    <section>
                        <h4>Today's Content</h4>
                        <div className="diary_content_wrapper">
                            <p>{data.content}</p>
                        </div>
                    </section>
                </article>
            </div>
        )
    }
}

export default Diary;