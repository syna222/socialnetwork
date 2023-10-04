export default function UserListe({userList}){


    return (
    <div className="userlist container">
        <h2>Alle unsere User:</h2>
        <ul>
        {userList.map((user, i) => <li key={i}>{user.username}</li>)}
        </ul>
    </div>
    );
}