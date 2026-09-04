import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Posts from "./components/Posts";
import About from "./components/About";
import Profile from "./components/Profile";
import Navigation from "./components/Navigation";
import NotFound from "./components/NotFound";
import Post from "./components/Post";

function App() {

    return(
        <BrowserRouter>
                    <Navigation />
                    <Routes>
                        <Route path="/" element={<Home />} />
        ````````````````<Route path="/about" element={<About />} />
        ````````````````<Route path="/profile" element={<Profile />} />
                        <Route path="/posts" element={<Posts />} />
                        <Route path="/posts/:id" element={<Post />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
        </BrowserRouter>
    )
}

export default App;