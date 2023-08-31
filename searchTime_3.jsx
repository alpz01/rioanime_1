const RealTimeSearch = () => {
    const [searchValue, setSearchValue] = React.useState('');
    const [posts, setPosts] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const url = 'https://dev-testing-website.blogspot.com/feeds/posts/default?alt=json';

    const searchPosts = (searchValue) => {
        if (searchValue.length === 0) {
            setPosts([]);
            return;
        }
        if (searchValue.length <= 1) {
            return;
        }
        setIsLoading(true);
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const posts = data.feed.entry;
                const filteredPosts = posts.filter(post => post.title.$t.includes(searchValue)).slice(0, 10);
                setPosts(filteredPosts);
                setIsLoading(false);
            })
            .catch(error => {
                setError(error);
                setIsLoading(false);
            });
    }

    const handleInputChange = (event) => {
        setSearchValue(event.target.value);
        searchPosts(event.target.value);
    }

    return (
        <div>
            <input
                type="text"
                value={searchValue}
                onChange={handleInputChange}
            />
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {posts.length === 0 && searchValue.length > 1 && !isLoading && (
                <p><center>"{searchValue}" NO POST FOUND</center></p>
            )}
            <ul style={{
                height: posts.length > 5 ? '400px' : '',
                overflowY: posts.length > 5 ? 'scroll' : 'unset'
            }}>
                {posts.map(post => {
                    const title = post.title.$t;
                    const labels = post.category ? post.category.map(category => category.term).join(', ') : 'No Label';
                    const postLink = post.link.find(link => link.rel === 'alternate').href;
                    let imageLink = 'no_image_url';
                    const regex = /<div[^>]*class="separator"[^>]*>[\s\S]*?<img[^>]*src="([^"]*)"/;
                    const match = post.content.$t.match(regex);
                    if (match) {
                        imageLink = match[1];
                    }
                    return (
                        <li key={post.id.$t}>
                            <a href={postLink}>
                                <div className="live-search-thumb"><img src={imageLink} /></div>
                                <div className="over">
                                    <div className="autotitle">{title}</div><span className="live-meta">{labels}</span>
                                </div>
                            </a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

const searchPT = document.querySelector('.cari-input');
const root_k = ReactDOM.createRoot(searchPT);
root_k.render(<RealTimeSearch />);
