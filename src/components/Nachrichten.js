import { Link } from "react-router-dom";

export default function Nachrichten({user, userDict}){

    return (
    <div className="nachrichten container">
        <h2>Deine Nachrichten:</h2>
        <Link to="/nachrichten/neuenachricht">Nachricht schreiben</Link>
        <h3>Empfangen:</h3>
        <ul>
            {user.empfangen.reverse().map((nachricht, i) => 
            <li key={i}>
                <Link to={`/nachrichten/enachricht/${nachricht["_id"]}`}>
                {`Von: ${userDict? userDict[nachricht["von"]] : nachricht["von"]} Am: ${nachricht["datum"].slice(0, 10) + " " + nachricht["datum"].slice(11, 16)}`}
                </Link>
            </li>)}
        </ul>
        <h3>Gesendet:</h3>
        <ul>
        {user.gesendet.reverse().map((nachricht, i) => 
            <li key={i}>
                <Link to={`/nachrichten/gnachricht/${nachricht["_id"]}`}>
                {`An:  ${userDict? userDict[nachricht["an"]] : nachricht["an"]} Am: ${nachricht["datum"].slice(0, 10) + " " + nachricht["datum"].slice(11, 16)}`}
                </Link>
            </li>)}
        </ul>
    </div>
    );
}