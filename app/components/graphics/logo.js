import React from 'react';
import {Dimensions,Image, Text,StyleSheet, View} from "react-native";

function Logo() {
    const dimensions = Dimensions.get('window');
    const imageWidth = Math.round(dimensions.width * 0.8);
    return <View style={styles.logo}>
                <Image style={{width: imageWidth,height:imageWidth}} source={require('../../../assets/aremis_4nomads.png')} />
            </View>;
}
const styles = StyleSheet.create({
    logo: {
        flex: 1,
        justifyContent: 'center',
        flexDirection:'row'
    },
});
export default Logo;