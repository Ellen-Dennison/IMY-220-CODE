/*
    IMY 220 Practical - React Feed
    Student Number:

    Do not modify the supplied data.
*/

// ==========================
// Supplied Data
// Do not modify this section
// ==========================

const posts = [
    {
        id: 1,
        username: "leanne_dev",
        caption: "Sunset over campus",
        hashtags: ["sunset", "campus", "photography"],
        likes: 34,
        comments: 12,
        reports: 0
    },

    {
        id: 2,
        username: "mark_codes",
        caption: "Coffee before lectures",
        hashtags: ["coffee", "studentlife"],
        likes: 8,
        comments: 3,
        reports: 1
    },

    null,

    {
        id: 3,
        username: "diffie",
        caption: "Working on Practical 2",
        hashtags: ["imy220", "javascript", "coding"],
        likes: 42,
        comments: 15,
        reports: 6
    },

    {
        id: 4,
        username: "sarah",
        caption: "Weekend hike",
        hashtags: ["nature", "weekend"],
        likes: 16,
        comments: 5,
        reports: 0
    },

    undefined,

    {
        id: 5,
        username: "john",
        caption: "Finished my assignment!",
        hashtags: ["assignment", "imy220", "studentlife"],
        likes: 27,
        comments: 10,
        reports: 2
    }
];

// ==========================
// Write your solution below
// ==========================

const { useState } = React;

/*
    SPECIFICATION
    =============

    You must build a small React feed using the `posts` data above,
    without modifying that array. Note that the array deliberately
    contains `null` and `undefined` entries — your rendering must not
    break or display them.

    Build the following:

    1. PostCard component
       - Props: a single `post` object.
       - Must display the post's `username` and `caption`.
       - Skip (do not render) any post that is `null` or `undefined` —
         handle this filtering wherever makes sense (in App, or before
         mapping).

    2. Show / hide comments
       - Each PostCard must have a button that toggles visibility of
         an extra details section for THAT card only (likes, comment
         count, hashtags — your choice of what to show).
       - Each card's toggle must be independent: opening one card's
         comments must not affect any other card.
       - Button label should change depending on state, e.g.
         "Show comments (12)" / "Hide comments".

    3. EditableHeading component
       - Renders a heading (e.g. "Campus Feed") that starts as plain
         text.
       - Clicking the heading turns it into a text input pre-filled
         with the current heading value.
       - Confirming the edit (e.g. pressing Enter, or clicking away)
         saves the new text and switches back to plain-text display.
       - Decide what should happen if the user tries to save an empty
         value.

    4. App component
       - Renders EditableHeading once.
       - Filters out the null/undefined entries from `posts` and
         renders one PostCard per remaining post.
       - Each PostCard needs a stable, unique `key` — use the post's
         real `id`, not the array index (filtering shifts indices).

    Suggested component breakdown (you may structure differently):

        EditableHeading()   -> manages heading text + edit mode
        PostCard({ post })  -> manages its own show/hide state
        App()               -> filters posts, renders the above
*/

// TODO: implement EditableHeading
function EditableHeading() {
  
  const [heading, setHeading] = useState("User Feed");
  return (
      <div>
        <input className="input"
              value={heading}
              onChange={(event) => setHeading(event.target.value)}
        />
        <h1>{heading}</h1>
      </div>
    );
}

// TODO: implement PostCard
function PostCard({ post }) {

    const [showDetails, setShowDetails] = useState(false);
    
    function toggleDetails() 
    { setShowDetails(!showDetails); }

    return (
       <div className="post-card">
         <h1>{post.username}</h1>
         <p>{post.caption}</p>
         <button onClick={toggleDetails}>
              { showDetails ? `Show Comments (${post.comments})` : "Hide Comments"}
         </button>
        {showDetails}
        
       </div>
    );
}

// TODO: implement App
function App() {
    return (
      <div className="app">
         <EditableHeading/> 
         {  posts.filter((x) => (x != null)).map((x) => <PostCard key={x.id} post={x}/>) }
      </div>

    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
