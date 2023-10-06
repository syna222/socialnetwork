
export default function Thread({thread, collocutor}){


    return(
    <div className="thread container">
        <h3>{collocutor? "Mit " + collocutor.username : "Thread"}</h3>
        <ul>
            {thread.map((item, i) => <li key={i}>{`${item.text} (${item.datum.slice(0, 10)} ${item.datum.slice(11, 19)})`}</li>)}
        </ul>
    </div>
    );
}