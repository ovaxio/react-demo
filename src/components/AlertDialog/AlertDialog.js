import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export class AlertDialog extends React.Component {
    render() {
        const { children, open, cancelLabel, submitLabel, cancelCallback, submitCallback } = this.props;
        const actions = [
            <button className="lls_btn"
                onClick={cancelCallback}
            >{cancelLabel || 'Annuler'}</button>,
            <button className="lls_btn lls_btn--primary"
                onClick={submitCallback}
            >{submitLabel || 'OK'}</button>
        ];

        return <Dialog
            actions={actions}
            modal={false}
            open={open}
            onRequestClose={cancelCallback}
        >
            { children }
        </Dialog>;
    }
}

AlertDialog.propTypes = {
    open: React.PropTypes.bool.isRequired,
    cancelLabel: React.PropTypes.string,
    submitLabel: React.PropTypes.string,
    cancelCallback: React.PropTypes.func.isRequired,
    submitCallback: React.PropTypes.func.isRequired
};

export default AlertDialog;
