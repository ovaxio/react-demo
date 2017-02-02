// import { normalize } from 'normalizr';
import { camelizeKeys } from 'humps';
import 'isomorphic-fetch';
import fixture from './fixture';

let dataJson = fixture;
const API_ROOT = 'http://localhost:3000/';
const URL = `${API_ROOT}students`;
const URL_SLASH = `${API_ROOT}students/`;


const getStudentIndex = function(data, studentId) {
    return Object.values(data).findIndex((el) => el.id === studentId );
}


// Generate a MongoDB ObjectId -  https://gist.github.com/solenoid/1372386
const objectId = function () {
    var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
};

export function call(url, params = {}) {
    let manipulate;
    if (url.substr(0, 4) !== 'http') {
        url = API_ROOT + url;
    }
    
    // const REQUESTS = {
    //     get   : ,
    //     create   : url === URL && params.method === 'post',
    //     update   : url.indexOf(URL) > -1 && params.method === 'put',
    //     "delete" : url.indexOf(URL) > -1 && params.method === 'delete'
    // };

    switch (true) {
        case url === URL && params.method === 'post':
            manipulate = (data, params) => {
                let newStudent = JSON.parse(params.body);
                newStudent.id = objectId();
                // data.push(JSON.parse(newStudent));
                return {response: newStudent};
            } 
            break;

        case url.indexOf(URL_SLASH) > -1 && params.method === 'put':
            manipulate = (data, params) => {
                let studentIdx = getStudentIndex(data, url.substr(URL_SLASH.length));
                data[studentIdx] = JSON.parse(params.body);
                return {response: data[studentIdx]};
            } 
            break;

        case url.indexOf(URL_SLASH) > -1 && params.method === 'delete':
            manipulate = (data, params) => {
                let studentIdx = getStudentIndex(data, url.substr(URL_SLASH.length));
                return {response: data[studentIdx]};
            } 
            break;

        case url === URL && params.method === undefined: 
            manipulate = (data, params) => ({response: data});
            break;
    }

    const camelizedJson = camelizeKeys(dataJson);

    return manipulate(camelizedJson, params);
}
