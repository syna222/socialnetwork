import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { sendMessage } from "./messageAPI"

export default function NeueNachricht({userList, user, setUser}){

    const baseURL = process.env.REACT_APP_API_BASE_URL;
    const recRef = useRef();
    const messageRef = useRef();
    const navigate = useNavigate();

    const [ suggestions, setSuggestions ] = useState([]);
    const [ empfaengerInput, setEmpfaengerinput ] = useState("");
    const [ showDropDown, setShowDropdown ] = useState(true);
    const [ text, setText ] = useState("");

    useEffect(() => {
        const results = empfaengerInput === "" ? [] :  userList.filter(user => user.username.toLowerCase().startsWith(empfaengerInput) === true);
        setSuggestions(results);
    }, [empfaengerInput, userList]);


    function handleDivClick(username){
        setEmpfaengerinput(username);
        //setShowDropdown(false); //dropdown ist jetzt erstmal immer da, später rumbasteln
        setSuggestions([]);  //funktioniert nur beim erneuten click
    }

    async function handleSubmit(e) {
        e.preventDefault();  
        const empfaenger = userList.filter((user) => user.username === empfaengerInput);
        if (empfaenger.length === 0) {
        alert("Diese/n User/in gibt es nicht bei uns!");
        return;
        }
        if (text.length === 0) {
        alert("Schreib doch lieber was!");
        return;
        }
        try {
            await sendMessage(user._id, empfaenger[0]._id, text);
            alert("Nachricht wurde gesendet.");
        } catch (error) {
                if (error.response) {
                console.log(error.response.data);
                alert(error.response.data);
                }
        }
        recRef.current.value = "";
        messageRef.current.value = "";
        navigate("/nachrichten");
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
    <div className="neuenachricht container">
        <h2>Neue Nachricht:</h2>
        <form onSubmit={handleSubmit}>
            <section>
                    <label htmlFor="empfaenger">An:</label>
                    <input className="form-input" type="text" id="empfaenger" name="empfaenger" ref={recRef} onChange={(e) => setEmpfaengerinput(e.target.value.toLowerCase())} value={empfaengerInput}/>
            </section>
            <div className="dropdown">
                {showDropDown && suggestions.length > 0 && suggestions.map((user, i) => 
                        <div key={i} className="clickable" onClick={() => handleDivClick(user.username)}>{user.username}</div>
                )}
            </div>

            <section>
                    <label htmlFor="nachricht">Nachricht:</label>
                    <textarea id="nachricht" name="nachricht" ref={messageRef} onChange={(e) => setText(e.target.value)}></textarea>
            </section>
            <section>
                    <div className="button-container"><button className="app-button absenden-btn" type="submit">absenden</button></div>
            </section>
        </form>
    </div>
    );
}


  