import { Link } from "react-router-dom";
import axios from 'axios';

export default function Nachrichten({user, setThread, setCollocutor}){

    const baseURL = process.env.REACT_APP_API_BASE_URL;

    async function filterThread(coll){
        //get alle nachrichten from api + filter nach konversation zw userid und coll._id:
        await axios.get(`${baseURL}/nachrichten`)
                    .then((response) => {
                        const filteredArr = response.data.filter((inst) => 
                                (inst.von === user["_id"] && inst.an === coll["_id"]) || (inst.von === coll["_id"] && inst.an === user["_id"]))  //und dann sort by date!!
                        setThread(filteredArr)
                    })
                    .catch((err) => {
                        if (err.response) {
                            console.log(err.response.data);
                            alert(err.response.data);
                          }
                    })
        setCollocutor(coll); //for thread that is passed to Thread.js
    }

    return (
    <div className="nachrichten container">
        <h2>Deine Nachrichten:</h2>
        <Link to="/nachrichten/neuenachricht">Nachricht schreiben</Link>
        <h3>Deine Threads: </h3>
        <ul>
            {user.interaktion.map((collocutor, i) => <li key={i}><Link onClick={() => filterThread(collocutor)} to="/nachrichten/aktuellerthread">{collocutor.username}</Link></li>)}
        </ul>
    </div>
    );
}