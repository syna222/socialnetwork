import { Link } from "react-router-dom";

export default function Nachrichten({user, setAktuellenachricht}){


    return (
    <div className="nachrichten container">
        <h2>Deine Nachrichten:</h2>
        <Link to="/nachrichten/neuenachricht">Nachricht schreiben</Link>
        <h3>Empfangen:</h3>
        <ul>
            {user.empfangen.map((nachricht, i) => 
            <li key={i} onClick={() => setAktuellenachricht(nachricht)}>
                <Link to={`/nachrichten/enachricht/${nachricht["_id"]}`}>
                    {nachricht["_id"]}
                </Link>
            </li>)}
        </ul>
        <h3>Gesendet:</h3>
        <ul>
        {user.gesendet.map((nachricht, i) => 
            <li key={i} onClick={() => setAktuellenachricht(nachricht)}>
                <Link to={`/nachrichten/gnachricht/${nachricht["_id"]}`}>
                    {nachricht["_id"]}
                </Link>
            </li>)}
        </ul>
    </div>
    );
}