export default function UserListe({userList}){


    return (
    <div className="userlist container">
        <h2>Unsere User:</h2>
        <ul className="userlist">
        {userList.map((user, i) => <li key={i} className="coloured-font">{user.username}</li>)}
        </ul>
    </div>
    );
}