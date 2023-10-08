import { Link } from "react-router-dom";
import axios from 'axios';

export default function Nachrichten({user}){


    return (
    <div className="nachrichten container">
        <h2>Deine Nachrichten:</h2>
        <Link to="/nachrichten/neuenachricht">Nachricht schreiben</Link>
        <h3>Deine Threads: </h3>
        <ul>
            {user.interaktion.map((collocutor, i) => <li key={i}><Link to={`/nachrichten/aktuellerthread/${collocutor["_id"]}`}>{collocutor.username}</Link></li>)}
        </ul>
    </div>
    );
}