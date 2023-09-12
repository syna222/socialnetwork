import './App.css';
import axios from 'axios';
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Home from './components/Home';
import UserListe from './components/UserListe';
import Nachrichten from './components/Nachrichten';
import NeueNachricht from './components/NeueNachricht';

function App() {

  const baseURL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();
  const [ loggedIn, setLoggedin ] = useState(false); //gets passed down to login component
  const [ user, setUser ] = useState(JSON.parse(localStorage.getItem("user")));
  const [ token, setToken ] = useState(localStorage.getItem("authtoken"));
  const [ userList, setUserlist ] = useState([]);

  useEffect(() => {
    axios.get(`${baseURL}/users`)
    .then((response) => {
      setUserlist(response.data)
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
    })
  }, []);


  function handleLogout(e){
    e.preventDefault();
    if(loggedIn){
      localStorage.removeItem("user");
      localStorage.removeItem("authtoken");
      setLoggedin(false);
      setUser();
      setToken();
      navigate("/");  //navigate to home page
    }
  }


  return (
    <div className="App">
      <nav>
      <NavLink className="nav-elem" to="/">
        HOME
      </NavLink>
      {!loggedIn && <><NavLink className="nav-elem" to="/signup">
        SIGNUP
      </NavLink>
      <NavLink className="nav-elem" to="/login">
        LOGIN
      </NavLink></>}
      {loggedIn && <><NavLink className="nav-elem" to="/userliste">
        USERLISTE
      </NavLink>
      <NavLink className="nav-elem" to="/nachrichten">
        NACHRICHTEN
      </NavLink>
      <button onClick={handleLogout}>
        LOGOUT
      </button></>}
      </nav>

      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/signup" element={<SignUp />}/>
        <Route path="/login" element={<Login setLoggedin={setLoggedin} setUser={setUser} setToken={setToken}/>}/>
        <Route path="/userliste" element={<UserListe userList={userList}/>}/>
        <Route path="/nachrichten" element={<Nachrichten/>}/>
        <Route path="/neuenachricht" element={<NeueNachricht />}/>
      </Routes>

    </div>
  );
}

export default App;
