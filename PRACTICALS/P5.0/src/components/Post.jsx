import { useParams } from "react-router-dom";

function Post() {

    const { id } = useParams()
    return(
         <div>
               <h2> Post Details </h2>
               <p>Post ID: {id}</p>
        </div>
    )
}

export default Post;