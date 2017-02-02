import { connect } from 'react-redux';
import { updateStudentAction, createStudentAction } from '../../model';
import StudentForm from '../StudentForm';

const mapStateToProps = (state) => {
    return ({
    });
}

const mapActionCreators = {
    updateStudent: student => updateStudentAction(student),
    createStudent: student => createStudentAction(student)
};

export default connect(mapStateToProps, mapActionCreators)(StudentForm);
