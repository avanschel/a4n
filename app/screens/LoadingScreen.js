import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux'
import {FontAwesome} from '@expo/vector-icons';
import { Animated, Easing } from 'react-native';
import FontAwesomeSpin from "../components/graphics/fontawesiome-spin";

class LoadingScreen extends React.Component {
    spinValue = new Animated.Value(0);

    componentDidMount(){
        this.spin();
    };

    spin = () => {

        this.spinValue.setValue(0);

        Animated.timing(
            this.spinValue,
            {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true
            }
        ).start(() => this.spin());

    };
    render() {
        return (
            <View style={styles.container}>

                <FontAwesomeSpin name={'pause-circle'} style={[styles.icon]}/>
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
