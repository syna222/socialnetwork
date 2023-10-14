import dove from "./images/dove.png"

export default function Home({user}){


    return (
    <div className="home container">
        <h2>{user? `Willkommen,  ${user.username}!` : `Willkommen!`}</h2>
        <img className="logo-taube" src={dove} alt="netzwerk-taube"/>
    </div>
    );
}