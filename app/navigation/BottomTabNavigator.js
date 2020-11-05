import React from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import ConfigScreen from "../screens/authentificated/config/ConfigScreen";
import DatabaseScreen from "../screens/authentificated/data/DataScreen";
import ImportScreen from "../screens/authentificated/import/ImportScreen";
import ScanningScreen from "../screens/authentificated/scanning/ScanningScreen";
import {MaterialCommunityIcons, Feather, MaterialIcons, Entypo, FontAwesome} from "@expo/vector-icons";
import {StyleSheet} from "react-native";


const BottomTabNavigator = createBottomTabNavigator({
    Import: ImportScreen,
    Scan: ScanningScreen,
    Data: DatabaseScreen,
    Config: ConfigScreen
}, {
    defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
            const { routeName } = navigation.state;
            let style = (focused)? styles.iconFocused : styles.icon;
            switch(routeName){
                case 'Import':
                    return (<MaterialIcons name={'import-export'} style={style}/>
                    );
                case 'Scan':
                    return (<MaterialCommunityIcons name={'barcode-scan'} style={style}/>
                    );
                case 'Data':
                    return (<Entypo name={'database'} style={style}/>
                    );
                default:
                    return (<FontAwesome name={'gear'} style={style}/>
                    );
            }
        },
    }),
    tabBarOptions: {
        activeTintColor: '#FF6F00',
        inactiveTintColor: '#263238',
    },
});
const styles = StyleSheet.create({
    icon:{
        fontSize:16,
        textAlign:'center',
        paddingTop:10,
        color:'#263238'
    },
    iconFocused:{
        fontSize:16,
        color:'#FF6F00',
        textAlign:'center',
        paddingTop:10
    }
});
export default BottomTabNavigator;