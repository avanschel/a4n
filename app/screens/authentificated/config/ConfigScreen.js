import React from 'react';
import { StyleSheet, Text, View,ScrollView } from 'react-native';
import { connect } from 'react-redux'
import { setLocalParams} from "../../../store/actions/actions";
import Constants from 'expo-constants';
class ConfigScreen extends React.Component {
    render(){
        return (
            <ScrollView style={{width:'100%'}}>
            <View style={styles.container}>
                <View style={styles.line}>
                    <Text style={styles.title}>Server </Text>
                    <Text style={styles.val}>{this.props.user.server}</Text>
                </View>
                <View style={styles.line}>
                    <Text style={styles.title}>User </Text>
                    <Text style={styles.val}>{this.props.user.username}</Text>
                </View>
                <View style={styles.line}>
                    <Text style={styles.title}>Device id </Text>
                    <Text style={styles.val}>{Constants.deviceId}</Text>
                </View>
                <View style={styles.line}>
                    <Text style={styles.title}>Device Name </Text>
                    <Text style={styles.val}>{Constants.deviceName}</Text>
                </View>
                <View style={styles.lastLine}>
                    <Text style={styles.title}>Application version </Text>
                    <Text style={styles.val}>v1.4.2</Text>
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
        database : state.localDatabase
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        setParams:(db,params)=>dispatch(setLocalParams(db,params))
    };
};
export default connect(mapStateToProps,mapDispatchToProps)(ConfigScreen)
