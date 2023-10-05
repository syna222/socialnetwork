import { Link } from "react-router-dom";

export default function Nachrichten({user, userDict}){

    return (
    <div className="nachrichten container">
        <h2>Deine Nachrichten:</h2>
        <Link to="/nachrichten/neuenachricht">Nachricht schreiben</Link>
    </div>
    );
}