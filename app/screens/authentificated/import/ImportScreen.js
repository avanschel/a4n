import React from 'react';
import {Alert, Dimensions, KeyboardAvoidingView, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {connect} from 'react-redux'
import {setLocalParams} from "../../../store/actions/actions";
import {AntDesign} from "@expo/vector-icons";
import * as Network from 'expo-network';

import {importData} from "../../../api/import";
import ProgressScreen from "./ProgressScreen";
import {exportData} from "../../../api/export";
import {translate} from "../../../store/reducers/translation";

const dimensions = Dimensions.get('window');
const widthButton = Math.round(dimensions.width * 0.45);

class ImportScreen extends React.Component {
    translation;

    constructor(props) {
        super(props);
        this.translation = {
            import: translate('import-screen', 'import', this.props.translation),
            importWarning: translate('import-screen', 'import-warning', this.props.translation),
            exportWarning: translate('import-screen', 'export-warning', this.props.translation),
            export: translate('import-screen', 'export', this.props.translation),
            importData: translate('import-screen', 'import-data', this.props.translation),
            exportData: translate('import-screen', 'export-data', this.props.translation),
            confirming: translate('import-screen', 'confirming', this.props.translation),
            connectionErrorTitle: translate('import-screen', 'error-title', this.props.translation),
            connectionErrorContent: translate('import-screen', 'error-content', this.props.translation),
            ok: translate('import-screen', 'ok', this.props.translation),
            cancel: translate('import-screen', 'cancel', this.props.translation)
        }
    }

    onPressImport() {


        Network.getNetworkStateAsync().then(res => {
            if (res.isConnected) {
                Alert.alert(this.translation.import, this.translation.importWarning + this.translation.confirming,
                    [
                        {
                            text: this.translation.ok, onPress: () => {
                                this.startImport()
                            }
                        },
                        {
                            text: this.translation.cancel, onPress: () => {
                            }
                        },
                    ])
            } else {
                Alert.alert(this.translation.connectionErrorTitle, this.translation.connectionErrorContent,
                    [
                        {
                            text: this.translation.ok, onPress: () => {
                            }
                        },
                        {
                            text: this.translation.cancel, onPress: () => {
                            }
                        },
                    ])
            }
        })
    }

    startImport() {
        this.props.importData(this.props.database.db, this.props.user.server, this.props.progress, this.props.translation).then(res => {
        });
    }

    onPressExport() {

        Network.getNetworkStateAsync().then(res => {
            if (res.isConnected) {
                Alert.alert(this.translation.export, this.translation.exportWarning + this.translation.confirming,
                    [
                        {
                            text: this.translation.ok, onPress: () => {
                                this.startExport()
                            }
                        },
                        {
                            text: this.translation.cancel, onPress: () => {
                            }
                        },
                    ])
            } else {
                Alert.alert(this.translation.connectionErrorTitle, this.translation.connectionErrorContent,
                    [
                        {
                            text: this.translation.ok, onPress: () => {
                            }
                        },
                        {
                            text: this.translation.cancel, onPress: () => {
                            }
                        },
                    ])
            }
        })
    }

    startExport() {
        this.props.exportData(this.props.database.db, this.props.user.server, this.props.progress, this.props.translation).then(res => {
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
                            <Text>{this.translation.importWarning}</Text>
                            <View style={styles.br}/>
                            <Text style={styles.title}>Export</Text>
                            <Text>{this.translation.exportWarning}</Text>
                        </View>
                        <View style={styles.buttonArea}>
                            <TouchableWithoutFeedback onPress={() => this.onPressImport()}>
                                <View style={[styles.baseInput]}>
                                    <AntDesign name={'arrowdown'} style={[styles.icon]}/>
                                    <Text style={[styles.input]}>{this.translation.importData} </Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => this.onPressExport()}>
                                <View style={[styles.baseInput]}>
                                    <AntDesign name={'arrowup'} style={[styles.icon]}/>
                                    <Text style={[styles.input]}>{this.translation.exportData} </Text>
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
        database: state.localDatabase,
        translation: state.translationManagement
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        importData: async (db, server, state, translation) => {
            return await dispatch(importData(db, server, dispatch, state, translation))
        },
        exportData: async (db, server, state, translation) => {
            return await dispatch(exportData(db, server, dispatch, state, translation))
        },
        setParams: (db, params) => dispatch(setLocalParams(db, params))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ImportScreen)
