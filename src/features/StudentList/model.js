/*global __API_URL__*/
import { takeLatest, takeEvery } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { Schema, arrayOf } from 'normalizr';
import  * as api  from '../../services/fixtureApi';
import { unionArrayCustomizer } from '../../utils/lodashUtils';
import _ from 'lodash';



// ------------------------------------
// Constants
// ------------------------------------
const API_BASE_URL = `http://localhost:3000/students`; 

const STUDENTS_REQUESTED = 'STUDENTS_REQUESTED';
const STUDENTS_SUCCEEDED = 'STUDENTS_SUCCEEDED';
const STUDENTS_FAILED = 'STUDENTS_FAILED';

const STUDENT_REQUESTED = 'STUDENT_REQUESTED';
const STUDENT_SUCCEEDED = 'STUDENT_SUCCEEDED';
const STUDENT_FAILED = 'STUDENT_FAILED';

const ADD_STUDENT_REQUESTED = 'ADD_STUDENT_REQUESTED';
const ADD_STUDENTS_SUCCEEDED = 'ADD_STUDENTS_SUCCEEDED';
const ADD_STUDENTS_FAILED = 'ADD_STUDENTS_FAILED';

const UPDATE_STUDENT_REQUESTED = 'UPDATE_STUDENT_REQUESTED';
const UPDATE_STUDENTS_SUCCEEDED = 'UPDATE_STUDENTS_SUCCEEDED';
const UPDATE_STUDENTS_FAILED = 'UPDATE_STUDENTS_FAILED';

const DELETE_STUDENT_REQUESTED = 'DELETE_STUDENT_REQUESTED';
const DELETE_STUDENT_SUCCEEDED = 'DELETE_STUDENT_SUCCEEDED';
const DELETE_STUDENT_FAILED = 'DELETE_STUDENT_FAILED';

// ------------------------------------
// Schemas
// ------------------------------------
const StudentSchema = new Schema('students');
const StudentsArray = { students: arrayOf(StudentSchema) };
const StudentItem = { student: StudentSchema };

// ------------------------------------
// Actions
// ------------------------------------
export const getStudentsAction = () => ({ type: STUDENTS_REQUESTED });
export const getStudentAction = StudentId => ({ type: STUDENT_REQUESTED, payload: StudentId });
export const createStudentAction = Student => ({ type: ADD_STUDENT_REQUESTED, payload: Student });
export const updateStudentAction = Student => ({ type: UPDATE_STUDENT_REQUESTED, payload: Student });
export const deleteStudentAction = StudentId => ({ type: DELETE_STUDENT_REQUESTED, payload: StudentId });

// ------------------------------------
// Subroutines
// ------------------------------------
function* getStudents() {
    try {
        const Students = yield call(api.call, `${API_BASE_URL}`, {});

        yield put({ type: STUDENTS_SUCCEEDED, Students });
    } catch (e) {
        yield put({ type: STUDENTS_FAILED, message: e.message });
    }
}

function* getStudent(action) {
    try {
        const Student = yield call(api.call, `${API_BASE_URL}/${action.payload}`, {}, StudentItem);

        yield put({ type: STUDENT_SUCCEEDED, Student });
    } catch (e) {
        yield put({ type: STUDENT_FAILED, message: e.message });
    }
}

function* createStudent(action) {
    try {
        const Student = yield call(api.call, `${API_BASE_URL}`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(action.payload)
        }, true, StudentItem);

        yield put({ type: ADD_STUDENTS_SUCCEEDED, Student });
    } catch (e) {
        yield put({ type: ADD_STUDENTS_FAILED, message: e.message });
    }
}

function* updateStudent(action) {
    try {
        const Student = yield call(api.call, `${API_BASE_URL}/${action.payload.id}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(action.payload)
        }, StudentItem);

        yield put({ type: UPDATE_STUDENTS_SUCCEEDED, Student });
    } catch (e) {
        yield put({ type: UPDATE_STUDENTS_FAILED, message: e.message });
    }
}

function* deleteStudent(action) {
    try {
        const Student = yield call(api.call, `${API_BASE_URL}/${action.payload}`, { 
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        });

        yield put({ type: DELETE_STUDENT_SUCCEEDED, Student });
    } catch (e) {
        yield put({ type: DELETE_STUDENT_FAILED, message: e.message });
    }
}

// ------------------------------------
// Watchers
// ------------------------------------
export function* StudentSaga() {
    yield takeLatest(STUDENTS_REQUESTED, getStudents);
    yield takeEvery(STUDENT_REQUESTED, getStudent);
    yield takeEvery(ADD_STUDENT_REQUESTED, createStudent);
    yield takeEvery(UPDATE_STUDENT_REQUESTED, updateStudent);
    yield takeEvery(DELETE_STUDENT_REQUESTED, deleteStudent);
}

// ------------------------------------
// Action Handlers
// ------------------------------------
export const ACTION_HANDLERS = {
    [STUDENTS_SUCCEEDED]: (state, action) => {
        return _.mergeWith({}, state, { entities: action.Students.response });
    },

    [ADD_STUDENTS_SUCCEEDED]: (state, action) => {
        let newState = _.mergeWith({}, state);
        newState.entities.push(action.Student.response);
        return newState;
    },

    [STUDENT_SUCCEEDED]: (state, action) => {

        return _.mergeWith({}, state, { entities: action.Student.response });
    },

    [UPDATE_STUDENTS_SUCCEEDED]: (state, action) => {
        const id = action.Student.response.id;
        let newState = _.mergeWith({}, state);
        let idx = newState.entities.findIndex(el=> el.id === id);
        newState.entities[idx] = action.Student.response;
        return newState;
    },

    [DELETE_STUDENT_SUCCEEDED]: (state, action) => {
        const id = action.Student.response.id;
        let newState = _.mergeWith({}, state);
        let idx = newState.entities.findIndex(el=> el.id === id);
        newState.entities.splice(idx, 1);

        return newState;
    }
};

// ------------------------------------
// Reducer
// ------------------------------------
export const initialState = {
    isFetchingStudents: false,
    entities :[]
};

export default (state = initialState, action) => {
    const handler = ACTION_HANDLERS[action.type];

    return handler ? handler(state, action) : state;
};
