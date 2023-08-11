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
        const response = await fetch(url);
        const data = await response.json();
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
            // Disable the next button if there are no more posts to display after clicking it
            if ((page + 1) * postTargetCount >= storedDubData.length || (page + 1) * postTargetCount >= storedSubData.length || (page + 1) * postTargetCount >= storedMovieData.length || (page + 1) * postTargetCount >= storedAllData.length) {
                nextBtnBall.disabled = true;
            }
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
        case "Dub":
            dataToDisplay = storedDubData;
            break;
        case "Sub":
            dataToDisplay = storedSubData;
            break;
        case "Movie":
            dataToDisplay = storedMovieData;
            break;
        case "All":
            dataToDisplay = storedAllData;
            break;
        default:
            dataToDisplay = [];
    }

    // If there is no data to display
    if (dataToDisplay.length === 0) {
        document.getElementById("nextbtnBall").disabled = true;
        console.log("NO POST");
    } else {
        // Clear existing posts
        clearPosts();

        // Iterate over the data and display each post
        dataToDisplay.forEach(post => {
            // Log the post details
            console.log(`Title: ${post.Title} | Scores: ${post.Scores} | PostLink: ${post.PostLink} | Ep: ${post.Ep} | Type: ${post.Type} | View: ${post.View} | Thumbnail: ${post.Thumbnail}`);

            // Create the post element
            createPost(post);
        });
    }
}

           
  
function clearPosts() {
    let postContainer = document.getElementById("testPostLang1");
    postContainer.innerHTML = "";
}

function createPost(post) {
    const container = document.getElementById("testPostLang1");
    const postElement = document.createElement('div');
    postElement.className = "hentry play c:hover-eee";
    postElement.setAttribute("role", "feed");

    const posterElement = document.createElement('a');
    posterElement.className = "block ofc relative poster r3 oh";
    posterElement.href = post.PostLink;
    posterElement.title = post.Title;
    postElement.appendChild(posterElement);

    const thumbnailElement = document.createElement('img');
    thumbnailElement.alt = post.Title;
    thumbnailElement.className = "ar-2sx h-max w-max";
    thumbnailElement.loading = "lazy";
    thumbnailElement.src = post.Thumbnail;
    posterElement.appendChild(thumbnailElement);

    const epElement = document.createElement('div');
    epElement.className = "absolute b-0 p-y2x6b0 ep fs-13 c-eee blr5 trr8";
    epElement.textContent = `Ep ${post.Ep}`;
    posterElement.appendChild(epElement);

    const ratingElement = document.createElement('div');
    ratingElement.className = "absolute t-0 p-y2x6b0 sc fs-13 c-eee tlr5 brr8";
    posterElement.appendChild(ratingElement);

    const ratingPrcElement = document.createElement('div');
    ratingPrcElement.className = "rating-prc";
    ratingElement.appendChild(ratingPrcElement);

    const rtpElement = document.createElement('div');
    rtpElement.className = "rtp";
    ratingPrcElement.appendChild(rtpElement);

    const rtbElement = document.createElement('div');
    rtbElement.className = "rtb";
    rtpElement.appendChild(rtbElement);

    const scoresElement = document.createElement('span');
    scoresElement.style.width = `${post.Scores * 10}%`;
    rtbElement.appendChild(scoresElement);

    const numElement = document.createElement('div');
    numElement.className = "num";
    numElement.textContent = post.Scores;
    numElement.setAttribute("content", post.Scores);
    ratingPrcElement.appendChild(numElement);

    const typeElement = document.createElement('span');
    typeElement.className = post.Type.toLowerCase();
    typeElement.textContent = post.Type;

    const viewElement = document.createElement('span');
    viewElement.className = post.View.toLowerCase();
    viewElement.textContent = post.View;

    const typeViewElement = document.createElement('div');
    typeViewElement.className = "absolute b-0 r-0 fs-13 c-eee brr5 tlr8 dir ttu";
    typeViewElement.appendChild(typeElement);
    typeViewElement.appendChild(viewElement);
    posterElement.appendChild(typeViewElement);

    const titleElement = document.createElement('h3');
    titleElement.className = "clamp oh tac mt-8";
    postElement.appendChild(titleElement);

    const titleLinkElement = document.createElement('a');
    titleLinkElement.className = "fs-md fw-400 c-aba";
    titleLinkElement.href = post.PostLink;
    titleLinkElement.textContent = post.Title;
    titleElement.appendChild(titleLinkElement);

    container.appendChild(postElement);
}
