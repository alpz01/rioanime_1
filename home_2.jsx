function PostMenu() {
    return (
        <div>
            <a className='tablinks' href='/search'>All</a>
            <a className='tablinks' href='/search/label/Sub'>Sub</a>
            <a className='tablinks' href='/search/label/Dub'>Dub</a>
            <a className='tablinks' onClick={() => feelingLucky()}>Random</a>
        </div>
    );
}
  

const menu = document.getElementById('playerSection');
const root = ReactDOM.createRoot(menu);
root.render(<PostMenu />);
