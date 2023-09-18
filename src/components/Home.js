export default function Home({user}){



    return (
    <div className="home container">
        <h2>{user? `Willkommen,  ${user.username}!` : `Willkommen!`}</h2>
    </div>
    );
}