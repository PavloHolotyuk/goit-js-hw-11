import { ApiService } from './js/ApiPixabay';
import createPhotoCards from './templates/photocard.hbs';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 350,
});

const apiService = new ApiService();

const formEl = document.querySelector('#search-form');
const divEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

formEl.addEventListener('submit', onFormSubmit);

async function onFormSubmit(event) {
  event.preventDefault();
  apiService.page = 1;
  apiService.searchQuery = event.target.elements.searchQuery.value.trim();
  if (!apiService.searchQuery) {
    Notiflix.Notify.failure('Потрібно щось ввести');
    loadMoreBtn.classList.add('is-hidden');
    return;
  } else {
    try {
      divEl.innerHTML = '';
      const { data } = await apiService.fetchPhotos();
      renderPhoto(data);
    } catch {
      error => console.log(error);
    }
  }
}

function renderPhoto(data) {
  if (data.totalHits === 0) {
    Notiflix.Notify.failure('Таких фото немає');
    loadMoreBtn.classList.add('is-hidden');
    return;
  } else if (
    apiService.page === Math.ceil(data.totalHits / apiService.per_page)
  ) {
    divEl.innerHTML = createPhotoCards(data.hits);
    Notiflix.Notify.warning('Це усі фото');
    loadMoreBtn.classList.add('is-hidden');
    lightbox.refresh();
    return;
  }

  Notiflix.Notify.success(`Ось що ми знайшли ${data.total} фото`);
  divEl.innerHTML = createPhotoCards(data.hits);
  lightbox.refresh();
  loadMoreBtn.classList.remove('is-hidden');
  loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
}

async function onLoadMoreBtnClick(event) {
  apiService.page += 1;
  try {
    const { data } = await apiService.fetchPhotos();
    if (apiService.page === Math.ceil(data.total / apiService.per_page)) {
      divEl.insertAdjacentHTML('beforeend', createPhotoCards(data.hits));
      Notiflix.Notify.warning('Це усі фото');
      loadMoreBtn.classList.add('is-hidden');
      return;
    }
    if (data)
      divEl.insertAdjacentHTML('beforeend', createPhotoCards(data.hits));
    Notiflix.Notify.info('Ще фото');
    lightbox.refresh();
  } catch (error) {
    console.log(error);
  }
}
