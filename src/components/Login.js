import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login({ setLoggedin, setUser, setToken }){

    const baseURL = process.env.REACT_APP_API_BASE_URL;
    const navigate = useNavigate();
    const inputEmailRef = useRef();
    const inputPasswortRef = useRef();

    const [ email, setEmail ] = useState("");
    const [ passwort, setPasswort ] = useState("");

    function handleSubmit(e){
        e.preventDefault();
        //an backend senden:
        const URL = `${baseURL}/login`;
        axios.post(URL, { 
            email: email, 
            passwort: passwort })
            .then((response) => {
                //token in localStorage setzen:
                localStorage.setItem("authtoken", response.data.token); //wenn kein token zurückkommt, springt er in catch + kein setLoggedIn erfolgt!
                //user data in localStorage setzen:
                localStorage.setItem("user", JSON.stringify(response.data.user)); //AUCH SEIN PASSWORT? einschränken?
                //state variablen setzen:
                setToken(response.data.token);
                setLoggedin(true);
                setUser(response.data.user);
                navigate("/");  //direct to home page
            })
            .catch((error) => {
                if (error.response) {
                    // Axios error with a response
                    console.log(error.response.data);
                    alert(error.response.data);
                  } else {
                    // Non-Axios error without a response
                    console.log("An error occurred:", error.message);
                    alert("An error occurred. Please try again.");
                  }
            });
            inputEmailRef.current.value = "";
            inputPasswortRef.current.value = "";
    }


    return (
    <div className="login container">
        <form onSubmit={handleSubmit}>
            <section>
                <label htmlFor="email">Email:</label>
                <input className="form-input" type="text" id="email" name="passwort" ref={inputEmailRef} onChange={(e) => setEmail(e.target.value)}/>
            </section>
            <section>
                <label htmlFor="passwort">Passwort:</label>
                <input className="form-input" type="password" id="passwort" name="passwort" ref={inputPasswortRef} onChange={(e) => setPasswort(e.target.value)}/>
            </section>
            <section>
                <input type="submit" value="einloggen"/>
            </section>
        </form>
    </div>
    );
}