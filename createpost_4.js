let storedDubData = [];
let storedSubData = [];
let storedMovieData = [];
let count = 1;
let label = "Dub";
let page = 0;

fetchData(label, count, page);

function fetchData(label, count, page) {
    let startIndex = page * count;
    let url = `https://www.googleapis.com/blogger/v3/blogs/1287659878380255414/posts?labels=${label}&key=AIzaSyCJ6jdZ4LyxrYTxLUg9QxnM8N0Rs8I73_E`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            let items = data.items.slice(startIndex, startIndex + count);
            storedPost({items: items}, label, count)
        });
}

function trackPost(position) {
    if (position === "next") {
        document.getElementById("prevbtn").disabled = false;
        page++;
    } else if (position === "prev") {
        document.getElementById("nextbtnBall").disabled = false;
        if (page > 0) {
            page--;
            if (page * count >= storedDubData.length) {
                page--;
            }
        } else {
            document.getElementById("prevbtn").disabled = true;
            console.log("NO POST");
            return;
        }
    }
    fetchData(label, count, page);
}


function storedPost(data, label, count) {
    let items = data.items;
    let dataToStore;
    if (label === "Dub") {
        dataToStore = storedDubData;
    } else if (label === "Sub") {
        dataToStore = storedSubData;
    } else if (label === "Movie") {
        dataToStore = storedMovieData;
    }
    dataToStore.length = 0;
    for (let i = 0; i < items.length && i < count; i++) {
        let post = items[i];
        let title = post.title;
        let postLink = post.url;
        let thumbnail = "NO TAGS";
        if (post.images) {
            thumbnail = post.images[0].url;
        } else if (post.content.includes("separator")) {
            let tempDiv = document.createElement("div");
            tempDiv.innerHTML = post.content;
            let imgElement = tempDiv.querySelector(".separator img");
            if (imgElement) {
                thumbnail = imgElement.src;
            }
        }
        let type = "NO TAGS", scores = "NO TAGS", ep = "NO TAGS", view = "NO TAGS";
        if (post.labels) {
            let labels = post.labels;
            for (let j = 0; j < labels.length; j++) {
                let label = labels[j];
                if (["Sub", "Dub"].includes(label)) {
                    type = label;
                } else if (!isNaN(label)) {
                    scores = label;
                } else if (label.startsWith("Ep")) {
                    ep = label.slice(3);
                } else if (["movie", "tv", "ova"].includes(label.toLowerCase())) {
                    view = label;
                }
            }
        }
        let formattedPost = {Title: title, Scores: scores, PostLink: postLink, Ep: ep, Type: type, View: view, Thumbnail: thumbnail};
        dataToStore.push(formattedPost);
    }

    showPostData(label);
}

function showPostData(label) {
    let dataToDisplay;
    if (label === "Dub") {
        dataToDisplay = storedDubData;
    } else if (label === "Sub") {
        dataToDisplay = storedSubData;
    } else if (label === "Movie") {
        dataToDisplay = storedMovieData;
    }

    if (dataToDisplay.length === 0) {
        document.getElementById("nextbtnBall").disabled = true;
        console.log("NO POST");
    } else {
      	clearPosts();
        const root = ReactDOM.createRoot(document.getElementById('testPostLang'));
        for (let i = 0; i < dataToDisplay.length; i++) {
            let post = dataToDisplay[i];
            console.log(`Title: ${post.Title} | Scores: ${post.Scores} | PostLink: ${post.PostLink} | Ep: ${post.Ep} | Type: ${post.Type} | View: ${post.View} | Thumbnail: ${post.Thumbnail}`);
          	root.render(<CreatePost post={post} />);
        }
    }
}

function clearPosts() {
    let container = document.getElementById("testPostLang");
    container.style.opacity = 0;
    setTimeout(() => {
        container.innerHTML = "";
        container.style.opacity = 1;
    }, 500);
}


function CreatePost({ post }) {
    return (
        <div className="hentry play c:hover-eee" role="feed">
            <a className="block ofc relative poster r3 oh" href={post.PostLink} title={post.Title}>
                <img alt={post.Title} className="ar-2sx h-max w-max" loading="lazy" src={post.Thumbnail} />
                <div className="absolute b-0 p-y2x6b0 ep fs-13 c-eee blr5 trr8">
                    <span>Ep {post.Ep}</span>
                </div>
                <div className="absolute t-0 p-y2x6b0 sc fs-13 c-eee tlr5 brr8">
                    <div className="rating-prc">
                        <div className="rtp">
                            <div className="rtb"><span style={{width: `${post.Scores * 10}%`}}></span></div>
                        </div>
                        <div className="num" content={post.Scores}>{post.Scores}</div>
                    </div>
                </div>
                <div className="absolute b-0 r-0 fs-13 c-eee brr5 tlr8 dir ttu">
                    <span className={post.Type.toLowerCase()}>{post.Type}</span>
                    <span className={post.View.toLowerCase()}>{post.View}</span>
                </div>
            </a>
            <h3 className="clamp oh tac mt-8">
                <a className="fs-md fw-400 c-aba" href={post.PostLink}>{post.Title}</a>
            </h3>
        </div>
    );
}


