import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { sendMessage } from "./messageAPI"

export default function Thread({user, setUser, userDict}){

    const baseURL = process.env.REACT_APP_API_BASE_URL;
    const messageRef = useRef();
    const navigate = useNavigate();
    const [ text, setText ] = useState("");

    const { collid } = useParams(); //id of collocutor
    const [ thread, setThread ] = useState([]);
    const [collocutorName, setCollocutorName] = useState("");

    useEffect(() => {
        if (userDict[collid]) {
            setCollocutorName(userDict[collid]);
        }
    }, [collid, userDict]);

    useEffect(() => {
        filterThread();
    }, []);

    async function filterThread(){
        //get alle nachrichten from api + filter nach konversation zw userid und collid:
        await axios.get(`${baseURL}/nachrichten`)
                    .then((response) => {
                        const filteredArr = response.data.filter((inst) => 
                                (inst.von === user["_id"] && inst.an === collid) || (inst.von === collid && inst.an === user["_id"]))  //und dann sort by date!!
                        setThread(filteredArr)
                    })
                    .catch((err) => {
                        if (err.response) {
                            console.log(err.response.data);
                            alert(err.response.data);
                          }
                    })
    }


    async function handleSubmit(e) {
        e.preventDefault();  
        if (text.length === 0) {
        alert("Schreib doch lieber was!");
        return;
        }
        try {
            await sendMessage(user._id, collid, text);
            alert("Nachricht wurde gesendet.");
            window.location.reload();
        } catch (error) {
                if (error.response) {
                console.log(error.response.data);
                alert(error.response.data);
                }
        }
        messageRef.current.value = "";
        navigate(`/nachrichten/aktuellerthread/${collid}`);
        //update user object:
        const URL = `${baseURL}/users/${user._id}`;
        console.log(URL)
        await axios.get(URL)
        .then(function (response) {
                console.log(response.data);
                localStorage.setItem("user", JSON.stringify(response.data))
                setUser(response.data);
              })
        .catch((error) => {
            if (error.response) {
                // Axios error with a response
                console.log(error.response.data);
                alert(error.response.data);
              }
        });
    }

    async function deleteMessage(e, messageid){
        e.preventDefault();
        try{
            await axios.delete(`${baseURL}/nachrichten/${messageid}`)
            .then(() => window.location.reload());
        }
        catch(error){
            if (error.response) {
                // Axios error with a response
                console.log(error.response.data);
                alert(error.response.data);
              } else {
                // Non-Axios error without a response
                console.log("An error occurred:", error.message);
                alert("An error occurred. Please try again.");
              }
        }
        //nachrichten erneut einholen:
        filterThread(); //?
    }

    return(
    <div className="thread container">
        {thread.length > 0 && <><h2>{collocutorName? "Mit " + collocutorName : "Thread"}</h2>
        <div className="konversation">
            <div className="alte-nachrichten">
                    {thread.map((item, i) => 
                        <div {...(item.von === user["_id"] ? {className:"nachricht mine"} : {className: "nachricht theirs"})} key={i}>
                            <span className="datum-tag">
                                {item.datum.slice(0, 10) + " " + item.datum.slice(11, 19)}
                            </span>
                            <span className="absender-tag">{item.von === user["_id"] ? "du: " : collocutorName + ": "}</span>
                            {item.text}

                            {item.von === user["_id"] ? <button className="app-button delete-post-btn" onClick={(e) => deleteMessage(e, item._id)}>löschen</button> : null}
                        </div>)}
            </div>
            <form className="weitere-nachricht-form" onSubmit={handleSubmit}>
                    <label className="weitere-nachricht-label" htmlFor="nachricht">Deine Nachricht:</label>
                    <textarea className="weitere-nachricht-text" id="nachricht" name="nachricht" ref={messageRef} onChange={(e) => setText(e.target.value)}></textarea>
                    <div className="button-container-wn"><button className="app-button absenden-btn" type="submit">absenden</button></div>
            </form>
        </div></>}
    </div>
    );
}