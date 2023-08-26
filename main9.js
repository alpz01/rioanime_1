const switchToLive = () => {
    console.log('switch to live')
}

const lighttoggle = () => {
    console.log('light toggle')
}

const download = () => {
    console.log('download')
}

const toggleautoplay = () => {
    console.log('toggle autoplay')
}

const showrecomendmenu = () => {
    console.log('show recomend menu')
}

const reportError = () => {
    console.log('report error')
}

const startTrack = () => {
    console.log('start track')
}

const followtoggle = () => {
    console.log(btnEpNum);
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
    iframe.src = `https://www.youtube.com/embed/${value - 1}`;
}

function generateButton(btnEpNum) {
    let buttons = [];
    for (let i = 0; i < btnEpNum; i++) {
        buttons.push(<button key={i} className="playbutton btn btn-primary" onClick={openiframe}>{i + 1}</button>);
    }
    return buttons;
}


class PlayerSection extends React.Component {
    render() {
        return (
            <div className="playerpage">
                <div className  ="subpart eptitle">
                    <div id="eptitle"><span id="eptitleplace">EP 5</span><span className="altsourcenotif">Internal Player</span></div>
                    <div id="toprightplayer">
                        <i onClick={switchToLive} className="proxybtn glyphicon glyphicon-transfer" style={{ color: 'white' }}>
                            <span className="tooltiptext">Switch</span>
                        </i>
                        <i onClick={lighttoggle} className="lightbtn glyphicon glyphicon-sunglasses">
                            <span className="tooltiptext">Lights</span>
                        </i>
                        <i onClick={download} className="dlbutton glyphicon glyphicon-download-alt">
                            <span className="tooltiptext">Download</span>
                        </i>
                        <i onClick={toggleautoplay} className="autoplaybutton glyphicon glyphicon-flash">
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
                            <div id="streamtype">GOGO Stream</div>
                            <div id="showrecomendbtn" onClick={showrecomendmenu} style={{ display: 'inline-block' }}>
                                <i className="glyphicon glyphicon-cog"></i>
                                <span id="changetext">Change</span>
                            </div>
                            <div id="sharebtn">
                                <i className="glyphicon glyphicon-share-alt"></i>
                                <span id="shareText" style={{ display: 'inline' }}>Share</span>
                            </div>
                            <div id="openreport" onClick={reportError} style={{ display: 'block' }}>
                                <i className="glyphicon glyphicon-exclamation-sign"></i>
                                <span className="reportText">Report</span>
                            </div>
                            <div id="reloadbtn" style={{ display: 'block' }}>
                                <i className="glyphicon glyphicon-repeat"></i>
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
                        <span className="animetitle">Love Live! Superstar!! 2nd Season</span>
                        <button id="trackbtn" onClick={startTrack}>
                            <i className="glyphicon glyphicon-plus"></i> Watchlist
                        </button>
                        <button id="followbtn" onClick={followtoggle} style={{ display: 'inline' }}>
                            <i className="glyphicon glyphicon-bell"></i> Follow
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
                            <span id="genres">Genres : <a href="/?genre=Slice of Life">Slice of Life</a>, <a href="/?genre=Idols-Female">Idols-Female</a>, <a href="/?genre=Music">Music</a>, <a href="/?genre=School">School</a></span><br />
                            <span id="status">Status : Ongoing</span>
                            <span id="animeinfobottom" style={{ display: 'block' }}><a id="animebtn2" href="/anime/50203">More info</a></span>
                        </div>
                        <div className="epsavailable">
                            Ep total : <span id="epsavailable">5</span> <a onClick={updatecheck} id="updatebtn"><i className="glyphicon glyphicon-refresh"></i></a>
                            <div id="playercountdown" style={{ color: 'gray' }}>Next: Unknown</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById('playerSection'));
root.render(<PlayerSection />);
