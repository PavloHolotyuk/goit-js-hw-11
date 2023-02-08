import axios from 'axios';

export class ApiService {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '31174976-e4ea20c1e3f3139c1b6ab1378';

  constructor() {
    this.page = null;
    this.per_page = 40;
    this.searchQuery = null;
  }

  fetchPhotos() {
    const searchParams = {
      params: {
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.page,
        key: this.#API_KEY,
        per_page: this.per_page,
      },
    };
    return axios.get(`${this.#BASE_URL}`, searchParams);
  }
}
