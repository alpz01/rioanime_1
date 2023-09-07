const btnEpNum = postData[0];
const sourceType = postData[1];

const showrecomendmenu = () => {
    console.log("show recomend menu");
};

const reportError = () => {
    console.log("report error");
};

const updatecheck = () => {
    console.log("update check");
};

const displayCountdown = (notifMessage, setNotifMessage, callback) => {
    const notif = document.getElementById("notifprompt");
    notif.style.display = "block";
    setNotifMessage("Downloading Setup ...");
    let counter = 8;
    const intervalId = setInterval(() => {
        if (counter >= 7) {
            setNotifMessage(`Please wait ... ${counter}`);
        } else if (counter >= 5) {
            setNotifMessage(`Getting Ready!!! ${counter}`);
        } else if (counter >= 2) {
            setNotifMessage(`Let's Go!!! ${counter}`);
        } else if (counter === 1) {
            setNotifMessage(`Almost there!!! ${counter}`);
        }
        counter--;

        if (counter < 0) {
            clearInterval(intervalId);
            setNotifMessage("Awesome!");
            setTimeout(() => {
                notif.style.display = "none";
                callback();
            }, 1000);
        }
    }, 1000);
};

const plyrIo = (value) => {
    return <VideoPlayer videoSources={[videoLinks[value - 1]]} />;
};

const showMore = () => {
    let hidecomment = document.querySelector("#comments");
    const info = document.querySelector("#info");
    const animeBtn2 = document.getElementById("animebtn2");

    const isInfoVisible = info.style.display === "block";
    info.style.display = isInfoVisible ? "none" : "block";
    animeBtn2.textContent = isInfoVisible ? "More info" : "Less info";
    hidecomment.style.margin = isInfoVisible ? "1.66rem 0" : "0";
};

class VideoPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.videoRef = React.createRef();
        this.state = {
            videoSrc: props.videoSources[props.currentEpisode - 1],
        };
        this.handleVideoEnd = this.handleVideoEnd.bind(this);
    }

    componentDidMount() {
        this.player = new Plyr(this.videoRef.current, {});
        this.player.on("ended", this.handleVideoEnd);

        // Check if there is a stored time and set the video to that time
        const storedTime = localStorage.getItem("videoTime");
        if (storedTime) {
            this.videoRef.current.currentTime = parseFloat(storedTime);
        }
    }

    componentWillUnmount() {
        this.player.destroy();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.currentEpisode !== this.props.currentEpisode) {
            this.setState({
                videoSrc: this.props.videoSources[this.props.currentEpisode - 1],
            });
        }
    }

    handleVideoEnd() {
        if (!this.props.autoPlay) {
            return;
        }

        if (this.props.currentEpisode < this.props.videoSources.length) {
            const notif = document.getElementById("notifprompt");
            notif.style.display = "block";

            let counter = 5;
            this.props.setNotifMessage(`Next Video... ${counter}`);
            const intervalId = setInterval(() => {
                counter--;
                if (counter > 0) {
                    this.props.setNotifMessage(`Next Video... ${counter}`);
                } else {
                    clearInterval(intervalId);
                    this.props.setNotifMessage("Enjoy Watching!");
                    setTimeout(() => {
                        this.props.setCurrentEpisode(this.props.currentEpisode + 1);

                        if (this.props.autoPlay) {
                            const buttons = document.querySelectorAll(".playbutton");
                            buttons.forEach((btn) => {
                                btn.disabled = false;
                            });

                            const nextButton = Array.from(buttons).find(
                                (btn) =>
                                    btn.textContent === (this.props.currentEpisode + 1).toString()
                            );
                            if (nextButton) {
                                nextButton.disabled = true;
                            }
                        }
                        setTimeout(() => {
                            notif.style.display = "none";
                        }, 1000);
                    }, 1000);
                }
            }, 1000);
        }
    }

    restart() {
        this.player.stop();
        this.player.restart();
    }

    render() {
        return (
            <div>
                <video
                    ref={this.videoRef}
                    src={this.state.videoSrc}
                    controls
                    autoPlay
                ></video>
            </div>
        );
    }
}

