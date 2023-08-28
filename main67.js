const showrecomendmenu = () => {
    console.log('show recomend menu')
}

const reportError = () => {
    console.log('report error')
}

const startTrack = () => {
    console.log('start track')
}


const updatecheck = () => {
    console.log('update check')
}


const openiframe = (event) => {
    if (event.target.matches('.playbutton')) {
        // Re-enable all buttons
        const buttons = document.querySelectorAll('.playbutton');
        buttons.forEach((button) => {
            button.disabled = false;
        });

        // Disable the clicked button
        const value = event.target.textContent;
        openlink(value);
        console.log(value);
        event.target.disabled = true;
    }
}

const openlink = (value) => {
    let iframe = document.getElementById("iframeplayer");
    iframe.src = `https://www.youtube.com/embed/${videoLinks[value - 1]}`;

    document.getElementById("eptitleplace").textContent = `EP ${value}`;
}


function generateButton(btnEpNum) {
    let buttons = [];
    for (let i = 0; i < btnEpNum; i++) {
        if (i == 0) {
            buttons.push(<button key={i} className="playbutton btn btn-primary" disabled={true} onClick={openiframe}>{i + 1}</button>);
        } else {
            buttons.push(<button key={i} className="playbutton btn btn-primary" onClick={openiframe}>{i + 1}</button>);
        }
    }
    return buttons;
}


function showMore() {
    let hidecomment = document.querySelector('#comments');
    const info = document.querySelector('#info');
    const animeBtn2 = document.getElementById('animebtn2');

    if (info.style.display === 'block') {
        info.style.display = 'none';
        animeBtn2.textContent = 'More info';
        hidecomment.style.margin = '1.66rem 0';
    } else {
        info.style.display = 'block';
        animeBtn2.textContent = 'Less info';
        hidecomment.style.margin = '0';
    }
};


function stream() {
    const iframe = document.getElementById('iframeplayer');
    let streamType = 'Video Stream';
    if (iframe) {
        const url = iframe.src;
        if (url.includes('youtube.com')) {
            streamType = 'YouTube Stream';
        } else if (url.includes('drive.google.com')) {
            streamType = 'Gdrive Stream';
        }
    }
    return <div id="streamtype">{streamType}</div>;
}

