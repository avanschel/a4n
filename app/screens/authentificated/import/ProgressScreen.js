import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux'
import {MaterialIcons} from "@expo/vector-icons";
import FullButon from "../../../components/graphics/fullButon";
import {endProgress} from "../../../store/actions/actions";

class ProgressScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    closeScreen() {
        let data = {loading: false, error: false, errorMessage: null, cat: null, text: null, percent: 0};
        this.props.closeModal(data);
    }

    render() {
        return (
            <View style={styles.container}>
                <MaterialIcons name={'import-export'} style={[styles.icon]}/>
                <Text style={[styles.title]}>{this.props.progress.cat}</Text>
                <Text style={[styles.txt]}>{this.props.progress.text}</Text>
                <Text style={[styles.percent]}>{this.props.progress.percent + ' %'}</Text>
                <View style={[styles.progress]}>
                    <View
                        style={[styles.progressFill, {width: (isNaN(this.props.progress.percent) ? '10 %' : this.props.progress.percent + '%')}]}/>
                </View>
                <FullButon show={this.props.progress.button} label='check' title="Ok!" press={() => this.closeScreen()}
                           style={styles.btnClose}/>
            </View>
        )
    };
}

const styles = StyleSheet.create({
    icon: {
        fontSize: 80,
        color: '#6c88b0',
        textAlign: 'center',
        paddingTop: 60,
        paddingBottom: 30
    },
    btnClose: {
        width: '30%'
    },
    percent: {
        fontSize: 10,
        paddingTop: 30,
        paddingRight: '20%',
        textAlign: 'right',
        color: '#777'
    },
    progress: {
        height: 4,
        width: '60%',
        marginLeft: '20%',
        backgroundColor: '#eee'
    },
    progressFill: {
        height: 4,
        backgroundColor: '#6c88b0'
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'column',
        paddingTop: '30%',
        color: '#fff'
    },
    txt: {
        color: '#999999',
        textAlign: 'center'
    },
    title: {
        color: '#999999',
        fontSize: 30,
        textAlign: 'center',
        paddingBottom: 10
    }
});
const mapStateToProps = (state) => {
    return state;
};

const mapDispatchToProps = (dispatch) => {
    return {
        closeModal: (params) => dispatch(endProgress(params))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ProgressScreen)