function PlayerSection() {
    let postTitle = document.querySelector(".info .title").textContent;
    let postStatus = document.querySelector("#postDStatus").textContent;
    const videoPlayerRef = React.useRef();

    const [notifMessage, setNotifMessage] = React.useState("");
    const followedPosts =
        JSON.parse(localStorage.getItem("rioAnimePostData")) || [];
    const [isFollowed, setIsFollowed] = React.useState(
        followedPosts.includes(postTitle)
    );
    const [iframeSrc, setIframeSrc] = React.useState("");
    const [currentEpisode, setCurrentEpisode] = React.useState(1);
    const [player, setPlayer] = React.useState(null);
    const [autoPlay, setAutoplay] = React.useState(false);

    const handleButtonClick = (button, episodeNumber) => {
        // Re-enable all buttons
        const buttons = document.querySelectorAll(".playbutton");
        buttons.forEach((btn) => {
            btn.disabled = false;
        });

        // Disable the clicked button
        button.disabled = true;
        setCurrentEpisode(episodeNumber);
    };

    React.useEffect(() => {
        openlink(currentEpisode);

        if (sourceType === "archive") {
            const playerInstance = new VideoPlayer({
                videoSources: videoLinks,
            });
            setPlayer(playerInstance);
        }
    }, [currentEpisode, sourceType]);

    const downloadVideo = () => {
        const iframe = document.getElementById("iframeplayer");
        if (sourceType === "yt") {
            if (iframe.src.includes("drive.google.com")) {
                displayCountdown(notifMessage, setNotifMessage, () => {
                    const id = iframe.src.split("/")[5];
                    location.href = `https://drive.google.com/u/0/uc?id=${id}&export=download`;
                });
            }
        } else {
            showNotification("Not Applicable", 1500);
        }
    };

    const [switchAutoPlay, setSwitchAutoPlay] = React.useState(
        localStorage.getItem("autoPlayPreference") === "on"
    );

    const autoPlayVideo = () => {
        if (sourceType === "archive") {
            if (switchAutoPlay) {
                showNotification("AutoPlay On", 1000);
                setAutoplay(true);
                localStorage.setItem("autoPlayPreference", "on");
            } else {
                showNotification("AutoPlay Off", 1000);
                setAutoplay(false);
                localStorage.setItem("autoPlayPreference", "off");
            }
            setSwitchAutoPlay(!switchAutoPlay);
        } else {
            showNotification("Not Applicable", 1500);
        }
    };

    const openlink = (value) => {
        document.getElementById("eptitleplace").textContent = `EP ${value}`;

        if (sourceType === "yt") {
            setIframeSrc(`https://www.youtube.com/embed/${videoLinks[value - 1]}`);
        } else if (sourceType === "gdrive") {
            setIframeSrc(
                `https://drive.google.com/file/d/${videoLinks[value - 1]}/preview`
            );
        } else if (sourceType === "archive") {
            plyrIo(value);
        }
    };

    const plyrIo = (value) => {
        if (player) {
            player.setState({
                videoSrc: player.props.videoSources[value - 1],
            });
            console.log(value);
        }
    };

    const followToggle = () => {
        const followedPosts =
            JSON.parse(localStorage.getItem("rioAnimePostData")) || [];

        if (followedPosts.includes(postTitle)) {
            followedPosts.splice(followedPosts.indexOf(postTitle), 1);
            localStorage.setItem("rioAnimePostData", JSON.stringify(followedPosts));
            setIsFollowed(false);
            console.log("Removed");
        } else {
            followedPosts.push(postTitle);
            localStorage.setItem("rioAnimePostData", JSON.stringify(followedPosts));
            setIsFollowed(true);
            console.log("Saved");
        }
    };

    const showNotification = (message, duration = 1000) => {
        setNotifMessage(message);
        const notif = document.getElementById("notifprompt");
        notif.style.display = "block";
        setTimeout(() => {
            notif.style.display = "none";
        }, duration);
    };

    const [isReloaded, setReloaded] = React.useState(false);
    const reloadIframe = () => {
        const notif = document.getElementById("notifprompt");
        const iframe = document.getElementById("iframeplayer");

        if (!isReloaded) {
            if (sourceType === "archive" && player) {
                showNotification("Restarting");
                videoPlayerRef.current.restart();
            } else {
                const tempSrc = iframe.src;
                iframe.src = "";
                showNotification("Reloading");
                iframe.src = tempSrc;
            }

            setReloaded(true);
            setTimeout(() => {
                setReloaded(false);
            }, 10000);
        } else {
            showNotification("Don't Spam");
        }
    };

    function ButtonGroup({ numberOfButtons, onClick }) {
        const buttons = [];
        for (let i = 0; i < numberOfButtons; i++) {
            const button = (
                <button
                    key={i}
                    className="playbutton btn btn-primary"
                    disabled={i + 1 === currentEpisode}
                    onClick={(event) => onClick(event.target, i + 1)}
                >
                    {i + 1}
                </button>
            );
            buttons.push(button);
        }

        return <>{buttons}</>;
    }

    function postGenres() {
        const genresSpan = document.getElementById("postDGenre");
        const genreLinks = genresSpan.getElementsByTagName("a");
        const genres = Array.from(genreLinks).map((link, index) => (
            <a key={index} href={link.href} rel={link.rel}>
                {link.textContent}
            </a>
        ));

        return <>{genres}</>;
    }

    function stream() {
        return sourceType === "yt"
            ? "YouTube Stream"
            : sourceType === "gdrive"
                ? "GDrive Stream"
                : "Video Stream";
    }

    return (
        <div className="playerpage">
            <div className="subpart eptitle">
                <div id="eptitle">
                    <span id="eptitleplace">EP 1</span>
                    <span className="altsourcenotif">
                        {sourceType === "archive" ? "Internal Player" : "External Player"}
                    </span>
                </div>
                <div id="toprightplayer">
                    <i className="fa-solid fa-repeat">
                        <span className="tooltiptext">Switch</span>
                    </i>
                    <i className="fa-solid fa-lightbulb">
                        <span className="tooltiptext">Lights</span>
                    </i>
                    <i className="fa-solid fa-download" onClick={downloadVideo}>
                        <span className="tooltiptext">Download</span>
                    </i>
                    <i className="fa-solid fa-wand-sparkles" onClick={autoPlayVideo}>
                        <span className="tooltiptext">Autoplay</span>
                    </i>
                    <i
                        onClick={null}
                        id="nextbtn"
                        className="glyphicon glyphicon-forward"
                        style={{ color: "gray", cursor: "default" }}
                    >
                        <span className="tooltiptext">Next ep</span>
                    </i>
                </div>
            </div>
            <div
                id="iframecontainer"
                className={
                    sourceType === "yt" || sourceType === "gdrive" ? "responYt" : ""
                }
            >
                {sourceType === "archive" ? (
                    <VideoPlayer
                        ref={videoPlayerRef}
                        videoSources={videoLinks}
                        currentEpisode={currentEpisode}
                        autoPlay={autoPlay}
                        setCurrentEpisode={setCurrentEpisode}
                        setNotifMessage={setNotifMessage}
                    />
                ) : (
                    <iframe
                        id="iframeplayer"
                        src={iframeSrc}
                        allowFullScreen={true}
                        scrolling="no"
                        style={{ minHeight: "0px" }}
                    ></iframe>
                )}
            </div>
            <div id="lowerplayerpage">
                <div id="aligncenter">
                    <div id="streamtypecontainer">
                        <div id="streamtype">{stream()}</div>
                        <div
                            id="showrecomendbtn"
                            onClick={showrecomendmenu}
                            style={{ display: "inline-block" }}
                        >
                            <i className="glyphicon glyphicon-cog"></i>
                            <span id="changetext">Change</span>
                        </div>
                        <div id="sharebtn">
                            <i className="glyphicon glyphicon-share-alt"></i>
                            <span id="shareText" style={{ display: "inline" }}>
                                Share
                            </span>
                        </div>
                        <div
                            id="openreport"
                            onClick={reportError}
                            style={{ display: "block" }}
                        >
                            <i className="fa-solid fa-circle-exclamation"></i>
                            <span className="reportText">Report</span>
                        </div>
                        <div
                            id="reloadbtn"
                            style={{ display: "block" }}
                            onClick={reloadIframe}
                        >
                            <i className="fa fa-refresh" aria-hidden="true"></i>
                            <span className="reportText">Reload</span>
                        </div>
                        <div id="screenshotbtn" style={{ display: "block" }}>
                            <i className="glyphicon glyphicon-camera"></i>
                        </div>
                        <div id="widescreenbtn">
                            <i className="glyphicon glyphicon-fullscreen"></i>
                        </div>
                    </div>
                    <a id="animebtn" href="/anime/50203" style={{ display: "inline" }}>
                        <svg
                            stroke="currentColor"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            height="25"
                            width="25"
                            id="foldersvg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
                            ></path>
                        </svg>
                    </a>
                    <span className="animetitle">{postTitle}</span>
                    <button
                        id="followbtn"
                        onClick={followToggle}
                        style={{ display: "inline" }}
                    >
                        <i className="fa-solid fa-bell"></i>{" "}
                        {isFollowed ? "Followed" : "Follow"}
                    </button>
                    <br />
                    <div id="animeimage"></div>
                    <span id="notice" style={{ display: "none" }}>
                        <br />
                        <br />
                        <br />
                        Try clear cache &amp; make sure your browser extension not block
                        javascript
                        <br />
                        <br />
                        <br />
                    </span>
                </div>
                <div id="epslistplace">
                    <ButtonGroup numberOfButtons={btnEpNum} onClick={handleButtonClick} />
                </div>
                <div id="flexbottom">
                    <div id="bottomleft">
                        <span id="genres">Genres:{postGenres()}</span>
                        <br />
                        <span id="status">Status : {postStatus}</span>
                        <span id="animeinfobottom" style={{ display: "block" }}>
                            <a id="animebtn2" onClick={showMore}>
                                More info
                            </a>
                        </span>
                    </div>
                    <div className="epsavailable">
                        Ep total : <span id="epsavailable">{btnEpNum}</span>{" "}
                        <a onClick={updatecheck} id="updatebtn">
                            <i className="glyphicon glyphicon-refresh"></i>
                        </a>
                        <div id="playercountdown" style={{ color: "gray" }}>
                            Next: Unknown
                        </div>
                    </div>
                </div>
            </div>
            <div id="notifprompt">{notifMessage}</div>
        </div>
    );
}

const container = document.getElementById("playerSection");
const root = ReactDOM.createRoot(container);
root.render(<PlayerSection />);