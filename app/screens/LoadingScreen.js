import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux'
import {FontAwesome} from '@expo/vector-icons';

class LoadingScreen extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <FontAwesome name={'pause-circle'} style={[styles.icon]}/>
                <Text style={[styles.title]}>{this.props.title}</Text>
                <Text style={[styles.txt]}>{this.props.message}</Text>
            </View>
        )
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#6c88b0',
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

export default connect(mapStateToProps)(LoadingScreen)