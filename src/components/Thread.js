import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { sendMessage } from "./messageAPI"

export default function Thread({user, setUser, thread, collocutor}){

    const baseURL = process.env.REACT_APP_API_BASE_URL;
    const messageRef = useRef();
    const navigate = useNavigate();
    const [ text, setText ] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();  
        if (text.length === 0) {
        alert("Schreib doch lieber was!");
        return;
        }
        try {
            await sendMessage(user._id, collocutor["_id"], text);
            alert("Nachricht wurde gesendet.");
            window.location.reload(); //funzt das hier? aber daten lost nach page refresh...
        } catch (error) {
                if (error.response) {
                console.log(error.response.data);
                alert(error.response.data);
                }
        }
        messageRef.current.value = "";
        navigate("/nachrichten/aktuellerthread");
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

    return(
    <div className="thread container">
        <h3>{collocutor? "Mit " + collocutor.username : "Thread"}</h3>
        <ul>
            {thread.map((item, i) => 
            <li {...(item.von === user["_id"] ? {className:"mine"} : {})} key={i}>{`${item.text} (${item.datum.slice(0, 10)} ${item.datum.slice(11, 19)})`}</li>)}
        </ul>
        <form onSubmit={handleSubmit}>
            <section>
                    <label htmlFor="nachricht">Nachricht:</label>
                    <textarea id="nachricht" name="nachricht" ref={messageRef} onChange={(e) => setText(e.target.value)}></textarea>
            </section>
            <section>
                    <div className="button-container"><button type="submit" className="absenden-btn">absenden</button></div>
            </section>
        </form>
    </div>
    );
}