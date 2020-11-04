import React from 'react';
import {Text,StyleSheet, TouchableWithoutFeedback,View} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
class SimpleTextButton extends React.Component {
    press() {
        this.props.press();
    }

    render() {
        if(this.props.show){
            return (
                <TouchableWithoutFeedback onPress={() => this.press()}>
                    <View style={{alignItems:'center',justifyContent: 'center'}}>
                        <View style={[this.props.style,styles.baseInput]} >
                            <Text style={[styles.input]}>{this.props.title.toUpperCase()} </Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback >
            )
        }else{
            return false;
        }
    };
}
const styles = StyleSheet.create({
    baseInput: {
        borderRadius:3,
        backgroundColor:'#6c88b0',
        flexDirection:'row',
        height:40,
        padding:0,
        marginTop:35,
        alignItems:'center',
        justifyContent:'center'

    },
    input:{
        flex:1,
        color:'#fff',
        fontSize:16,
        justifyContent:'center',
        alignItems:'center',
        textAlign:'center'
    }
});
export default SimpleTextButton;