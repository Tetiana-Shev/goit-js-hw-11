import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createImageCards } from './createImageCards';
import {
    requestPixabayApi,
    calculateTotalPage,
    resetPage,
    totalPagesNull,
    incrementPage,
} from './requestPixabayApi.js';
import { getRefs } from './refs';

let searchInput = '';

//змінні
const refs = getRefs();

// події
refs.form.addEventListener('submit', handleSubmit);

// бібліотека галереї
const simple = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
});

// функції для форми
function handleSubmit(e) {
    e.preventDefault();

  // значення, що ввів користувач
    searchInput = e.currentTarget.elements.searchQuery.value.trim().toLowerCase();
    refs.div.innerHTML = '';
    resetPage();
    totalPagesNull();
  // якщо пусто
    if (searchInput.length === 0) {
    Notify.info('The field cannot be empty!');
    return;
    }
  // за допомогою аксіос вигружаєсо з бекенда дані
    requestPixabayApi(searchInput)
    .then(({ data: { hits, totalHits } }) => {
      // якщо по запиту нічого не знайдено
        if (totalHits === 0) {
            return Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.',
            {
            position: 'left-top',
            }
        );
        }
      // якщо знайдено  - кількість знайдених зображень 
        Notify.success(`Hooray! We found ${totalHits} images.`);

        refs.div.insertAdjacentHTML('beforeend', createImageCards(hits));

        simple.refresh();
        if (calculateTotalPage(hits.length) >= totalHits) {
        
        Notify.info(
            "We're sorry, but you've reached the end of search results.",
            {
            position: 'center-center',
            }
        );
        refs.loadBtn.classList.add('is-hidden');
        return;
        }
        observer.observe(document.querySelector('.photo-card:last-child'));
    })
    .catch(error => {
        console.log(error);
    });
  refs.div.innerHTML = '';
}

const options = {
  root: null,
  rootMargin: '100px',
  threshold: 1.0,
};

const callback = async function (entries, observer) {
    entries.forEach(async entry => {
    if (entry.isIntersecting) {
        incrementPage();
        observer.unobserve(entry.target);
        const {
        data: { hits, totalHits },
        } = await requestPixabayApi(searchInput);

        try {
        refs.div.insertAdjacentHTML('beforeend', createImageCards(hits));

        if (calculateTotalPage(hits.length) >= totalHits) {
            observer.unobserve(entry.target);
            Notify.info(
            "We're sorry, but you've reached the end of search results."
            );
            return;
        }
        observer.observe(document.querySelector('.photo-card:last-child'));
        } catch (error) {
        console.log(error);
        refs.div.innerHTML = '';
        }
    }
    });
};

const observer = new IntersectionObserver(callback, options);