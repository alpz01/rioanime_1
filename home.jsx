const url = 'https://dev-testing-website.blogspot.com/feeds/posts/default?alt=json&max-results=25';
fetch(url)
  .then(response => response.json())
  .then(data => {
    console.log(data);
	console.log(data.feed.entry);
  })
  .catch(error => {
    console.error('Error:', error);
  });
