import React from 'react';
import {Text,StyleSheet, TouchableWithoutFeedback,View} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
class FullButon extends React.Component {
    press() {
        this.props.press();
    }

    render() {
        if(this.props.show){
            return (
                <TouchableWithoutFeedback onPress={() => this.press()}>
                    <View style={{alignItems:'center',justifyContent: 'center'}}>
                        <View style={[this.props.style,styles.baseInput]} >
                            <MaterialIcons name={this.props.label} style={[styles.icon]}/>
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
        borderWidth:1,
        borderRadius:3,
        borderColor:'#6c88b0',
        flexDirection:'row',
        height:45,
        margin:'auto',marginTop:30,
        justifyContent:'center'

    },
    icon:{
        backgroundColor:'#6c88b0',
        color:'#fff',
        textAlign:'right',
        fontSize:24,
        height:43,
        flex:4,
        padding:10,
        width:30

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
export default FullButon;