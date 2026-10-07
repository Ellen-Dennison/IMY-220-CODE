// Student Number: u23849259
function SearchPosts({ value, onChange }) {
    return (
        <section className="search-posts">
            <input
                type="text"
                placeholder="Search by username or caption"
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        </section>
    );
}

export default SearchPosts;