import {useEffect, useState} from 'react'
import {useAuth0} from '@auth0/auth0-react';
import LoginButton from './components/LoginButton.jsx';
import LogoutButton from './components/LogoutButton.jsx';
import UserProfile from './components/UserProfile.jsx';
import SignUpButton from './components/SignUpButton.jsx';
import {getPosts} from "./api/post.js";

const App = () => {
    const {user, isAuthenticated} = useAuth0();
    const [posts, setPosts] = useState([]) ;

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const res = await getPosts();
                console.log(res.data);
                setPosts(res.data);
            } catch (err) {
                console.error("Unexpected error, try later", err);
            }
        };

        loadPosts();
    }, []);

    return (
        <>
            <div>
                {!isAuthenticated && (
                    <>
                        <LoginButton />
                        <SignUpButton />
                    </>
                )}
                {isAuthenticated && (
                    <>
                        <p>Hello, {user.name}</p>
                        <UserProfile />
                    </>
                )}
            </div>

            <div style={{ marginTop: "30px" }}>
                <h2>Posts:</h2>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post.id} style={{ marginBottom: "20px" }}>
                            <h3>{post.title}</h3>
                            <p>{post.content}</p>
                        </div>
                    ))
                ) : (
                    <p>No available posts</p>
                )}
            </div>
        </>
    )
};

export default App;
