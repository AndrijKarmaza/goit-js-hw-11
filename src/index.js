import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '28043876-d01bb93c634d22751608058fc';
const PHOTO_PER_PAGE = 40;

const searchForm = document.querySelector('#search-form');
const loadMore = document.querySelector('.load-more');
const photoGallery = document.querySelector('.gallery');

searchForm.addEventListener('submit', onSearch);
loadMore.addEventListener('click', onLoadMore);

let searchQuery;
let page = 1;
let loadPhotoNumber = PHOTO_PER_PAGE*page;



async function getPhotos () {
    try {return await axios.get(`${BASE_URL}?key=${KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${PHOTO_PER_PAGE}`)
        .then(data => {
            loadPhotoNumber = PHOTO_PER_PAGE*page;
            if (data.data.totalHits && loadPhotoNumber > data.data.totalHits) {
                loadMore.classList.add('is-hiden');
                Notify.failure("We're sorry, but you've reached the end of search results.");
            }
            page += 1;
            return data;
        });
    } catch (error) {
              console.error(error);
    }
}

function resetPage() {
    page = 1;
}

function onSearch(evt) {
    evt.preventDefault();
    loadMore.classList.add('is-hiden');
    clearPhotoMarcup();
    searchQuery = evt.currentTarget.elements.searchQuery.value;
    resetPage();
    getPhotos()
    .then(data => {
        const dataArray = data.data.hits;

        if (!dataArray.length) {
            Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            return;
        }
        photoGallery.insertAdjacentHTML('beforeend',createPhotoMarcup(dataArray));
        loadMore.classList.remove('is-hiden');
    });
}

function onLoadMore() {
    getPhotos()
    .then(data => {
        const dataArray = data.data.hits;
        photoGallery.insertAdjacentHTML('beforeend',createPhotoMarcup(dataArray));
    });
}

function createPhotoMarcup(arr) {
    return arr.map(({webformatURL, tags, likes, views, comments, downloads} = arr) =>
    `<div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" width = '356px'/>
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

function clearPhotoMarcup() {
    photoGallery.innerHTML = '';
}