import { Link } from "react-router-dom";

export default function Nachrichten(){



    return (
    <div className="nachrichten container">
        <h2>Deine Nachrichten:</h2>
        <Link to="/neuenachricht">Nachricht schreiben</Link>
        <h3>Empfangen:</h3>
        <h3>Gesendet:</h3>
    </div>
    );
}