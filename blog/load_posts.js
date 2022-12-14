// require fs
const fs = require('fs');

document.onreadystatechange = () => {
    // Need to wait for iframes to load
    if (document.readyState === 'complete') {
        LoadPosts();
    }
};

async function LoadPosts(){
    let posts = await GetPosts();
    //console.log(posts);

    // insert the first post as a link into class="latest"
    let latest = document.getElementsByClassName('latest')[0];
    let latest_post = posts[0];
    latest.innerHTML = `<li><a href="./posts/${latest_post.path}">${latest_post.display}</a></li>`;

    // insert the rest of the posts into class="older"
    let older = document.getElementsByClassName('older')[0];
    if(posts.length == 1){
        older.innerHTML = `<li>No older posts :(</li>`;
    }
    for (let i = 1; i < posts.length; i++) {
        older.innerHTML += `<li><a href="./posts/${posts[i].path}">${posts[i].display}</a></li>`;
    }
}

async function GetPosts(){
    // Get all html files in posts directory
    const files = fs.readdirSync('./blog/posts');
    
    // parse the display name from the file name
    let posts = [];

    // date_display_.html
    for(let file_index in files){
        let file = files[file_index];
        console.log(file);
        const display_name = file.split('_')[1];

        // push to front of array
        posts.unshift({
            display: display_name,
            path: file
        });
    }

    // by default in old to new order
    return posts;
}

