import React from 'react'
import { IndexLink, Link } from 'react-router'
import { Dialog } from 'material-ui'
import $ from 'jquery'
import StudentFormContainer from '../StudentFormContainer'
import AlertDialog from '../../../../components/AlertDialog'
import './StudentList.scss'

export class StudentList extends React.Component {
    state = {
        form: {
            open: false,
            title: '',
            edit: false,
            initialValues: {}
        },
        isDeleteDialogOpen: false,
        isResendDialogOpen: false,
        sort : {},
        selected:[]
    };

    componentWillMount() {
        this.props.getStudents();
    }

    getStatus = (status) => {
        switch (status) {
            case 'WAITING' :
            case 'CONFIRMATION_SENT' :
                return 'En attente de confirmation';
            default :
                return <span className="lls_studentLine-statusOK"><i className='fa fa-user-circle-o lls_icon--mr' />élève</span>;
        }
    };

    getAction = (student) => {
        switch (student.status) {
            case 'WAITING' :
                return (
                    <a href='#'
                       onClick={this.handleResendEmail.bind(this, student.id)}>
                       <i className='fa fa-send-o lls_icon--mr' />Renvoyer l'email de confirmation
                    </a>
                );
            case 'CONFIRMATION_SENT' :
                return <span><i className='fa fa-check-circle-o lls_icon--mr' />Invitation renvoyée</span>;

            default :
                return (
                    <a href='#'
                       onClick={this.handleOpenFormDialog.bind(this, {
                        edit: true,
                        title: 'Modifier les informations de l\'élève',
                        initialValues: { ...student }
                    })}>
                       <i className='fa fa-address-card-o lls_icon--mr' />Consulter la fiche élève
                    </a>
                );
        }
    };

    setSort = newKey => {
        let { key, reverse } = this.state.sort;
        reverse = key === newKey ? !reverse : false;
        this.setState({ sort: { key: newKey, reverse } });
    };

    sort = (students, sort) => {

        if (Object.keys(sort).length > 0) {
            const { key, reverse } = sort;

            try {
                students = reverse
                    ? students.sort((a, b) => (key.split('.').reduce((o, i) => o[i], a) < key.split('.').reduce((o, i) => o[i], b)) ? 1 : -1 )
                    : students.sort((a, b) => (key.split('.').reduce((o, i) => o[i], a) > key.split('.').reduce((o, i) => o[i], b)) ? 1 : -1 );
            } catch (e) {}
        }

        return students;
    };

    handleOpenFormDialog = (config, e) => {
        e.preventDefault();
        this.setState({ form: { open : true, ...config } });
    };

    handleCloseFormDialog = config => {
        this.setState({ form: { open : false, ...config } });
    };

    handleCloseDeleteDialog = () => {
        this.setState({ isDeleteDialogOpen: false });
    };

    handleOpenDeleteDialog = () => {
        this.setState({ isDeleteDialogOpen: true });
    };

    handleSubmitDeleteDialog = () => {
        this.state.selected.map(studentId => {
            this.props.deleteStudent(studentId);
        });
        this.setSelectedAll(false);
        this.handleCloseDeleteDialog();
    };

    handleCloseResendDialog = () => {
        this.setState({ isResendDialogOpen: false });
    };

    handleOpenResendDialog = () => {
        this.setState({ isResendDialogOpen: true });
    };

    handleSubmitResendDialog = () => {
        this.state.selected.map(studentId => {
            this.handleResendEmail(studentId);
        });
        this.setSelectedAll(false);
        this.handleCloseResendDialog();
    };

    handleResendEmail = (studentId, e) => {
        if (e) e.preventDefault();
        
        let student = this.props.students.find(el=>el.id === studentId);
        let newStudent = Object.assign({}, student);
        newStudent.status = 'CONFIRMATION_SENT';
        this.props.updateStudent(newStudent);
    }

    toggleStudentCheckbox = studentId => {
        let checkbox = $('#lls_checkbox--'+ studentId.toString());
        let newvalue = !checkbox.prop('checked');
        let allCheckboxes = $('[name="lls_studentCheck[]"]');
        checkbox.click();

        (!newvalue) ? 
            $('#lls_studentCheckAll').prop('checked', false) : 
            allCheckboxes.filter((idx)=> allCheckboxes[idx].checked === false).length === 0 ? 
                $('#lls_studentCheckAll').prop('checked', true) : 
                '';
    };

    toggleAllCheckBox = (e) => {
        let target = $(e.currentTarget);
        this.setSelectedAll(target.prop('checked'));
    };

    setSelectedAll = isAllSelected => {
        if (isAllSelected) {
            let checkboxes = $('[name="lls_studentCheck[]"]'); 
            let allStudentIds = [];
            checkboxes.each((idx, el)=> allStudentIds.push($(el).data('id')));

            this.setState({selected : allStudentIds});
        } else {
            this.setState({selected : []});
        }
    };
    
    setSelected = studentId => {
        let newState = this.state.selected;
        let idx = this.state.selected.indexOf(studentId);

        idx !== -1 ? newState.splice(idx, 1) : newState.push(studentId);
        this.setState({ selected: newState });
    };

    isSelected = studentId => {
        return this.state.selected.indexOf(studentId) === -1 ? 
            false
        :
            true;
    }

