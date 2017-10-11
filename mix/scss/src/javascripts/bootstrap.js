import axios from 'axios';
import lodash from 'lodash';
import Pace from 'node-pace-progress';


/**
 * jQuery
 */

try {
    window.$ = window.jQuery = require('jquery');

    require('bootstrap-sass');
} catch (e) {}


/**
 * Pace
 */

window.Pace = Pace;


/**
 * Lodash
 */

window._ = lodash;


/**
 * Axios
 */

window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

let token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}