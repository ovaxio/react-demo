import { normalize } from 'normalizr';
import { camelizeKeys } from 'humps';
import 'isomorphic-fetch';

const API_ROOT = 'https://localhost:3000/';

export function call(url, params = {}, schema) {
    if (url.substr(0, 4) !== 'http') {
        url = API_ROOT + url;
    }

    return fetch(url, params)
        .then(response => response.json().then(json => ({ json, response })))
        .then(({ json, response }) => {
            if (!response.ok) {
                return Promise.reject(json);
            }

            const camelizedJson = camelizeKeys(json);

            return Object.assign({}, schema ? normalize(camelizedJson, schema) : camelizedJson);
        })
        .then(response => ({ response }))
        .catch(error => (Promise.reject({ error: error.message || 'Something bad happened' })));
}
