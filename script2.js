const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameElement = document.getElementById('website-name');
const websiteUrlElement = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = {};

// Show modal, focus on input
function showModal() {
    modal.classList.add('show-modal');
    websiteNameElement.focus();
}

// Modal Event Listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
// Hide modal when clicking outside of it
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));

//validate form
function validate(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if(!nameValue || !urlValue) {
        alert('Please submit values for both fields');
        return false;
    }
    if(!urlValue.match(regex)) {
        alert('Please provide a valid web address');
        return false;
    }
    //valid
    return true;
}

// Build bookmarks DOM
function buildBookmarks() {
    // Remove all bookmark elements
    bookmarksContainer.textContent = '';
    // Build items
    Object.keys(bookmarks).forEach((id) => {
        const { name, url } = bookmarks[id];
        // Create item
        const item = document.createElement('div');
        item.classList.add('item');
        // Close icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);

         // Favicon / Link container
         const linkInfo = document.createElement('div');
         linkInfo.classList.add('webinfo');
 
         // Favicon
         const favicon = document.createElement('img');
         favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
         favicon.setAttribute('alt', 'Favicon');
 
         //website name
         const webName = document.createElement('h2');
         webName,textContent = name;
         webName.classList.add('website-name');
         webName.textContent = name;
         
         // Link
         const link = document.createElement('a');
         link.setAttribute('href', `${url}`);
         link.setAttribute('target', '_blank');
         link.textContent = url;
 
         // Append elements to linkInfo
         linkInfo.appendChild(favicon);
         linkInfo.appendChild(webName);
         linkInfo.appendChild(link);
 
          // Append linkInfo and closeIcon to item
          item.appendChild(closeIcon);
          item.appendChild(linkInfo);
 
         // Append to bookmarks container
         bookmarksContainer.appendChild(item);
    });
}

// fetch bookmarks from localstorage
function fetchBookmarks() {
    //get bookmarks from localstorage if available
    if(localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } 
    else {
        //create bookmarks array in localstorage
        const id = `https://thecodingphoenix.com/`
        bookmarks[id] = {
            name: 'The Coding Phoenix',
            url: 'https://thecodingphoenix.com/',
        }
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

// delete bookmark
function deleteBookmark(id) {
    // Loop through the bookmarks array
	if (bookmarks[id]) {
		delete bookmarks[id];
	}
    //update bookmarks array in localStorage, re-populate DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}

//handle data from form
function storeBookmark(e) {
    e.preventDefault();
    const nameValue = websiteNameElement.value;
    let urlValue = websiteUrlElement.value;
    if(!urlValue.includes('https://', 'https://')){
        urlValue = `https://${urlValue}`;
    }
    if(!validate(nameValue, urlValue)) {
        return false;
    }
    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks[urlValue] = bookmark;
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameElement.focus();
}

//event listener
bookmarkForm.addEventListener('submit', storeBookmark);

// on load, fetch bookmarks
fetchBookmarks();