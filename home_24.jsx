  return (
                        <div key={key} className="hentry play c:hover-eee">
                            <a className="block ofc relative poster r3 oh" href={postLink} title={title}>
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
                        </div>
                    );
                })}
            </div>
        </>
    )
}

const post = document.getElementById('testPostLang1');
const root = ReactDOM.createRoot(post);
root.render(<PostContainer />);
