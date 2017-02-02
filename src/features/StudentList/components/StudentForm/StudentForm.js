import React from 'react'
import { Field, reduxForm } from 'redux-form';

import './StudentForm.scss'

export class StudentForm extends React.Component {
    
    handleSubmit = values => {
        const { callback, edit, initialValues } = this.props;

        if (edit) {
            this.props.updateStudent({
                id: initialValues.id,
                ...values
            });
        } else {
            this.props.createStudent(values);
        }

        callback();
    };

    render = () => {
        const { handleSubmit, studentTypes, callback, type } = this.props;

        return (
            <form onSubmit={handleSubmit(this.handleSubmit)}>
                <div className="row">
                    <div className='form-group col-xs-6'>
                        <label htmlFor='studentNameLast'>Nom de famille</label>
                        <Field id="studentNameLast" className='form-control' name='name.last' placeholder='Nom de famille' component='input' type='text' />
                    </div>
                    <div className='form-group col-xs-6'>
                        <label htmlFor='studentNameFirst'>Pr&eacute;nom</label>
                        <Field id="studentNameFirst" className='form-control' name='name.first' placeholder='Pr&eacute;nom' component='input' type='text' />
                    </div>
                </div>
                <div className="row">
                    <div className='form-group col-xs-8'>
                        <label htmlFor='studentEmail'>Email</label>
                        <Field id="studentEmail" className='form-control' name='email' placeholder='nom@domain.com' component='input' type='email' />
                    </div>
                    <div className='form-group col-xs-4'>
                        <label htmlFor='studentAge'>Age</label>
                        <Field id="studentAge" className='form-control' name='age' component='input' type='number' />
                    </div>
                </div>
                <div className='box-footer'>
                    <button className="lls_btn"
                            onClick={callback}>
                        Annuler
                    </button>
                    <button type="submit" className="lls_btn lls_btn--primary"
                            onClick={callback}>
                            Enregistrer
                    </button>
                </div>
            </form>
        );
    }
}
StudentForm = reduxForm({
    form: 'student'
})(StudentForm);

export default StudentForm;
