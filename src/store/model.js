import _ from 'lodash';
import { ACTION_HANDLERS as studentHandlers, initialState as studentInitialState } from '../features/StudentList/model';

export const CLEAR_MODEL = 'CLEAR_MODEL';

export const clearModel = () => ({ type: CLEAR_MODEL });

const modelHandlers = {
    [CLEAR_MODEL]: (state, action) => _.merge({}, initialState)
};

const ACTION_HANDLERS = _.merge({}, modelHandlers, studentHandlers);

const initialState = _.merge({}, studentInitialState);

export default (state = initialState, action) => {
    const handler = ACTION_HANDLERS[action.type];

    return handler ? handler(state, action) : state;
};
