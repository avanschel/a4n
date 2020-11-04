import React from 'react';
import {Text,StyleSheet, View,TextInput} from "react-native";
import { FontAwesome } from '@expo/vector-icons';
class InputText extends React.Component {
    constructor(props){
        super(props);
    }
    change(data){
        this.props.change(this.props.label,data);
    }
    render(){
        return(
            <View style={[styles.baseInput]}>
                <FontAwesome name={this.props.label} style={[styles.icon]}/>
                <TextInput placeholder={this.props.placeholder} style={[styles.input]}
                           onChangeText={(text) => {this.change(text)}} value={this.props.value} secureTextEntry={(this.props.type === 'password')}/>
            </View>
        )
    }
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
        textAlign:'center',
        fontSize:19,
        height:43,
        width:45,
        padding:10

    },
    input:{
        flex:3,paddingLeft:5,
        color:'#6c88b0'
    }
});
export default InputText;