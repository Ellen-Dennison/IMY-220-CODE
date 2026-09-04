import { Link } from "react-router-dom"

function Navigation() {
    return(
        <nav>
            <Link to="/">Home</Link>
            <Link to="/posts">Posts</Link>
            <Link to="/about">About</Link>
            <Link to="/profile">Profile</Link>
        </nav>
    )
}

export default Navigation;