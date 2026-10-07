# IMY 220 — Practical 5 (Practice Version)
### Asynchrony in React — PhotoShare, Part 2

> This is **not** the official practical — it's a harder practice version I put together based on the Class 6 slides (AJAX/ES6 Promises + API Calls) and your Practical 4 PhotoShare app, so you can stress-test yourself before the real thing. No due date — go at your own pace, but try to time-box yourself to ~2 hours to simulate practical conditions.

---

## Goal

Take the PhotoShare app you built in Practical 4 (React Router, static `posts` array) and turn it into a real async app: a small fake backend, `fetch()` calls, loading/error states, and performance optimisation with `useCallback` + `memo`. Then push past what Class 6 covered with a few harder extensions.

---

## Section 0 — Setup: a real API to hit

Practical 4 used a hardcoded `posts` array. Before you can practice AJAX, you need something to actually fetch from.

1. In your Prac 4 project (or a copy of it), install `json-server`:
   ```
   npm install json-server --save-dev
   ```
2. Create a `db.json` file at the project root with a `posts` array. Give each post an `id`, `username`, `title`, `caption`, and `likes` field — at least 6 posts.
3. Add a script to `package.json`:
   ```json
   "server": "json-server --watch db.json --port 3001"
   ```
4. Run it in a separate terminal (`npm run server`) alongside `npm run dev`. Confirm you can see your posts at `http://localhost:3001/posts` in the browser.

**Checkpoint:** you now have a real REST API running locally, matching the `POSTS_URL` pattern from the slides.

---

## Section 1 — Replace the static array with `fetch()`

In `Posts.jsx`:

- Remove the hardcoded `posts` array.
- Use `useState` for `posts`, `isLoading` (default `true`), and `error` (default `null`).
- Inside `useEffect`, define an inner `async function loadPosts()` that:
  - `fetch`es `http://localhost:3001/posts`
  - throws an `Error` if `res.ok` is `false`
  - parses the JSON and calls `setPosts`
  - sets `error` in a `catch` block
  - sets `isLoading` to `false` in a `finally` block
- Call `loadPosts()` at the end of the effect, with an empty dependency array.
- Render `<p>Loading posts…</p>` while loading, and `<p>Couldn't load posts: {error}</p>` on failure, before the normal post list.

**This part matches the slides almost exactly — it should feel familiar.**

---

## Section 2 — Harder: fetch a single post by ID (no cheating)

In Practical 4, `Post.jsx` just read the `id` from `useParams()` and displayed it — it never needed real data.

Now make it real:

- `Post.jsx` must `fetch` `http://localhost:3001/posts/:id` directly (not find it from an already-loaded array).
- Handle three states: loading, error, and "not found" (json-server returns a 404 for a missing ID — this is *not* the same as a network failure, and your error message should say so).
- Display the post's username, title, caption and likes once loaded.

**Why this is harder than the slides:** the slides only ever fetched a list. Fetching a single resource by a dynamic route param, and telling apart "404" from "network down", is something you have to reason through yourself.

---

## Section 3 — Creating posts (POST request)

Add a small form to the Posts page (username + caption inputs, a submit button):

- Write a `createPostRequest(caption, username)` function in a separate `api/api.js` file. It should `fetch` with `method: "POST"`, appropriate headers, and a JSON body, and return the parsed response.
- Wire it into a `handleCreatePost` function wrapped in `useCallback`, following the pattern on the "useCallback & memo" slide (`isCreating`, `createError`, try/catch/finally).
- On success, prepend the new post to `posts` state using the functional updater form (`setPosts(prev => [newPost, ...prev])`) — **do not** re-fetch the whole list.
- Disable the submit button while `isCreating` is true.

---

## Section 4 — `memo()` in practice

Extract a `PostCard` component that renders a single post (`username`, `caption`, `likes`).

- Wrap it in `memo()`.
- In the parent `Posts` component, pass `PostCard` an `onLike` handler prop (see Section 5) wrapped in `useCallback`.
- Add a console log inside `PostCard` (`console.log("Rendering", post.username)`) and verify in the browser console that typing in your new-post form does **not** re-render every existing `PostCard`. If it does, figure out why (this is the actual point of the exercise — the slides tell you `memo` + `useCallback` prevent unnecessary re-renders, but you need to prove it to yourself).

---

## Section 5 — Harder: optimistic likes with rollback

This goes beyond anything in the slides.

- Add a "Like" button to each `PostCard`.
- On click, **immediately** increment that post's `likes` in local state (optimistic update) — don't wait for the server.
- Fire off a `PATCH` request to `http://localhost:3001/posts/:id` in the background updating the `likes` count.
- If the `PATCH` request fails, roll the like count back and show a small inline error on that specific post card only (not a page-wide error).

**Why this is hard:** you have to manage state that changes *before* the network confirms it, and undo it correctly if the network call fails — without messing up other posts' state.

---

## Section 6 — Harder: cancel stale requests with `AbortController`

Imagine a user navigates from `/posts/1` to `/posts/2` quickly, before the fetch for post 1 has resolved. Without cancellation, post 1's data could still land and briefly flash on screen for post 2.

- In `Post.jsx`, create an `AbortController` inside the `useEffect`.
- Pass `{ signal: controller.signal }` to `fetch`.
- Return a cleanup function from `useEffect` that calls `controller.abort()`.
- In your `catch` block, check whether the error is an abort (`error.name === "AbortError"`) and **do not** set the `error` state in that case — an aborted request isn't a real error the user should see.
- Prove it works: throttle your network in DevTools (Slow 3G), rapidly click between two post links, and confirm no flashing/incorrect data appears.

---

## Section 7 — Harder: search with debouncing

Add a search input above the posts list that filters by caption text.

- The filtering itself should happen against posts already fetched — **no new network request per keystroke.**
- However, log every time the filter actually runs, and add a 300ms debounce using `useEffect` + `setTimeout` (clear the timeout in the cleanup function) so the filter doesn't run on every single keystroke.
- Bonus: show a "No posts match your search" message when the filtered list is empty.

---

## Self-check before you call it done

- [ ] No hardcoded post data remains anywhere in the app
- [ ] Every fetch has a loading state and an error state that's actually rendered
- [ ] `Post.jsx` correctly distinguishes a 404 from a network failure
- [ ] New posts appear without a full re-fetch
- [ ] `PostCard` is wrapped in `memo`, and you've verified in the console that it isn't over-rendering
- [ ] Liking a post updates instantly and rolls back correctly on a simulated failure
- [ ] Rapid navigation between post pages doesn't show stale data (AbortController works)
- [ ] Search doesn't refire on every keystroke

If you get all of these working from scratch without looking back at the slides, you're in good shape for the real Practical 5.
