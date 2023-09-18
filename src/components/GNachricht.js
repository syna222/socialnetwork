import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function GNachricht(){ //hier war akt Nachricht

    const { id } = useParams(); //taking id from nachricht from URL (more stable across page refresh than prop)?
    const [ aktuelleNachricht, setAktuellenachricht ] = useState();

    const baseURL = process.env.REACT_APP_API_BASE_URL;
    const [ empfaenger, setEmpfaenger ] = useState({});


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

        //get empfänger:
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

    return(
    <div>
        <p>Gesendet: {aktuelleNachricht && aktuelleNachricht["datum"]}</p>
        <p>An: {empfaenger && empfaenger["username"]}</p>
        <p>{aktuelleNachricht && aktuelleNachricht["text"]}</p>
    </div>
    );
}