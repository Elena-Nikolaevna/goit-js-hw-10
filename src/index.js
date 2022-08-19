import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';
import { displayCountryList, displayCountryCard } from './template';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputSearch: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const { inputSearch, countryList, countryInfo } = refs;

inputSearch.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  e.preventDefault();
  let search = inputSearch.value;
  // console.log('search: ',search);
  if (search.trim() === '') {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }

  fetchCountries(search.trim())
    .then(countries => {
      // console.log(countries);
      if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
        return;
      }

      if (countries.length > 1 && countries.length <= 10) {
        const markup = countries.map(country => displayCountryList(country));
        countryList.innerHTML = markup.join('');
        countryInfo.innerHTML = '';
      }

      if (countries.length === 1) {
        const cardMarcup = countries.map(country => displayCountryCard(country));
        countryList.innerHTML = '';
        countryInfo.innerHTML = cardMarcup.join('');
      }
    })

    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      return error;
    });
}
