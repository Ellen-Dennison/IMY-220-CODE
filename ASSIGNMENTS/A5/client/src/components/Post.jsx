// Student Number: u23849259
function Post({ post }) {
    return (
        <article className="bg-white rounded-xl shadow-md overflow-hidden">
            <h3 className="px-4 py-3 font-bold text-emerald-700">{post.username}</h3>
            {post.image && (
                <img
                    src={`http://localhost:3001${post.image}`}
                    alt={`Uploaded by ${post.username}: ${post.caption}`}
                    className="w-full max-h-96 object-cover"
                />
            )}
            <p className="px-4 py-3 text-gray-700">{post.caption}</p>
        </article>
    );
}

export default Post;