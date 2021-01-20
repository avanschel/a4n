import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux'
import {Feather} from '@expo/vector-icons';

class ErrorScreen extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Feather name={'battery-charging'} style={[styles.icon]}/>
                <Text style={[styles.title]}>{this.props.title}</Text>
                <Text style={[styles.txt]}>{this.props.message}</Text>
            </View>
        )
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#c0392b',
        flexDirection: 'column',
        paddingTop: 150,
        color: '#fff'
    },
    txt: {
        color: '#fff',
        textAlign: 'center'
    },
    title: {
        color: '#fff',
        fontSize: 30,
        textAlign: 'center'
    },
    icon: {
        fontSize: 65,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 15
    }
});
const mapStateToProps = (state) => {
    return state;
};

export default connect(mapStateToProps)(ErrorScreen)