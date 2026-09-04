
import { Link } from "react-router-dom"

const posts = [
    {
        id: 1,
        username: "@sarah",
        title: "Studying React today!"
    },
    {
        id: 2,
        username: "@john",
        title: "Finished Practical 4."
    },
    {
        id: 3,
        username: "@leanne",
        title: "Sunset over campus."
    }
];


function Posts() {

   
    return(
        <div>
            <h1>Posts</h1>
            <p>View the latest PhotoShare posts.</p>
            {
                posts.map((x) => ( <div id={x.id} key={x.id}>
                                        <h1> <Link to={`/posts/${x.id}`}> {x.username} </Link></h1>
                                        <p>{x.title}</p>
                                    </div>
                                ))
            }
            
        </div>
    )
}

export default Posts;