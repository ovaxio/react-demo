import { StudentSaga } from '../features/StudentList/model';

export default function* rootSaga() {
    yield [
        StudentSaga()
    ];
}
