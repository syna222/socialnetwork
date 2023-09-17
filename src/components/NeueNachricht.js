import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function NeueNachricht({userList, user, setUser}){

    const baseURL = process.env.REACT_APP_API_BASE_URL;
    const recRef = useRef();
    const messageRef = useRef();  //betreff später noch implementieren?

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


async function handleSubmit(e){
        e.preventDefault();
        //empfänger id rausfinden:
        const empfID = userList.filter(user => user.username === empfaengerInput)[0]._id;
        let messageID = ""; //state var use was too slow for 2nd post request
        let URL = `${baseURL}/nachrichten`;
        //create nachricht:
        await axios.post(URL, { 
                von: user._id, 
                an: empfID, 
                text: text })
                .then(function (response) {
                        messageID = response.data['_id']; //accessing via ._id doesn't work for some reason...
                      })
                .catch((error) => {
                    if (error.response) {
                        // Axios error with a response
                        console.log(error.response.data);
                        alert(error.response.data);
                      }
                });
        //nachricht bei sender speichern:
        URL = `${baseURL}/users/${user._id}/addnachrichtsender`;
        await axios.post(URL, { 
                messageid: messageID})
                .catch((error) => {
                        if (error.response) {
                            // Axios error with a response
                            console.log(error.response.data);
                            alert(error.response.data);
                            console.log("test, messageID is:", messageID)
                          }
                });
        //nachricht bei empfänger speichern:
        URL = `${baseURL}/users/${empfID}/addnachrichtrec`;
        await axios.post(URL, {
                messageid: messageID})
                .then(() => {
                        alert("Nachricht wurde gesendet.")})
                .catch((error) => {
                        if (error.response) {
                            // Axios error with a response
                            console.log(error.response.data);
                            alert(error.response.data);
                            console.log("test, messageID is:", messageID)
                          }
                });
        recRef.current.value = "";
        messageRef.current.value = "";
        //update user object:
        URL = `${baseURL}/users/${user._id}`;
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
                    <label htmlFor="betreff">Betreff:</label>
                    <input className="form-input" type="text" id="betreff" name="betreff"/>
            </section>
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


  