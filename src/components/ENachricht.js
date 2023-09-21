import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function ENachricht({user, setUser}){ //hier war akt Nachricht

    const { id } = useParams(); //taking id from nachricht from URL (more stable across page refresh than prop)?
    const [ aktuelleNachricht, setAktuellenachricht ] = useState();

    const baseURL = process.env.REACT_APP_API_BASE_URL;
    const messageRef = useRef();
    const [ sender, setSender ] = useState({});
    const [ showForm, setShowform ] = useState(false);

    const [ empfaenger, setEmpfaenger ] = useState("");
    const [ betreff, setBetreff ] = useState("");
    const [ text, setText ] = useState("");


    async function getData(){
        //get nachricht:
        let URL = `${baseURL}/nachrichten/${id}`
        let senderID = "";
        await axios.get(URL)
            .then(response => {
                senderID = response.data["von"]
                setAktuellenachricht(response.data)})
            .catch((error) => {
                if (error.response) {
                    console.log(error.response.data);
                    alert(error.response.data);
                }
            });

        //get empfänger:
        URL = `${baseURL}/users/${senderID}`
        await axios.get(URL)
            .then(response => {
                setSender(response.data)})
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
        //set empfänger:
        setEmpfaenger(aktuelleNachricht["von"]);
        //set betreff:
        setBetreff(aktuelleNachricht["betreff"]);
    }

    async function handleSubmit(e){
        e.preventDefault();
        if(text.length === 0){
            alert("Schreib doch lieber was!");
            return;
        }
        let messageID = ""; //state var use was too slow for 2nd post request
        let URL = `${baseURL}/nachrichten`;
        await axios.post(URL, { 
                von: user._id, 
                an: empfaenger,
                betreff: betreff, 
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
        URL = `${baseURL}/users/${empfaenger}/addnachrichtrec`;
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
        messageRef.current.value = "";
    }

    return(
    <div>
        <p>Gesendet: {aktuelleNachricht && aktuelleNachricht["datum"]}</p>
        <p>Von: {sender && sender["username"]}</p>
        <p>Betreff: {aktuelleNachricht && aktuelleNachricht["betreff"].length >= 0 && aktuelleNachricht["betreff"]}</p>
        <p>{aktuelleNachricht && aktuelleNachricht["text"]}</p>
        <button onClick={toggleAnswer}>{showForm? "doch nicht" : "antworten"}</button>

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