    hasSelectedStudent = () => this.state.selected.length > 0;

    render = () => {
        const { form: {edit, initialValues}, sort: { key, reverse } } = this.state;
        let students = this.sort(this.props.students, this.state.sort);

        return (
            <div>
                <AlertDialog open={this.state.isDeleteDialogOpen}
                             submitLabel='Supprimer'
                             cancelCallback={this.handleCloseDeleteDialog}
                             submitCallback={this.handleSubmitDeleteDialog}>
                    Supprimer les élèves sélectionnés ?
                </AlertDialog>
                <AlertDialog open={this.state.isResendDialogOpen}
                             submitLabel='Envoyer'
                             cancelCallback={this.handleCloseResendDialog}
                             submitCallback={this.handleSubmitResendDialog}>
                    Envoyer &agrave; nouveau l'email de confirmation aux élèves sélectionnés ?
                </AlertDialog>
                <Dialog open={this.state.form.open}
                        modal={false}
                        onRequestClose={this.handleCloseFormDialog}
                        autoScrollBodyContent>
                    <h3>{this.state.form.title}</h3>
                    <StudentFormContainer
                        callback={this.handleCloseFormDialog}
                        edit={edit}
                        initialValues={initialValues}
                    />
                </Dialog>
                <div className="lls_component-header">
                    <div className="lls_componentHeader-bulkActions">
                        <button
                            type='button'
                            className='lls_btn'
                            disabled={this.hasSelectedStudent() ? false : 'disabled'}
                            onClick={this.handleOpenDeleteDialog.bind(this)}>
                            <i className="fa fa-trash-o" aria-hidden="true"></i>Supprimer
                        </button>
                        <button
                            type='button'
                            className='lls_btn'
                            disabled={this.hasSelectedStudent() ? false : 'disabled'}
                            onClick={this.handleOpenResendDialog.bind(this)}>
                            <i className='fa fa-send-o' />Renvoyer l'invitation
                        </button>
                    </div>
                    <div className="lls_componentHeader-globalActions">
                        <button
                            type='button'
                            className='lls_btn'
                            onClick={this.handleOpenFormDialog.bind(this, { 
                                edit: false,
                                title: 'Ajouter un nouvel élève'
                            })}>
                            <i className='fa fa-plus' />Ajouter des élèves 
                        </button>
                        <button
                            type='button'
                            className='lls_btn lls_btn--primary'
                            disabled
                            onClick={this.handleOpenFormDialog.bind(this, { edit: false })}>
                            <i className='fa fa-plus' />Inviter des collègues
                        </button>
                    </div>
                </div>
                <div className="lls_component-box">
                    <div className="lls_studentsList-header">
                        <input type="checkbox" 
                               name="lls_studentCheckAll" 
                               className="lls_checkboxInput" 
                               id="lls_studentCheckAll"
                               onClick={this.toggleAllCheckBox.bind(this)} />
                        <label className="lls_checkbox lls_checkbox--reverse lls_studentLine-col" htmlFor="lls_studentCheckAll"></label>
                        <div className="lls_studentLine-col">
                            <div className={`lls_studentLine-info lls_sorting${key !== 'name.last' ? '' : reverse ? '_desc' : '_asc'}`}
                                 onClick={this.setSort.bind(this, 'name.last')}>
                                Nom
                            </div>
                            <div className="lls_studentLine-actions">
                                Action
                            </div>
                        </div>
                    </div>
                    <ul className="lls_studentsList">
                        {
                            students.map(student => 
                                <li key={student.id.toString()} className="lls_studentsList-line">
                                    <input type="checkbox" 
                                           id={'lls_checkbox--' + student.id.toString()} 
                                           name="lls_studentCheck[]" 
                                           className="lls_checkboxInput"
                                           onChange={this.setSelected.bind(this, student.id)}
                                           checked={this.isSelected(student.id)}
                                           data-id={student.id.toString()} />

                                    <label className="lls_checkbox lls_studentLine-col" 
                                           onClick={this.toggleStudentCheckbox.bind(this, student.id)}></label>
                                    <div className="lls_studentLine-col">
                                        <div className="lls_studentLine-avatar">
                                        { student.picture ? 
                                            (<img src={student.picture} 
                                                 alt={`${student.name.first} ${student.name.last} - Avatar`}
                                                 onClick={this.toggleStudentCheckbox.bind(this, student.id)} />
                                            ) : ('')
                                        }
                                        </div>
                                        <div className="lls_studentLine-info" 
                                             onClick={this.toggleStudentCheckbox.bind(this, student.id)}>
                                            {(student.name.first && student.name.last) ? (
                                                <div className="lls_studentLine-name">
                                                    <span className="lls_studentLine-lastName">{student.name.last}</span>&nbsp;<span>{student.name.first}</span>
                                                </div>
                                            ):(
                                                <div className="lls_studentLine-email">{student.email}</div>
                                            )}
                                            <div className="lls_studentLine-status">
                                                {this.getStatus(student.status)}
                                            </div>
                                        </div>
                                        <div className="lls_studentLine-actions">
                                            {this.getAction(student)}
                                        </div>
                                    </div>
                                </li>
                            )
                        }
                    </ul>
                </div>
            </div>
        );
    }
}

export default StudentList
