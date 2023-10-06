import React, { useState, useEffect, useRef } from 'react';
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
        //posts erneut fetchen:
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

    return(
    <div>
        <form onSubmit={handleSubmit}>
            <section>
                <div htmlFor="post">Poste selbst!:</div>
                <textarea id="post" name="post" ref={postRef} onChange={(e) => setText(e.target.value)}></textarea>
            </section>
            <section>
                    <div className="button-container"><button type="submit" className="absenden-btn">absenden</button></div>
            </section>
        </form>
        {posts.map((post, i) => 
        <div key={i}>
            <p>{post.datum}</p>
            <p>von: {post.von === user._id ? "dir" : userDict[post.von]}</p>
            <p>{post.text}{post.von === user._id ? <button onClick={(e) => deletePost(e, post._id)}>löschen</button> : ""}</p>
        </div>
        )}
    </div>
    );
}