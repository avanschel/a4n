import React from 'react';
import {Text,StyleSheet, View,} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
class ErrorView extends React.Component {
    constructor(props){
        super(props);
    }
    change(data){
        this.props.change(this.props.label,data);
    }
    render(){
        if(this.props.error){
        return(
            <View style={[styles.baseInput]}>
                <MaterialIcons name={'error'} style={[styles.icon]}/>
                <Text style={[styles.input]}>{this.props.message}</Text>
            </View>
        )
        }else{
            return(
                <View >
                </View>
            )
        }
    }
}
const styles = StyleSheet.create({
    baseInput: {
        flexDirection:'row',
        height:30,
        margin:5
    },
    icon:{
        color:'#c0392b',
        textAlign:'center',
        fontSize:19,
        height:30,
        width:30

    },
    input:{
        flex:3,paddingLeft:5,
        color:'#c0392b'
    }
});
export default ErrorView;