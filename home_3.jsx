function GeneratePost() {
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        const url = "https://dev-testing-website.blogspot.com/feeds/posts/default?alt=json&max-results=25";
        fetch(url)
            .then(response => response.json())
            .then(data => {
                setData(data.feed.entry);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    return (
        <div>
            {data.map(post => {
                let title = post.title.$t;
                let score = -1;
                let ep = "No Item";
                let type = "No Item";
                let view = "No Item";
                let postLink = post.link[4].href;
                let imageLink = "No Item";

                post.category.forEach(category => {
                    const term = category.term;
                    if (term == "Sub" || term == "Dub") {
                        type = term;
                    } else if (term.startsWith("Ep") || term.startsWith("ep")) {
                        ep = term;
                    } else if (!isNaN(term)) {
                        score = Number(term);
                    } else if (term == "Movie" || term == "Ova" || term == "Tv") {
                        view = term;
                    }
                });

                const parser = new DOMParser();
                const doc = parser.parseFromString(post.content.$t, "text/html");
                const img = doc.querySelector(".separator img");
                if (img) {
                    imageLink = img.src;
                }

                return (
                    <a key={post.id} className="block ofc relative poster r3 oh" href={postLink} title={title}>
                        <img alt={title} className="ar-2sx h-max w-max" loading="lazy" src={imageLink} />
                        <div className="absolute b-0 p-y2x6b0 ep fs-13 c-eee blr5 trr8">
                            <span>{ep}</span>
                        </div>
                        <div className="absolute t-0 p-y2x6b0 sc fs-13 c-eee tlr5 brr8">
                            <div className="rating-prc">
                                <div className="rtp">
                                    <div className="rtb"><span style={{ width: `${score * 10}%` }}></span></div>
                                </div>
                                <div className="num" content={score}>{score}</div>
                            </div>
                        </div>
                        <div className="absolute b-0 r-0 fs-13 c-eee brr5 tlr8 dir ttu">
                            {type && <span className={type.toLowerCase()}>{type}</span>}
                            {view && <span className={view.toLowerCase()}>{view}</span>}
                        </div>
                    </a>
                );
            })}
        </div>
    );
}

function PostMenu() {
    return (
        <div>
            <a className='tablinks' href='/search'>All</a>
            <a className='tablinks' href='/search/label/Sub'>Sub</a>
            <a className='tablinks' href='/search/label/Dub'>Dub</a>
            <a className='tablinks'>Random</a>
        </div>
    );
}

const menu = document.getElementById('playerSection');
const root = ReactDOM.createRoot(menu);
root.render(<PostMenu />);

const container = document.getElementById('testPostLang1');
const root_1 = ReactDOM.createRoot(container);
root_1.render(<GeneratePost />);
