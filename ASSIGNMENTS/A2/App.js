// Student Number: u23849259
const { useState } = React;

// ==========================
// Supplied Data
// Do not modify this section
// ==========================
const posts = [
    {
        id: 1,
        username: "@sarah",
        caption: "Studying React today!",
        status: "Published"
    },
    {
        id: 2,
        username: "@john",
        caption: "Finished Practical 3.",
        status: "Draft"
    },
    {
        id: 3,
        username: "@amy",
        caption: "Coffee before coding.",
        status: "Published"
    },
    {
        id: 4,
        username: "@michael",
        caption: "Working on Assignment 2.",
        status: "Archived"
    },
    {
        id: 5,
        username: "@leanne",
        caption: "Sunset over campus.",
        status: "Published"
    } 
];

// ==========================
// React Components
// Write your components below
// ==========================
let nextId = 6;
function App() {
   
    const [newPosts, setPosts] = useState(posts);
    const [original, setValues] = useState(newPosts);
    const [sndTmp, setTemp] = useState(newPosts);
    const statuses = ["Draft", "Published", "Archived"];

    function handleDelete(id) 
    { setPosts(newPosts.filter(a => a.id !== id)); setValues(newPosts.filter(a => a.id !== id)); setTemp(newPosts.filter(a => a.id !== id));}

    function statusChange(id, newStatus) 
    {     
        var index = statuses.findIndex( (x) => x == (newPosts.filter((x) => x.id === id).map((a) => a.status)).toString() );
        if(index < 2) {index += 1;}
        else { index = 0;}
        setPosts(newPosts.map((x) => x.id === id ? {...x,status: statuses[index] } : x))    
    }
    return (
        <div className="app">
            <h1>PhotoShare Manager</h1>
            <SearchBar setPosts={setPosts}  setValues={setValues} sndTmp={sndTmp}/>
            <SortControl setPosts={setPosts} original={original} newPosts={newPosts}/>
            { (posts) != 0 ? <PostList 
                            onDelete = {handleDelete} 
                            onStatus={statusChange}        
                            posts = {newPosts}
                            /> 
                            :<p className="empty-message"> no posts found </p> }
            <AddPostForm setPosts={setPosts} setValues={setValues} setTemp={setTemp} sndTmp={sndTmp}/>
        </div>
    );
}

function PostList({onDelete,onStatus, posts}) {
   
    return(
        
        (posts) != 0 ? 
                posts.map((x) => ( 
                    <PostCard
                    key = {x.id}
                    id = {x.id}
                    username={x.username}
                    caption={x.caption}
                    status={x.status} 
                    onDelete ={onDelete}   
                    onStatus={onStatus}               
                />
        ))
        : <p className="empty-message"> no posts found </p> 
    );

}
function PostCard({id,username, caption, status, onDelete, onStatus}) {
 
    return (
        <div className="post-card">
            <h2>{username}</h2>
            <p>{caption}</p>
            <p>{status}</p>

            <div className="post-actions">
                <button onClick={() => onDelete(id)} >
                    Delete Post
                </button>
                <button onClick={() => onStatus(id)}>
                    Change Status
                </button>
            </div>
        </div>
    );
}

function SearchBar({setPosts, setValues, sndTmp}){

    const [heading, setHeading] = useState("");
  

    function onSearch(event)
    {     
        const query = event.target.value;
        setHeading(query);

        if (query === "")
        { setPosts(sndTmp); setValues(sndTmp); }
        else
        {
            temp = sndTmp.filter((x)=> x.username.includes(query) || x.caption.includes(query) );
            setPosts(temp); setValues(temp);
        }    

    }

    return(
        <label className="search-bar">   
            SEARCH BAR
             <input value={heading} onChange={() => onSearch(event)}/>
        </label>
    )
}

function compare( a, b ) 
{
  if ( a.username < b.username )
  { return -1; }
  if ( a.username > b.username )
  { return 1; }
  return 0;
}

function compareSec( a, b ) 
{
  if ( a.caption < b.caption )
  { return -1; }
  if ( a.caption > b.caption )
  { return 1; }
  return 0;
}


function SortControl({setPosts, original, newPosts}){
    
    const [isClicked, setStatus] = useState(false);  
    const [isSecClicked, setSecStatus] = useState(false);   
   
    function usrChange()
    {   
       
        if (isClicked)
        {  setPosts(original); }
        else 
        {  setPosts([...newPosts].sort(compare)); }
        setStatus(!isClicked); 
         

    }

    function capChange()
    {    
        
        if (isSecClicked)
        {   setPosts(original); }
        else 
        { setPosts([...newPosts].sort(compareSec)); }
        setSecStatus(!isSecClicked);     

    }

    return(

        <div className="controls">
            <button onClick={() => usrChange()}>Username A-Z</button>
            <button onClick={() => capChange()}>Caption A-Z</button>
        </div>
         
        
    )
}

function AddPostForm({setPosts,setValues,setTemp, sndTmp}){
    
    const [name, setName] = useState("");
    const [caption, setCaption] = useState("");
   
    function nameChange(e) 
    { setName(e.target.value); }
    
    function captionChange(e) 
    { setCaption(e.target.value); }

    return (
        <form className="form-group">
            <label>Enter your username
                <input type="text" value={name} onChange={nameChange}/>
            </label>
            <label>Enter your caption
                <input type="text" value={caption} onChange={captionChange}/>
            </label>
            <button onClick={() => {event.preventDefault();
                                    if(name !== "" && caption !== "") {
                                        setPosts([...sndTmp,{id: nextId++, username: name, caption: caption, status: "Draft"}]);
                                        setValues([...sndTmp,{id: nextId++, username: name, caption: caption, status: "Draft"}]); 
                                        setTemp([...sndTmp,{id: nextId++, username: name, caption: caption, status: "Draft"}]);
                                    }
                                    setName(""); setCaption("");
                                    }}>
                                    Add Post</button>
        </form>
    )



}



// ==========================
// Render the Application
// Do not modify this section
// ==========================
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);