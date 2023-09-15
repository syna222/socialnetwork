import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function NeueNachricht({userList, user}){

    const baseURL = process.env.REACT_APP_API_BASE_URL;
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
//     console.log("suggestions: ", suggestions);
        console.log("input:", empfaengerInput);
//     console.log("showdropdown: ", showDropDown);

function handleSubmit(e){
        e.preventDefault();
        //empfänger id rausfinden:
        const empfID = userList.filter(user => user.username === empfaengerInput)[0]._id;
        //an backend senden:
        const URL = `${baseURL}/nachrichten`;
        //create nachricht:
        axios.post(URL, { 
                von: user._id, 
                an: empfID, 
                text: text })
                .catch((error) => {
                    if (error.response) {
                        // Axios error with a response
                        console.log(error.response.data);
                        alert(error.response.data);
                      } else {
                        // Non-Axios error without a response
                        console.log("An error occurred:", error.message);
                        alert("An error occurred. Please try again.");
                      }
                });
        //nachricht bei sender speichern:
        //nachricht bei empfänger speichern:

        
}
    

    return(
    <div className="neuenachricht container">
        <h2>Neue Nachricht:</h2>
        <form onSubmit={handleSubmit}>
            <section>
                    <label htmlFor="empfaenger">An:</label>
                    <input className="form-input" type="text" id="empfaenger" name="empfaenger" onChange={(e) => setEmpfaengerinput(e.target.value.toLowerCase())} value={empfaengerInput}/>
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
                    <textarea id="nachricht" name="nachricht" onChange={(e) => setText(e.target.value)}></textarea>
            </section>
            <section>
                    <div className="button-container"><button type="submit" className="absenden-btn">absenden</button></div>
            </section>
        </form>
    </div>
    );
}


  