const postsPerPage = 2;
const getDataPost = async (label) => {
    const url = `https://dev-testing-website.blogspot.com/feeds/posts/default/-/${label}?alt=json`;
    const storedDataKey = `ppRR${label}`;
    const storedData = localStorage.getItem(storedDataKey);

    if (storedData) {
        return JSON.parse(storedData);
    } else {
        try {
            const response = await axios.get(url);
            const data = response.data.feed.entry;
            localStorage.setItem(storedDataKey, JSON.stringify(data));
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
};

const postBtnSDM = async (label, setData, setPage) => {
    try {
        const data = await getDataPost(label);
        setData(data);
        setPage(0);
    } catch (error) {
        console.error('Error:', error);
    }
};

const randomPost = (data) => {
    if (data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        const postLink = data[randomIndex].link[4].href;
        window.open(postLink, '_blank');
    }
};

const prevPost = (page, setPage) => {
    if (page > 0) {
        setPage(page - 1);
    }
};

const nextPost = (page, setPage, dataLength) => {
    if ((page + 1) * postsPerPage < dataLength) {
        setPage(page + 1);
    }
};

const GeneratePostComponent = React.memo((props) => {
    const { data, page } = props;
    return generatePost(data, page);
});

const generatePost = (data, page) => {
    const startIndex = page * postsPerPage;
    const endIndex = Math.min(startIndex + postsPerPage, data.length);
    return data.slice(startIndex, endIndex).map((post, index) => {
        const key = index.toString();
        const title = post.title.$t;
        let score = -1;
        let ep = 'No Item';
        let type = 'No Item';
        let view = 'No Item';
        let postLink = post.link[4].href;
        let imageLink = 'No Item';

        post.category.forEach((category) => {
            const term = category.term;
            if (term === 'Sub' || term === 'Dub') {
                type = term;
            } else if (term.startsWith('Ep')) {
                ep = term;
            } else if (!isNaN(term)) {
                score = Number(term);
            } else if (term === 'Movie' || term === 'Ova' || term === 'TV') {
                view = term;
            }
        });

        const regex = /<div[^>]*class="separator"[^>]*>[\s\S]*?<img[^>]*src="([^"]*)"/;
        const match = post.content.$t.match(regex);
        if (match) {
            imageLink = match[1];
        }

        return (
            <>
                    <li>
                        <a href={postLink} title={title}>
                            <div class="searchimg">
                                <img class="resultimg" alt="" src={imageLink} />
                                <div class="rating"><i class="fa-solid fa-star" style={{ color: 'yellow' }}>{score}</i></div>
                            </div>
                        </a>
                        <div class="details">
                            <span class="name"><a href={postLink} title={title}>{title}</a></span>
                            <span class="infotext">{ep}</span>
                        </div>
                    </li>
            </>
        );
    });

}

const PostContainer = () => {
    const [data, setData] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const url = 'https://dev-testing-website.blogspot.com/feeds/posts/default?alt=json&max-results=25';
    const storedDataKey = 'pppDatapostrr';

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(url);
                const responseData = response.data.feed.entry;
                setData(responseData);
                localStorage.setItem(storedDataKey, JSON.stringify(responseData));
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <div className='mb-10 flex jcsb'>
                <h2 className='lh-2 c-fff fw-500'>Recently updated</h2>
                <div className='flex aic'>
                    <div className='flex aic tabs'>
                        <a className='tablinks' onClick={() => { setData(JSON.parse(localStorage.getItem(storedDataKey))); setPage(0); }}>
                            All
                        </a>
                        <a className='tablinks' onClick={() => postBtnSDM('Sub', setData, setPage)}>
                            Sub
                        </a>
                        <a className='tablinks' onClick={() => postBtnSDM('Dub', setData, setPage)}>
                            Dub
                        </a>
                        <a className='tablinks' onClick={() => postBtnSDM('Movie', setData, setPage)}>
                            Movie
                        </a>
                        <a className='tablinks' onClick={() => randomPost(data)}>
                            Random
                        </a>
                        <span className='paging'>
                            <a className='tablinks' onClick={() => prevPost(page, setPage)}>
                                <i className="fa-solid fa-angle-left"></i>
                            </a>
                            <a className='tablinks' onClick={() => nextPost(page, setPage, data.length)}>
                                <i className="fa-solid fa-angle-right"></i>
                            </a>
                        </span>
                    </div>
                </div>
            </div>
            <div id="resultplace"><ul id="resultload" class="searchresult"><GeneratePostComponent data={data} page={page} /></ul></div>
        </>
    );
};



const post = document.getElementById('testPostLang1');
const root = ReactDOM.createRoot(post);
root.render(<PostContainer />);
