const blogPostKey = "AIzaSyCJ6jdZ4LyxrYTxLUg9QxnM8N0Rs8I73_E";
const blogPostID = "1287659878380255414";


const RealTimeSearch = () => {
    axios.get(`https://www.googleapis.com/blogger/v3/blogs/${blogPostID}/posts?key=${blogPostKey}`)
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        });

    return (
        <>
            <form action='/search'>
                <input autocomplete='off' class='cari-input' name='q' placeholder='Search Anime'
                    required='required' type='text' />
                <label class='cari-ikon a f' for='cari'>
                    <svg viewBox='0 0 24 24'>
                        <circle cx='11.7666' cy='11.7666' r='8.98856' />
                        <path d='M18.0183 18.4851L21.5423 22' />
                    </svg>
                </label>
            </form>
        </>
    )
}
