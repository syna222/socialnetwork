import './App.css';
import axios from 'axios';
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Home from './components/Home';
import Stream from './components/Stream';
import UserListe from './components/UserListe';
import Nachrichten from './components/Nachrichten';
import NeueNachricht from './components/NeueNachricht';
import GNachricht from './components/GNachricht';
import ENachricht from './components/ENachricht';

function App() {

  const baseURL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();
  const [ loggedIn, setLoggedin ] = useState(false); //gets passed down to login component
  const [ user, setUser ] = useState(JSON.parse(localStorage.getItem("user")));
  const [ token, setToken ] = useState(localStorage.getItem("authtoken"));
  const [ userList, setUserlist ] = useState([]);
  const [ userDict, setUserdict ] = useState({});  //ids as keys, usernames as values
  const [ posts, setPosts ] = useState([]);

  useEffect(() => {
    //get users:
    axios.get(`${baseURL}/users`)
    .then((response) => {
      setUserlist(response.data);
      const idToUsernameDictionary = {};
      response.data.forEach((user) => {          //using newly set userList would be too slow
        idToUsernameDictionary[user._id] = user.username;
      });
      setUserdict(idToUsernameDictionary);
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response.data);
        alert(error.response.data);
      }
    })
    //get posts:
    axios.get(`${baseURL}/posts`)
    .then((response) => {
      setPosts(response.data);
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response.data);
        alert(error.response.data);
      }
    })

  }, []);

  //keep loggedIn state based on existence of token:
  useEffect(() => {
    if (token) {
      setLoggedin(true);
    }
  }, [token]);


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
      {loggedIn && <><NavLink className="nav-elem" to="/stream">
        STREAM
      </NavLink>
      <NavLink className="nav-elem" to="/userliste">
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
        <Route path="/" element={<Home user={user}/>}/>
        <Route path="/signup" element={<SignUp />}/>
        <Route path="/login" element={<Login setLoggedin={setLoggedin} setUser={setUser} setToken={setToken}/>}/>
        <Route path="/stream" element={<Stream posts={posts} setPosts={setPosts} userDict={userDict} user={user}/>}/>
        <Route path="/userliste" element={<UserListe userList={userList}/>}/>
        <Route path="/nachrichten" element={<Nachrichten user={user} userDict={userDict}/>}/>
        <Route path="/nachrichten/neuenachricht" element={<NeueNachricht userList={userList} user={user} setUser={setUser}/>}/>
        <Route path="/nachrichten/gnachricht/:id" element={<GNachricht user={user} setUser={setUser}/>} />
        <Route path="/nachrichten/enachricht/:id" element={<ENachricht user={user} setUser={setUser}/>} />
      </Routes>

    </div>
  );
}

export default App;
