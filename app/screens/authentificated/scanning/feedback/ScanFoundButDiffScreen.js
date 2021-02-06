import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import {connect} from "react-redux";
import {SCAN_FOUND_WITH_DIFF, SCAN_NOT_FOUND} from "../../../../../constante";
import {translate} from "../../../../store/reducers/translation";
class ScanFoundButDiffScreen extends React.Component {
    translation;

    constructor(props) {
        super(props);
        this.translation = {
            building: translate('scan-screen', 'building', this.props.translation),
            floor: translate('scan-screen', 'floor', this.props.translation),
            local: translate('scan-screen', 'local', this.props.translation),
            different: translate('scan-screen', 'different', this.props.translation)
        }
    }

    onPress(){
        // this.props.press(false);
    }
    render() {
        if(this.props.scanStatus.status === SCAN_FOUND_WITH_DIFF){
            return (
                <View  style={styles.container} onPress={()=>this.onPress()}>
                    <View style={styles.bordered}>
                        <Text>{this.translation.building} : {this.props.scanStatus.original.bl_id} {this.translation.floor} : {this.props.scanStatus.original.fl_id} {this.translation.local} : {this.props.scanStatus.original.rm_id} {this.translation.different}.</Text>
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
        scanStatus: state.scanStatus,
        translation: state.translationManagement
    };
};
export default connect(mapStateToProps)(ScanFoundButDiffScreen)
