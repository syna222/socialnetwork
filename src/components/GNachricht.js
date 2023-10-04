import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { sendMessage } from "./messageAPI"

export default function GNachricht({user, setUser}){

    const { id } = useParams(); //taking id from nachricht from URL (more stable across page refresh than prop)?
    const [ aktuelleNachricht, setAktuellenachricht ] = useState();

    const baseURL = process.env.REACT_APP_API_BASE_URL;
    const messageRef = useRef();
    const [ empfaenger, setEmpfaenger ] = useState({});
    const [ showForm, setShowform ] = useState(false);

    const [ betreff, setBetreff ] = useState("");
    const [ text, setText ] = useState("");


    async function getData(){
        //get nachricht:
        let URL = `${baseURL}/nachrichten/${id}`
        let empfaengerID = "";
        await axios.get(URL)
            .then(response => {
                empfaengerID = response.data["an"]
                setAktuellenachricht(response.data)})
            .catch((error) => {
                if (error.response) {
                    console.log(error.response.data);
                    alert(error.response.data);
                }
            });
        //get empfänger:   //hier auch möglichkeit, aus userDict empfänger zu bekommen!
        URL = `${baseURL}/users/${empfaengerID}`
        await axios.get(URL)
            .then(response => {
                setEmpfaenger(response.data)})
            .catch((error) => {
                if (error.response) {
                    console.log(error.response.data);
                    alert(error.response.data);
                }
            });
        
    }

    useEffect(() => {
        getData();
    }, []);

    function toggleAnswer(){
        setShowform(!showForm);
        //set betreff:
        setBetreff(aktuelleNachricht["betreff"]);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (text.length === 0) {
          alert("Schreib doch lieber was!");
          return;
        }
        try {
          await sendMessage(user._id, empfaenger["_id"], betreff, text);
        } catch (error) {
          if (error.response) {
            console.log(error.response.data);
            alert(error.response.data);
          }
        }
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
        messageRef.current.value = "";
      }
      

    return(
    <div>
        <p>Gesendet: {aktuelleNachricht && aktuelleNachricht["datum"].slice(0, 10) + " " + aktuelleNachricht["datum"].slice(11, 19)}</p>
        <p>An: {empfaenger && empfaenger["username"]}</p>
        <p>Betreff: {aktuelleNachricht && aktuelleNachricht["betreff"].length >= 0 && aktuelleNachricht["betreff"]}</p>
        <p>{aktuelleNachricht && aktuelleNachricht["text"]}</p>
        <button onClick={toggleAnswer}>{showForm? "doch nicht" : "hinterherschicken"}</button>

        {showForm && <form onSubmit={handleSubmit}>
            <section>
                    <label htmlFor="nachricht">Nachricht:</label>
                    <textarea id="nachricht" name="nachricht" ref={messageRef} onChange={(e) => setText(e.target.value)}></textarea>
            </section>
            <section>
                    <div className="button-container"><button type="submit" className="absenden-btn">absenden</button></div>
            </section>
        </form>}
    </div>
    );
}