import React from 'react';
import {connect, Provider} from "react-redux";
import Store from "../store/a4nStore";
import LoginScreen from "./LoginScreen";
import ErrorScreen from "./ErrorScreen";
import LoadingScreen from "./LoadingScreen";
import {initApplication} from "../store/actions/actions";
import TabScreen from "./authentificated/TabScreen";
import {initApp} from "../store/actions/init";

class A4N extends React.Component {
    constructor(props) {
        super(props);
        initApp(this.props).then(res => {
            this.props.initApplication({user: res.user, database: res.database});
            this.setState({init: true});
        }).catch(err => {
        })
    }

    render() {
        if (this.props.database.loading.loading) {
            return (
                <Provider store={Store}>
                    <LoadingScreen title={'Database initialization'} message={'please wait'}/>
                </Provider>
            )
        } else {
            if (this.props.database.error.error) {

                return (
                    <Provider store={Store}>
                        <ErrorScreen title={this.props.database.error.title}
                                     message={this.props.database.error.message}/>
                    </Provider>
                )
            } else {
                // MODIFY THIS LINE AFTER DEV
                if (this.props.user.logged) {
                    //this.props.getLocalParam(this.props.data.db);
                    return (
                        <Provider store={Store}>
                            <TabScreen/>
                        </Provider>
                    )
                } else {
                    return (
                        <Provider store={Store}>
                            <LoginScreen/>
                        </Provider>
                    )
                }
            }

        }
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.userManagement,
        database: state.localDatabase,
        scanStatus: state.scanStatus,
        translation: state.translationManagement
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        initApplication: (state) => dispatch(initApplication(state))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(A4N)
