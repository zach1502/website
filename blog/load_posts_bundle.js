(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// require fs


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
    const files = ["17-11-2022_Hello World! - About the Site_.html"];
    
    // parse the display name from the file name
    let posts = [];

    // date_display_.html
    for(let file_index in files){
        let file = files[file_index];
        const display_name = file.split('_')[1];

        posts.push({
            path: file,
            display: display_name,
        });
    }

    // by default in old to new order
    return posts.reverse();
}


},{}]},{},[1]);
