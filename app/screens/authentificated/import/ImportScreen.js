import React from 'react';
import {StyleSheet, Text, View, TouchableWithoutFeedback, KeyboardAvoidingView, Alert, Dimensions} from 'react-native';
import {connect} from 'react-redux'
import {setLocalParams} from "../../../store/actions/actions";
import {AntDesign} from "@expo/vector-icons";
import * as Network from 'expo-network';

import {importData} from "../../../api/import";
import ProgressScreen from "./ProgressScreen";
import {exportData} from "../../../api/export";

const dimensions = Dimensions.get('window');
const widthButton = Math.round(dimensions.width * 0.45);
const importWarning = 'If you launch the import, the current data on the mobile will be erased.';
const exportWarning = 'If you launch the export, the current data on the mobile will be erased.';

class ImportScreen extends React.Component {

    constructor(props) {
        super(props);
    }

    onPressImport() {


        Network.getNetworkStateAsync().then(res => {
            if (res.isConnected) {
                Alert.alert("Import", importWarning + '  thank you for confirming',
                    [
                        {
                            text: 'OK', onPress: () => {
                                this.startImport()
                            }
                        },
                        {
                            text: 'Cancel', onPress: () => {
                            }
                        },
                    ])
            } else {
                Alert.alert("Connection error", "No internet connection",
                    [
                        {
                            text: 'OK', onPress: () => {
                            }
                        },
                        {
                            text: 'Cancel', onPress: () => {
                            }
                        },
                    ])
            }
        })
    }

    startImport() {
        this.props.importData(this.props.database.db, this.props.user.server, this.props.progress).then(res => {
        });
    }

    onPressExport() {

        Network.getNetworkStateAsync().then(res => {
            if (res.isConnected) {
                Alert.alert("Export", exportWarning + '  thank you for confirming',
                    [
                        {
                            text: 'OK', onPress: () => {
                                this.startExport()
                            }
                        },
                        {
                            text: 'Cancel', onPress: () => {
                            }
                        },
                    ])
            } else {
                Alert.alert("Connection error", "No internet connection",
                    [
                        {
                            text: 'OK', onPress: () => {
                            }
                        },
                        {
                            text: 'Cancel', onPress: () => {
                            }
                        },
                    ])
            }
        })
        /*
        let aProm =  new Promise(
            function(resolve,reject){
                NetInfo.fetch()  
        
                    if (netStatus === 'none' || netStatus === 'NONE') {
                        Alert.alert("Internet not connected.!!!")
                        return []
                    }else{ 
                        Alert.alert("Internet connected.!!! ")
                    }
                    

        });
        aProm.then((dataParam)=>{
            Alert.alert("Export",exportWarning+'  thank you for confirming',
            [
                {text: 'OK', onPress: () => { this.startExport()}},
                {text: 'Cancel', onPress: () => { }},
            ] );
        }
    )
/*
        Alert.alert("Export",exportWarning+'  thank you for confirming',
            [
                {text: 'OK', onPress: () => { this.startExport()}},
                {text: 'Cancel', onPress: () => { }},
            ] );*/
    }

    startExport() {
        this.props.exportData(this.props.database.db, this.props.user.server, this.props.progress).then(res => {
        });
    }

    render() {
        if (this.props.progress.loading) {
            return (
                <ProgressScreen progress={this.props.progress}/>
            )
        } else {
            return (
                <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
                    <View style={styles.wrapper}>
                        <View style={styles.container}>
                            <Text style={styles.title}>Import</Text>
                            <Text>{importWarning}</Text>
                            <View style={styles.br}/>
                            <Text style={styles.title}>Export</Text>
                            <Text>{exportWarning}</Text>
                        </View>
                        <View style={styles.buttonArea}>
                            <TouchableWithoutFeedback onPress={() => this.onPressImport()}>
                                <View style={[styles.baseInput]}>
                                    <AntDesign name={'arrowdown'} style={[styles.icon]}/>
                                    <Text style={[styles.input]}>{'IMPORT DATA'} </Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => this.onPressExport()}>
                                <View style={[styles.baseInput]}>
                                    <AntDesign name={'arrowup'} style={[styles.icon]}/>
                                    <Text style={[styles.input]}>{'EXPORT DATA'} </Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            )

        }
    };
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        flexDirection: 'column'
    },
    br: {
        margin: 10
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 50,
        padding: 10
    },
    buttonArea: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    baseInput: {
        borderWidth: 1,
        borderRadius: 3,
        borderColor: '#6c88b0',
        flexDirection: 'row',
        height: 45,
        margin: 5,
        width: widthButton
    },
    icon: {
        backgroundColor: '#6c88b0',
        color: '#fff',
        textAlign: 'right',
        fontSize: 16,
        height: 43,
        flex: 2,
        paddingTop: 14

    },
    input: {
        flex: 5,
        color: '#fff',
        backgroundColor: '#6c88b0',
        paddingTop: 13,
        paddingLeft: 10,
        alignItems: 'center',
        fontSize: 13
    }
});
const mapStateToProps = (state) => {
    return {
        progress: state.progressManagement,
        user: state.userManagement,
        database: state.localDatabase
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        importData: async (db, server, state) => {
            return await dispatch(importData(db, server, dispatch, state))
        },
        exportData: async (db, server, state) => {
            return await dispatch(exportData(db, server, dispatch, state))
        },
        setParams: (db, params) => dispatch(setLocalParams(db, params))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ImportScreen)
