let storedDubData = [];
let storedSubData = [];
let storedMovieData = [];
let storedAllData = [];
let postTargetLabel = "";
let postTargetCount = 0;
let page = 0;

const subBtn = document.getElementById("subBtnhome");
const dubBtn = document.getElementById("dubBtnhome");
const movieBtn = document.getElementById("movieBtnhome");
const allBtn = document.getElementById("allBtnhome");

const prevBtn = document.getElementById("prevbtn");
const nextBtnBall = document.getElementById("nextbtnBall");

function handleClick(btn) {
    prevBtn.disabled = false;
    nextBtnBall.disabled = false;
    page = 0;

    // Clear the appropriate stored data array based on the button that was clicked
    switch (btn) {
        case "Sub":
            storedSubData = [];
            break;
        case "Dub":
            storedDubData = [];
            break;
        case "Movie":
            storedMovieData = [];
            break;
        case "All":
            storedAllData = [];
            break;
    }

    fetchData(btn, 2);
}

subBtn.addEventListener("click", () => handleClick("Sub"));
dubBtn.addEventListener("click", () => handleClick("Dub"));
movieBtn.addEventListener("click", () => handleClick("Movie"));
allBtn.addEventListener("click", () => handleClick("All"));


async function fetchData(label, count) {
    let startIndex = page * count;
    let url;
    if (label === "All") {
        // If the label is "All", remove the labels query parameter from the URL
        url = `https://www.googleapis.com/blogger/v3/blogs/1287659878380255414/posts?key=AIzaSyCJ6jdZ4LyxrYTxLUg9QxnM8N0Rs8I73_E`;
    } else {
        // Otherwise, include the labels query parameter in the URL
        url = `https://www.googleapis.com/blogger/v3/blogs/1287659878380255414/posts?labels=${label}&key=AIzaSyCJ6jdZ4LyxrYTxLUg9QxnM8N0Rs8I73_E`;
    }
    postTargetLabel = label;
    postTargetCount = count;

    try {
        const response = await axios.get(url);
        const data = response.data;
        if (data.items) {
            // Slice the items based on the startIndex and count
            const items = data.items.slice(startIndex, startIndex + count);
            console.log(items)
            storedPost({ items }, label, count);
        } else {
            console.error('No items found for label:', label);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


function trackPost(e) {
    switch (e) {
        case "next":
            prevBtn.disabled = !1;
            page++;
            break;
        case "prev":
            if (nextBtnBall.disabled = !1, !(page > 0)) return void(prevBtn.disabled = !0);
            page--;
    }
    fetchData(postTargetLabel, postTargetCount)
}


function storedPost(data, label, count) {
    let items = data.items;
    let dataToStore;

    // Determine the dataToStore based on the label
    switch (label) {
        case "Dub":
            dataToStore = storedDubData;
            break;
        case "Sub":
            dataToStore = storedSubData;
            break;
        case "Movie":
            dataToStore = storedMovieData;
            break;
        case "All":
            dataToStore = storedAllData;
            break;
        default:
            dataToStore = [];
    }

    // Clear the dataToStore array
    dataToStore.length = 0;

    // Iterate over the items and format the post data
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

        let type = "NO TAGS";
        let scores = "NO TAGS";
        let ep = "NO TAGS";
        let view = "NO TAGS";

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

        let formattedPost = {
            Title: title,
            Scores: scores,
            PostLink: postLink,
            Ep: ep,
            Type: type,
            View: view,
            Thumbnail: thumbnail
        };

        dataToStore.push(formattedPost);
    }

    showPostData(label);
}


function showPostData(label) {
  // Get the data to display based on the label
  let dataToDisplay;
  switch (label) {
    case 'Dub':
      dataToDisplay = storedDubData;
      break;
    case 'Sub':
      dataToDisplay = storedSubData;
      break;
    case 'Movie':
      dataToDisplay = storedMovieData;
      break;
    case 'All':
      dataToDisplay = storedAllData;
      break;
    default:
      dataToDisplay = [];
  }

  // If there is no data to display
  if (dataToDisplay.length === 0) {
    document.getElementById('nextbtnBall').disabled = true;
    page--;
    console.log('NO POST');
  } else {
    // Clear existing posts
    clearPosts();

    // Create the root once
    const container = document.getElementById('testPostLang1');
    const root = ReactDOM.createRoot(container);

    // Iterate over the data and display each post
    dataToDisplay.forEach((post) => {
      // Log the post details
      console.log(
        `Title: ${post.Title} | Scores: ${post.Scores} | PostLink: ${post.PostLink} | Ep: ${post.Ep} | Type: ${post.Type} | View: ${post.View} | Thumbnail: ${post.Thumbnail}`
      );

      // Update the content by calling the render method on the existing root
      root.render(<CreatePost post={post} />);
    });
  }
}

  
  function clearPosts() {
    let postContainer = document.getElementById('testPostLang1');
    postContainer.innerHTML = '';
  }
  
  function CreatePost ({ post }) {
    return (
      <div className="hentry play c:hover-eee" role="feed">
        <a
          className="block ofc relative poster r3 oh"
          href={post.PostLink}
          title={post.Title}
        >
          <img
            alt={post.Title}
            className="ar-2sx h-max w-max"
            loading="lazy"
            src={post.Thumbnail}
          />
          <div className="absolute b-0 p-y2x6b0 ep fs-13 c-eee blr5 trr8">
            Ep {post.Ep}
          </div>
          <div className="absolute t-0 p-y2x6b0 sc fs-13 c-eee tlr5 brr8">
            <div className="rating-prc">
              <div className="rtp">
                <div className="rtb">
                  <span style={{ width: 10 * post.Scores + '%' }}></span>
                </div>
              </div>
              <div className="num" content={post.Scores}>
                {post.Scores}
              </div>
            </div>
          </div>
          <div className="absolute b-0 r-0 fs-13 c-eee brr5 tlr8 dir ttu">
            <span className={post.Type.toLowerCase()}>{post.Type}</span>
            <span className={post.View.toLowerCase()}>{post.View}</span>
          </div>
        </a>
        <h3 className="clamp oh tac mt-8">
          <a className="fs-md fw-400 c-aba" href={post.PostLink}>
            {post.Title}
          </a>
        </h3>
      </div>
    );
  };
  
