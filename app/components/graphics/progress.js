import React from 'react';
import {Text,View} from "react-native";
import {connect} from "react-redux";
class Progress extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        if(this.props.progress.loading){
            return (
                <View >
                    <Text>{this.props.progress.text +' '+this.props.progress.percent+'%'} </Text>
                </View>
            )
        }else{
            return false;
        }
    };
}

const mapStateToProps = (state) => {
    return {
        progress: state.progressManagement
    };
};
export default connect(mapStateToProps)(Progress)