import React, { useState, useRef } from 'react';
import axios from 'axios';

export default function Stream({posts, setPosts, userDict, user}){

    const postRef = useRef();
    const [ text, setText ] = useState("");
    const baseURL = process.env.REACT_APP_API_BASE_URL;

    function handleSubmit(e){
        e.preventDefault();
        try{
            axios.post(`${baseURL}/posts`, {
                von: user._id,
                text: text
            })
            .then(() => window.location.reload());
        }
        catch(error){
            if (error.response) {
                // Axios error with a response
                console.log(error.response.data);
                alert(error.response.data);
              } else {
                // Non-Axios error without a response
                console.log("An error occurred:", error.message);
                alert("An error occurred. Please try again.");
              }
        }
        postRef.current.value = "";
        setText("");
    }

    function fetchPosts(){
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
    }

    function deletePost(e, postid){ 
        e.preventDefault();
        try{
            axios.delete(`${baseURL}/posts/${postid}`)
            .then(() => window.location.reload());
        }
        catch(error){
            if (error.response) {
                // Axios error with a response
                console.log(error.response.data);
                alert(error.response.data);
              } else {
                // Non-Axios error without a response
                console.log("An error occurred:", error.message);
                alert("An error occurred. Please try again.");
              }
        }
        //posts erneut einholen:
        fetchPosts();
    }


    async function toggleLike(e, postid, postlikes){
        e.preventDefault();
        //NOW: if post.likes includes user._id the like should be removed - otherwise it should be added:
        try{
          if(postlikes.includes(user._id)){
            console.log(`${baseURL}/posts/${postid}/removelike`)
              await axios.delete(`${baseURL}/posts/${postid}/removelike`, { 
                data: {likerId: user._id}  //data keyword needed with delete method when the delete info isn't all in the req.params!!
              })
              .then(() => window.location.reload());
          } else {
              await axios.post(`${baseURL}/posts/${postid}/addlike`, {
                likerId: user._id
              })
              .then(() => window.location.reload());
          }

        }
        catch(error){
          if (error.response) {
            console.log(error.response.data);
            alert(error.response.data);
          }
        }
        //posts erneut einholen:
        fetchPosts();
    }


    return(
    <div className="stream container">
      <h2>Unser Stream:</h2>
        <form className="stream-item" onSubmit={handleSubmit}>
            <section>
                <h3>Poste selbst etwas!</h3>
                <textarea id="post" name="post" ref={postRef} onChange={(e) => setText(e.target.value)}></textarea>
            </section>
            <section>
                    <div className="button-container"><button className="app-button absenden-btn" type="submit">absenden</button></div>
            </section>
        </form>
        {posts.map((post, i) => 
        <div key={i} className="stream-item post">
            <p className="coloured-font post-date">{`${post.datum.slice(0, 10)} ${post.datum.slice(11, 19)}`}</p>
            <p className="coloured-font">von: {post.von === user._id ? "dir" : userDict[post.von]}</p>
            <p>{post.text}</p>
            <span className="coloured-font">{post.likes.length}x gemocht. </span><button className="app-button" onClick={(e) => toggleLike(e, post._id, post.likes)}> {post.likes.includes(user._id)? '✔️' : '❤️'}</button>
            {post.von === user._id ? <button className="app-button delete-post-btn" onClick={(e) => deletePost(e, post._id)}>Post löschen</button> : ""}
        </div>
        )}
    </div>
    );
}