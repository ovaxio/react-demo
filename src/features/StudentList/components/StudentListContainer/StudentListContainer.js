import { connect } from 'react-redux';
import { getStudentsAction, deleteStudentAction, updateStudentAction } from '../../model';
import StudentList from '../StudentList';

const mapStateToProps = (state) => {
    return ({
        students: state.model.entities
    });
}

const mapActionCreators = {
    getStudents: () => getStudentsAction(),
    deleteStudent: studentId => deleteStudentAction(studentId),
    updateStudent: student => updateStudentAction(student)
};

export default connect(mapStateToProps, mapActionCreators)(StudentList);
