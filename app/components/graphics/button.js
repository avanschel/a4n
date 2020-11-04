import React from 'react';
import {Text,StyleSheet, TouchableWithoutFeedback,View} from "react-native";
import { FontAwesome } from '@expo/vector-icons';
class Button extends React.Component {
    press() {
        this.props.press();
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={() => this.press()}>
                <View style={[styles.baseInput]} >
                    <FontAwesome name={this.props.label} style={[styles.icon]}/>
                    <Text style={[styles.input]}>{this.props.title.toUpperCase()} </Text>
                </View>
            </TouchableWithoutFeedback >
        )
    };
}
const styles = StyleSheet.create({
    baseInput: {
        borderWidth:1,
        borderRadius:3,
        borderColor:'#6c88b0',
        flexDirection:'row',
        height:45,
        margin:5
    },
    icon:{
        backgroundColor:'#6c88b0',
        color:'#fff',
        textAlign:'right',
        fontSize:24,
        height:43,
        flex:4,
        padding:10

    },
    input:{
        flex:5,
        color:'#fff',
        backgroundColor:'#6c88b0',
        paddingTop:14,
        fontSize:16,
        paddingLeft: 0
    }
});
export default Button;