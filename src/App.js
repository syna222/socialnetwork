import './App.css';
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Home from './components/Home';
import UserListe from './components/UserListe';
import Nachrichten from './components/Nachrichten';

function App() {

  const baseURL = process.env.REACT_APP_API_BASE_URL;
  const [ loggedIn, setLoggedin ] = useState(false); //gets passed down to login component
  const [ user, setUser ] = useState(JSON.parse(localStorage.getItem("user")));
  const [ token, setToken ] = useState(localStorage.getItem("authtoken"));


  function handleLogout(){

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
        <Route path="/userliste" element={<UserListe />}/>
        <Route path="/nachrichten" element={<Nachrichten/>}/>
      </Routes>

    </div>
  );
}

export default App;
