import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function ENachricht(){ //hier war akt Nachricht

    const { id } = useParams(); //taking id from nachricht from URL (more stable across page refresh than prop)?
    const [ aktuelleNachricht, setAktuellenachricht ] = useState();

    const baseURL = process.env.REACT_APP_API_BASE_URL;
    const [ sender, setSender ] = useState({});


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

    return(
    <div>
        <p>Gesendet: {aktuelleNachricht && aktuelleNachricht["datum"]}</p>
        <p>Von: {sender && sender["username"]}</p>
        <p>{aktuelleNachricht && aktuelleNachricht["text"]}</p>
    </div>
    );
}