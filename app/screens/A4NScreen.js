import React from 'react';
import {connect, Provider} from "react-redux";
import Store from "../store/a4nStore";
import LoginScreen from "./LoginScreen";
import ErrorScreen from "./ErrorScreen";
import LoadingScreen from "./LoadingScreen";
import {initApplication} from "../store/actions/actions";
import TabScreen from "./authentificated/TabScreen";
import {init} from "../store/actions/init";
import {translate} from "../store/reducers/translation";

class A4N extends React.Component {

    translation;

    constructor(props) {
        super(props);
        this.translation = {
            dbInitialisation: translate('general-screen', 'db-init', this.props.translation),
            wait: translate('general-screen', 'wait', this.props.translation)
        }

        init(this.props).subscribe((data) => {
            this.props.initApplication(data.state);
            this.setState({init: true});
        });
    }

    render() {
        if (this.props.database.loading.loading) {
            return (
                <Provider store={Store}>
                    <LoadingScreen title='' message=''/>
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
