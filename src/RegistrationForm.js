import React, { PropTypes, Component } from 'react';
import axios from 'axios';
class RegistrationForm extends Component {

    constructor(props) {
        super(props);
        this.nickname = React.createRef();
        this.email = React.createRef();
        this.emailVerification = React.createRef();
        this.password = React.createRef();
        this.passwordVerification = React.createRef();
        this.state = {
            errors: [],
            status: 'new',
            loading: false
        };

        this.submitForm = this.submitForm.bind(this);
        this.renderForm = this.renderForm.bind(this);
    }

    // getInitialState() {
    //     return {
    //         errors: [],
    //         status: 'new',
    //         loading: false
    //     }
    // }

    submitForm(e) {
        e.preventDefault();
        const { email, nickname, emailVerification, password, passwordVerification } = this;
        const errors = [];
        if (email.current.value !== emailVerification.current.value) {
            errors.push({
                field: 'email',
                message: 'Email does not match with verification'
            });
        }

        if (password.current.value !== passwordVerification.current.value) {
            errors.push({
                field: 'password',
                message: 'Password does not match with verification'
            });
        }


        if(errors.length) {
            return this.setState({
                errors
            })
        }

        const data = JSON.stringify({
            email: email.current.value,
            nickname: nickname.current.value,
            emailVerification: emailVerification.current.value,
            password: password.current.value,
            passwordVerification: passwordVerification.current.value
        });


        axios.post('https://0754bj5vsf.execute-api.ap-southeast-2.amazonaws.com/v1/registration', data, {
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            this.setState({
                status: 'success'
            });

        }, (error) => {
            errors.push({
                field: 'server',
                message: 'Registration failed. '
            })
        }).then(() => {
            this.setState({
                errors
            })
        });

    }

    getErrors(field) {
        return this.state.errors.filter(error => {
            return error.field === field;
        });
    }

    renderForm() {
        const { email, nickname, emailVerification, password, passwordVerification } = this;

        const emailErrors = this.getErrors('email');
        const passwordErrors = this.getErrors('password');

        const serverError = this.getErrors('server');

        return (
            <form onSubmit={this.submitForm} className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <input placeholder="Nickname" type="text" className="form-control mt-2" ref={nickname} required/>
                    </div>
                    <div className="col-lg-12">
                        <input placeholder="email" type="email" className={`form-control mt-2 ${emailErrors.length ? 'error' : ''} `} ref={email}/>
                        {emailErrors.map((error, index) => (
                            <div className="alert alert-danger" key={index}>
                                {error.message}
                            </div>
                        ))}

                    </div>
                    <div className="col-lg-12">
                        <input placeholder="Confirm Email" type="email" className={`form-control mt-2 ${emailErrors.length ? 'error' : ''} `} ref={emailVerification} required/>
                        {emailErrors.map((error, index) => (
                            <div className="alert alert-danger" key={index}>
                                {error.message}
                            </div>
                        ))}
                    </div>
                    <div className="col-lg-12">
                        <input placeholder="Password" type="password" className={`form-control mt-2 ${passwordErrors.length ? 'error' : ''} `} ref={password} required/>
                        {passwordErrors.map((error, index) => (
                            <div className="alert alert-danger" key={index}>
                                {error.message}
                            </div>
                        ))}
                    </div>
                    <div className="col-lg-12">
                        <input placeholder="Confirm Password" type="password" className={`form-control mt-2 ${passwordErrors.length ? 'error' : ''} `} ref={passwordVerification} required/>
                        {passwordErrors.map((error, index) => (
                            <div className="alert alert-danger" key={index}>
                                {error.message}
                            </div>
                        ))}
                    </div>

                    <div className="col-lg-12 mt-2 text-center">
                        <button type="submit" className="btn btn-default">Submit</button>
                        { serverError.length ? <div className="alert mt-2 alert-danger">{serverError.pop().message}</div> : null}
                    </div>
                </div>
            </form>
        );
    }

    render() {
        switch(this.state.status) {
            case 'loading': return (<i className="fa fa-loading fa-2x"></i>);
            case 'success': return (<div className="">Welcome dinglet</div>);
            default:
                return this.renderForm();
        }
    }
}


export default RegistrationForm;  // adds dispatch prop
