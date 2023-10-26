import { Link } from "react-router-dom";
import axios from 'axios';

export default function Nachrichten({user}){


    return (
    <div className="nachrichten container">
        <h2>Deine Nachrichten:</h2>
        <Link className="threadlink coloured-font" to="/nachrichten/neuenachricht">Neue Nachricht schreiben</Link>
        <h3>Deine Threads: </h3>
        <ul className="threadlist">
            {user.interaktion.map((collocutor, i) => <li key={i}><Link className="threadlink" to={`/nachrichten/aktuellerthread/${collocutor["_id"]}`}><span className="coloured-font">&#9993;</span> {collocutor.username}</Link></li>)}
        </ul>
    </div>
    );
}