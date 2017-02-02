import _ from 'lodash';

export function unionArrayCustomizer(objValue, srcValue) {
    if (_.isArray(objValue)) {
        return _.unionWith([], objValue, srcValue);
    }
}
