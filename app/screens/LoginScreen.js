import React from 'react';
import {Keyboard, KeyboardAvoidingView, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {connect} from 'react-redux'
import Logo from "../components/graphics/logo";
import InputText from "../components/graphics/inputText";
import Button from "../components/graphics/button";
import {apiLogin, getOfflineData, offlineLogin} from "../api/login";
import {setLocalParam, setLocalParams} from "../store/actions/actions";
import ErrorView from "../components/graphics/errorView";

class LoginScreen extends React.Component {
    connected = true;

    constructor(props) {
        super(props);
        this.state = {username: this.props.user.username, password: null, server: this.props.user.server};
    }

    login() {
        this.props.setParams(this.props.database.db, [{
            name: 'server',
            value: this.props.user.server
        }, {name: 'username', value: this.props.user.username}]);
        getOfflineData(this.props.database.db, this.props.user.username.toUpperCase(), this.props.user.password.toUpperCase()).then(res => {

            if (res.length > 0) {
                this.props.loginOffline(this.props.user.server, this.props.user.username, this.props.user.password);
            } else {
                this.props.login(this.props.database.db, this.props.user.server, this.props.user.username, this.props.user.password);
            }

        });
    }

    change(label, value) {

        this.props.setParam([{name: label, value: (label === 'server') ? value.toLowerCase() : value}]);
    }

    render() {
        let change = this.change;
        return (
            <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.container}>
                    <View style={styles.container}>
                        <View style={styles.logoContainer}>
                            <Logo/>
                        </View>
                        <View style={styles.formContainer}>
                            <InputText label='server' placeholder="Enter the server url" value={this.props.user.server}
                                       type='text' change={change.bind(this)}/>
                            <InputText label='user' placeholder="Enter the login" value={this.props.user.username}
                                       type='text' change={change.bind(this)}/>
                            <InputText label='lock' placeholder="Enter the password" value={this.props.user.password}
                                       type='password' change={change.bind(this)}/>
                            <Button label='unlock-alt' title="Login" press={() => this.login()} style={styles.button}/>
                            <ErrorView error={this.props.user.error.error} message={this.props.user.error.message}/>
                            <ErrorView error={this.props.user.loading.loading}
                                       message={this.props.user.loading.message}/>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        )
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
        flexDirection: 'column'
    },
    logoContainer: {
        flex: 1,
    },
    formContainer: {
        flex: 1,
        backgroundColor: '#fff'
    },
    button: {
        margin: 15,
    }
});
const mapStateToProps = (state) => {
    return {
        user: state.userManagement,
        database: state.localDatabase
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        loginOffline: (server, username, password) => dispatch(offlineLogin(dispatch, server, username, password)),
        login: (db, server, username, password) => dispatch(apiLogin(db, dispatch, server, username, password)),
        setParam: (value) => dispatch(setLocalParam(value)),
        setParams: (db, params) => dispatch(setLocalParams(db, params))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
