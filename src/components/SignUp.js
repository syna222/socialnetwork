import { useRef, useState } from 'react';
import axios from 'axios';

export default function SignUp(){

    const baseURL = process.env.REACT_APP_API_BASE_URL;
    const inputUsernameRef = useRef();
    const inputEmailRef = useRef();
    const inputPasswortRef = useRef();

    const [ userName, setUsername ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ passwort, setPasswort ] = useState("");


    function handleSubmit(e){
        e.preventDefault();
        //an backend senden:
        const URL = `${baseURL}/users`;
        axios.post(URL, { 
            username: userName, 
            email: email, 
            passwort: passwort })
            .then()
    }

    return (
    <div className="signup container">
        <form onSubmit={handleSubmit}>
            <section>
                <label htmlFor="username">Username:</label>
                <input className="form-input" type="text" id="username" name="username" ref={inputUsernameRef} onChange={(e) => setUsername(e.target.value)}/>
            </section>
            <section>
                <label htmlFor="signup-email">Email:</label>
                <input className="form-input" type="text" id="signup-email" name="signup-email" ref={inputEmailRef} onChange={(e) => setEmail(e.target.value)}/>
            </section>
            <section>
                <label htmlFor="signup-passwort">Passwort:</label>
                <input className="form-input" type="password" id="signup-passwort" name="signup-passwort" ref={inputPasswortRef} onChange={(e) => setPasswort(e.target.value)}/>
            </section>
            <section>
                <input type="submit" value="Account erstellen"/>
            </section>
        </form>
    </div>
    );
}