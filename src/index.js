import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '28043876-d01bb93c634d22751608058fc';

const searchForm = document.querySelector('#search-form');
const loadMore = document.querySelector('.load-more');
const photoGallery = document.querySelector('.gallery');

searchForm.addEventListener('submit', onSearch);
loadMore.addEventListener('click', onLoadMore);

let searchQuery;
let page = 1;

function getPhotos () {
    return axios.get(`${BASE_URL}?key=${KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`)
    .then(data => {
        console.log(data);
        console.log(page);
        page += 1;
        return data;
    });
}

function resetPage() {
    page = 1;
}

function onSearch(evt) {
    evt.preventDefault();
    searchQuery = evt.currentTarget.elements.searchQuery.value;
    resetPage();
    getPhotos()
    .then(data => {
        const dataArray = data.data.hits;
        console.log(dataArray);
        photoGallery.insertAdjacentHTML('beforeend',createPhotoMarcup(dataArray));
    });
}

function onLoadMore() {
    getPhotos()
    .then(data => {
        const dataArray = data.data.hits;
        console.log(dataArray);
        photoGallery.insertAdjacentHTML('beforeend',createPhotoMarcup(dataArray));
    });
}

function createPhotoMarcup(arr) {
    return arr.map(({webformatURL, tags, likes, views, comments, downloads} = arr) =>
    `<div class="photo-card">
<img src="${webformatURL}" alt="${tags}" loading="lazy" />
<div class="info">
<p class="info-item">
<b>Likes</b>${likes}
</p>
<p class="info-item">
<b>Views</b>${views}
</p>
<p class="info-item">
<b>Comments</b>${comments}
</p>
<p class="info-item">
<b>Downloads</b>${downloads}
</p>
</div>
</div>`).join('');
}


// async function getUser() {
//     try {
//       const response = await axios.get('/user?ID=12345');
//       console.log(response);
//     } catch (error) {
//       console.error(error);
//     }
//   }

// <div class="photo-card">
//   <img src="" alt="" loading="lazy" />
//   <div class="info">
//     <p class="info-item">
//       <b>Likes</b>
//     </p>
//     <p class="info-item">
//       <b>Views</b>
//     </p>
//     <p class="info-item">
//       <b>Comments</b>
//     </p>
//     <p class="info-item">
//       <b>Downloads</b>
//     </p>
//   </div>
// </div>