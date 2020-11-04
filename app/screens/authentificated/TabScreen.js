import * as React from 'react';
import {connect} from "react-redux";
import AppNavigator from "../../navigation/AppNavigator";

class TabScreen extends React.Component {
    render() {
        return (
            <AppNavigator />
        );
    }
}
const mapStateToProps = (state) => {
    return {
        user : state.userManagement,
        database : state.localDatabase
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        setParams:(db,params)=>dispatch(setLocalParams(db,params))
    };
};
export default connect(mapStateToProps,mapDispatchToProps)(TabScreen)