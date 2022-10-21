import axios from 'axios';

let page = 1;
let totalPages = 0;

axios.defaults.baseURL = 'https://pixabay.com/api/';
axios.defaults.params = {
  key: '30736325-a2e05b73da6ab6fbbbda5c6db',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
};

export async function requestPixabayApi(result) {
  const data = await axios.get('', {
    params: { q: result, page: page },
  });

  return data;
}

export function incrementPage() {
  page += 1;
}

export function calculateTotalPage(newPage) {
  return (totalPages += newPage);
}

export function resetPage() {
  page = 1;
}

export function totalPagesNull() {
  totalPages = 0;
}
