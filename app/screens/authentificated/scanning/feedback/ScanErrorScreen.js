import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import {connect} from "react-redux";
class ScanErrorScreen extends React.Component {
    constructor(props){
        super(props);
    }

    onPress(){
       // this.props.press(false);
    }
    render() {
        if(this.props.scanStatus.error){
            return (
                <View  style={styles.container} onPress={()=>this.onPress()}>
                    <Text>J ai une erreur </Text>
                </View>
            )
        }else{
            return false;
        }
    };
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        padding:20,
        justifyContent: 'center',
    },
});
const mapStateToProps = (state) => {
    return {
        scanStatus: state.scanStatus
    };
};
export default connect(mapStateToProps)(ScanErrorScreen)