function PlayerSection() {
    let postTitle = document.querySelector('.info .title').textContent;
    let postStatus = document.querySelector('#postDStatus').textContent;

    const followedPosts = JSON.parse(localStorage.getItem('rioAnimePostData')) || [];
    const [isFollowed, setIsFollowed] = React.useState(followedPosts.includes(postTitle));

    const followToggle = () => {
        const followedPosts = JSON.parse(localStorage.getItem('rioAnimePostData')) || [];
    
        if (followedPosts.includes(postTitle)) {
            followedPosts.splice(followedPosts.indexOf(postTitle), 1);
            localStorage.setItem('rioAnimePostData', JSON.stringify(followedPosts));
            setIsFollowed(false);
            console.log("Removed");
        } else {
            followedPosts.push(postTitle);
            localStorage.setItem('rioAnimePostData', JSON.stringify(followedPosts));
            setIsFollowed(true);
            console.log("Saved");
        }
    }

    let isRealoded = false;
    const reloadIframe = () => {
        const notif = document.getElementById('notifprompt');
    
        if (!isRealoded) {
            notif.style.display = 'block';
            notif.textContent = "Reloading";
            setTimeout(() => {
                notif.style.display = 'none';
            }, 2000);
            isRealoded = true;
            setTimeout(() => {
                isRealoded = false;
            }, 10000);
        } else {
            notif.style.display = 'block';
            notif.textContent = "Don't Spam";
            setTimeout(() => {
                notif.style.display = 'none';
            }, 2000);
        }
    }
    
    function postGenres() {
        const genresSpan = document.getElementById('postDGenre');
        const genreLinks = genresSpan.getElementsByTagName('a');
        const genres = Array.from(genreLinks).map((link, index) => (
            <a key={index} href={link.href} rel={link.rel}>
                {link.textContent}
            </a>
        ));

        return <>{genres}</>;
    }

    return (
        <div className="playerpage">
            <div className="subpart eptitle">
                <div id="eptitle"><span id="eptitleplace">EP 1</span><span className="altsourcenotif">Internal Player</span></div>
                <div id="toprightplayer">
                    <i className="fa-solid fa-repeat">
                        <span className="tooltiptext">Switch</span>
                    </i>
                    <i className="fa-solid fa-lightbulb">
                        <span className="tooltiptext">Lights</span>
                    </i>
                    <i className="fa-solid fa-download">
                        <span className="tooltiptext">Download</span>
                    </i>
                    <i className="fa-solid fa-wand-sparkles">
                        <span className="tooltiptext">Autoplay</span>
                    </i>
                    <i onClick={null} id="nextbtn" className="glyphicon glyphicon-forward" style={{ color: 'gray', cursor: 'default' }}>
                        <span className="tooltiptext">Next ep</span>
                    </i>
                </div>
            </div>

            <div id="iframecontainer">
                <iframe id="iframeplayer" allowFullScreen={true} scrolling="no" src={`https://www.youtube.com/embed/${videoLinks[0]}`} style={{ minHeight: '0px' }}></iframe>
            </div>

            <div id="lowerplayerpage">
                <div id="aligncenter">
                    <div id="streamtypecontainer">
                        {stream}
                        <div id="showrecomendbtn" onClick={showrecomendmenu} style={{ display: 'inline-block' }}>
                            <i className="glyphicon glyphicon-cog"></i>
                            <span id="changetext">Change</span>
                        </div>
                        <div id="sharebtn">
                            <i className="glyphicon glyphicon-share-alt"></i>
                            <span id="shareText" style={{ display: 'inline' }}>Share</span>
                        </div>
                        <div id="openreport" onClick={reportError} style={{ display: 'block' }}>
                            <i className="fa-solid fa-circle-exclamation"></i>
                            <span className="reportText">Report</span>
                        </div>
                        <div id="reloadbtn" style={{ display: 'block' }} onClick={reloadIframe}>
                            <i className="fa fa-refresh" aria-hidden="true"></i>
                            <span className="reportText">Reload</span>
                        </div>
                        <div id="screenshotbtn" style={{ display: 'block' }}>
                            <i className="glyphicon glyphicon-camera"></i>
                        </div>
                        <div id="widescreenbtn">  
                            <i className="glyphicon glyphicon-fullscreen"></i>
                        </div>
                    </div>
                    <a id="animebtn" href="/anime/50203" style={{ display: 'inline' }}>
                        <svg stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="25" width="25" id="foldersvg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"></path>
                        </svg>
                    </a>
                    <span className="animetitle">{postTitle}</span>
                    <button id="trackbtn" onClick={startTrack()}>
                        <i className="glyphicon glyphicon-plus"></i> Watchlist
                    </button>
                    <button id="followbtn" onClick={followToggle} style={{ display: 'inline' }}>
                        <i className="fa-solid fa-bell"></i> {isFollowed ? 'Followed' : 'Follow'}
                    </button>
                    <br />
                    <div id="animeimage"></div>
                    <span id="notice" style={{ display: 'none' }}>
                        <br /><br /><br />Try clear cache &amp; make sure your browser extension not block javascript<br /><br /><br />
                    </span>
                </div>
                <div id="epslistplace" onClick={openiframe}>
                    {generateButton(btnEpNum)}
                </div>
                <div id="flexbottom">
                    <div id="bottomleft">
                        <span id="genres">Genres:{postGenres()}</span><br />
                        <span id="status">Status : {postStatus}</span>
                        <span id="animeinfobottom" style={{ display: 'block' }}><a id="animebtn2" onClick={showMore}>More info</a></span>
                    </div>
                    <div className="epsavailable">
                        Ep total : <span id="epsavailable">{btnEpNum}</span> <a onClick={updatecheck()} id="updatebtn"><i className="glyphicon glyphicon-refresh"></i></a>
                        <div id="playercountdown" style={{ color: 'gray' }}>Next: Unknown</div>
                    </div>
                </div>
            </div>
            <div id="notifprompt">Don't Spam</div>
        </div>
    )
}


const container = document.getElementById('playerSection');
const root = ReactDOM.createRoot(container);
root.render(<PlayerSection />);
