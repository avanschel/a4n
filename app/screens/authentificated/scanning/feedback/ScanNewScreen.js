import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import {connect} from "react-redux";
import {SCAN_NOT_FOUND} from "../../../../../constante";
class ScanNewScreen extends React.Component {
    constructor(props){
        super(props);
    }

    onPress(){
        // this.props.press(false);
    }
    render() {
        if(this.props.scanStatus.status === SCAN_NOT_FOUND){
            return (
                <View  style={styles.container} onPress={()=>this.onPress()}>
                    <View style={styles.bordered}>
                    <Text>Bât : {this.props.scanStatus.container.bl_id} Et : {this.props.scanStatus.container.fl_id} Loc : {this.props.scanStatus.container.rm_id} NOUVEAU BIEN</Text>
                    </View>
                </View>
            )
        }else{
            return false;
        }
    };
}

const styles = StyleSheet.create({
    bordered:{
      borderWidth:1,
      borderColor:'#ddd',padding:5
    },
    container: {

        backgroundColor: '#fff',
        padding:10,
    },
});
const mapStateToProps = (state) => {
    return {
        scanStatus: state.scanStatus
    };
};
export default connect(mapStateToProps)(ScanNewScreen)