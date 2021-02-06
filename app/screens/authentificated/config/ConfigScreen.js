import React from 'react';
import { StyleSheet, Text, View,ScrollView } from 'react-native';
import { connect } from 'react-redux'
import { setLocalParams} from "../../../store/actions/actions";
import Constants from 'expo-constants';
import {translate} from "../../../store/reducers/translation";
class ConfigScreen extends React.Component {

    translation;
    constructor(props) {
        super(props);
        this.state = {username: this.props.user.username, password: null, server: this.props.user.server};
        this.translation = {
            server:translate('config-screen', 'server',this.props.translation),
            user:translate('config-screen', 'user',this.props.translation),
            deviceId:translate('config-screen', 'device-id',this.props.translation),
            deviceName:translate('config-screen', 'device-name',this.props.translation),
            applicationVersion:translate('config-screen', 'application-version',this.props.translation)
        }
    }
    render(){
        return (
            <ScrollView style={{width:'100%'}}>
            <View style={styles.container}>
                <View style={styles.line}>
                    <Text style={styles.title}>{this.translation.server} </Text>
                    <Text style={styles.val}>{this.props.user.server}</Text>
                </View>
                <View style={styles.line}>
                    <Text style={styles.title}>{this.translation.user}  </Text>
                    <Text style={styles.val}>{this.props.user.username}</Text>
                </View>
                <View style={styles.line}>
                    <Text style={styles.title}>{this.translation.deviceId} </Text>
                    <Text style={styles.val}>{Constants.deviceId}</Text>
                </View>
                <View style={styles.line}>
                    <Text style={styles.title}>{this.translation.deviceName} </Text>
                    <Text style={styles.val}>{Constants.deviceName}</Text>
                </View>
                <View style={styles.lastLine}>
                    <Text style={styles.title}>{this.translation.applicationVersion} </Text>
                    <Text style={styles.val}>v1.4.2.01-02-21</Text>
                </View>
            </View></ScrollView>
        )
    };
}

const styles = StyleSheet.create({
    container: {
        marginTop:Constants.statusBarHeight,
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title:{
        color:'#464646',
        fontSize:18,
    },
    val:{
        color:'#999999',
        fontSize:16,
    },
    line:{
        padding:8,
        borderBottomWidth:1,
        borderColor:'#eee',
        width:'100%',
    },
    lastLine:{
        padding:8,
        width:'100%',
    }
});
const mapStateToProps = (state) => {
    return {
        user : state.userManagement,
        database : state.localDatabase,
        translation: state.translationManagement
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        setParams:(db,params)=>dispatch(setLocalParams(db,params))
    };
};
export default connect(mapStateToProps,mapDispatchToProps)(ConfigScreen)
