import React from 'react';
import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {connect} from 'react-redux'
import {checkBlFlRm, retrieveDataForCodeBar, saveSurveyAfterScanning} from "../../../api/scan";
import ContainerScreen from "./ContainerScreen";
import Constants from 'expo-constants';
import {Audio} from "expo-av";
import {SCAN_FOUND_AND_IDENTICAL, SCAN_FOUND_ERROR, SCAN_FOUND_WITH_DIFF, SCAN_NOT_FOUND} from "../../../../constante";
import ScanerModeScan from "./ScannerModeScanning";
import {asyncRetrieveAssetsById} from "../../../api/assets";
import ManualModeScanning from "./ManualModeScanning";
import {translate} from "../../../store/reducers/translation";

class ScanningScreen extends React.Component {
    soundOK = null;
    soundChanged = null;
    soundNew = null;
    soundError = null;
    soundLoaded = false;
    translation;

    constructor(props) {
        super(props);
        let found = (this.props.database && this.props.database.tables) ? this.props.database.tables.find(f => f.table_name === 'eq_surv') : null;
        this.loadSounds().then(res => {
            this.soundLoaded = res;
        });
        if (found) {
            this.state = {showRoom: true, showScan: false, showManual: false, focusOn: false, modeScan: 'eq'}
        } else {
            this.state = {showRoom: true, showScan: false, showManual: false, focusOn: false, modeScan: 'ta'}
        }

        this.translation = {
            saveStandardNotExist: translate('scan-screen', 'save-standard-not-exist', this.props.translation),
            errorSave: translate('scan-screen', 'save-error', this.props.translation),
            error: translate('scan-screen', 'error', this.props.translation),
            localNotFilled: translate('scan-screen', 'local-not-filled', this.props.translation),
            noSurvey: translate('scan-screen', 'no-survey', this.props.translation),
            building: translate('scan-screen', 'bien', this.props.translation),
            room: translate('scan-screen', 'room', this.props.translation),
            manual: translate('scan-screen', 'manual', this.props.translation),
        }
    }

    async loadSounds() {
        try {
            await Audio.setIsEnabledAsync(true);
            this.soundOK = new Audio.Sound();
            await this.soundOK.loadAsync(require('../../../../assets/sound/normal_1.wav'));
            await this.soundOK.setVolumeAsync(1);
            this.soundChanged = new Audio.Sound();
            await this.soundChanged.loadAsync(require('../../../../assets/sound/changed_2.wav'));
            await this.soundChanged.setVolumeAsync(1);
            this.soundNew = new Audio.Sound();
            await this.soundNew.loadAsync(require('../../../../assets/sound/new_1.wav'));
            await this.soundNew.setVolumeAsync(1);
            this.soundError = new Audio.Sound();
            await this.soundError.loadAsync(require('../../../../assets/sound/error_1.wav'));
            await this.soundError.setVolumeAsync(1);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    launchPLaySound() {
        if (this.soundLoaded) {
            switch (this.props.scanStatus.status) {
                case SCAN_FOUND_WITH_DIFF:
                    this.playSound(this.soundChanged);
                    break;
                case SCAN_FOUND_AND_IDENTICAL:
                    this.playSound(this.soundOK);
                    break;
                case SCAN_NOT_FOUND:
                    this.playSound(this.soundNew);
                    break;
                case SCAN_FOUND_ERROR:
                    this.playSound(this.soundError);
                    break;
            }
        }
    }

    async playSound(sound) {
        try {
            await sound.stopAsync();
            await sound.setPositionAsync(0);
            await sound.playAsync();
        } catch (error) {
        }
    }

    saveSurv(val) {
        //Can scan if all required are filled ==> save and scan new .
        this.props.saveSurvey(this.props.database.db, this.props.database, this.props.scanStatus, this.props.user.username, this.state.modeScan).then(res => {
        });
        if (this.props.scanStatus.code === null) {
            this.props.setCodeBar(this.props.database.db, this.props.scanStatus, val, this.state.modeScan).then((res) => {
                //scan and retrieve is finished
                this.launchPLaySound();
            })
        }
    }

    onChangeCodeBar(val) {
        if (!this.props.scanStatus.error || this.state.showManual) {
            if (val === null) {

                this.props.setCodeBar(this.props.database.db, this.props.scanStatus, val, this.state.modeScan).then((res) => {
                    //scan and retrieve is finished
                    this.launchPLaySound();
                })
            } else {
                if (this.props.scanStatus.code === null) {
                    this.props.setCodeBar(this.props.database.db, this.props.scanStatus, val, this.state.modeScan).then((res) => {
                        //scan and retrieve is finished
                        this.launchPLaySound();
                    })
                }
            }
        }
    }

    onChange(val) {
        this.setState({focusOn: false});
        if (!this.props.scanStatus.error) {
            if (this.props.scanStatus.code === null) {
                this.props.setCodeBar(this.props.database.db, this.props.scanStatus, val, this.state.modeScan).then((res) => {
                    //scan and retrieve is finished
                    this.launchPLaySound();
                })
            } else {
                this.controlRoom(this.props.scanStatus.survey).then(res => {
                    if (res.good) {
                        if (this.props.scanStatus.survey.hasOwnProperty('fn_std') && this.props.scanStatus.survey['fn_std'].length > 0) {

                            asyncRetrieveAssetsById(this.props.database.db, 'fnstd', 'fn_std', this.props.scanStatus.survey['fn_std'], null).then(res => {
                                if (res.length === 0) {
                                    alert(this.translation.saveStandardNotExist);
                                } else {
                                    //Can scan if all required are filled ==> save and scan new .
                                    this.props.saveSurvey(this.props.database.db, this.props.database, this.props.scanStatus, this.props.user.username, this.state.modeScan).then(res => {
                                    });
                                    if (val !== null) {
                                        this.props.setCodeBar(this.props.database.db, this.props.scanStatus, val, this.state.modeScan).then((res) => {
                                            //scan and retrieve is finished
                                            this.launchPLaySound();
                                        })
                                    }
                                }
                            });
                        } else {

                            //Can scan if all required are filled ==> save and scan new .
                            this.props.saveSurvey(this.props.database.db, this.props.database, this.props.scanStatus, this.props.user.username, this.state.modeScan).then(res => {
                                if (!this.props.scanStatus.error) {
                                    if (val !== null) {
                                        this.props.setCodeBar(this.props.database.db, this.props.scanStatus, val, this.state.modeScan).then((res) => {
                                            //scan and retrieve is finished
                                            this.launchPLaySound();
                                        })
                                    }

                                }
                            });
                        }
                    } else {
                        alert(this.translation.errorSave +' ' + res.message);
                    }
                });
            }
        } else {
            alert(this.translation.error);
            console.log(this.props.scanStatus);
        }
    }

    onSave(data) {
        this.props.saveSurvey(this.props.database.db, this.props.database, this.props.scanStatus, this.props.user.username, this.state.modeScan).then(res => {
            if (!this.props.scanStatus.error) {
                this.props.setCodeBar(this.props.database.db, this.props.scanStatus, null, this.state.modeScan).then((res) => {
                })
            }
            this.onPressTa();
        });
        this.onPressManuel();
    }

    onCancel() {
        this.props.setCodeBar(this.props.database.db, this.props.scanStatus, null, this.state.modeScan).then((res) => {
            this.onPressTa();
        })
        this.onPressManuel();
    }

    onPressRoom() {
        this.setState({showRoom: true, showScan: false, showManuel: false});
    }

    onPressTa() {
        //this.controlRoomHandler();
        this.setState({showRoom: false, showScan: true, showManuel: false, focusOn: true});
    }

    onPressManuel() {
        this.controlRoomHandler();
        this.setState({showRoom: false, showScan: false, showManuel: true});
    }

    controlRoomHandler() {
        this.controlRoom(this.props.scanStatus.container).then(res => {

            if (!res.good) {
                alert(res.message);
            }
        });
    }

    controlRoom(data) {
        return new Promise(resolve => {
            let table = null;
            if (data.hasOwnProperty('bl_id')) {
                if (data.rm_id.length > 0) {
                    table = 'rm';
                } else if (data.fl_id.length > 0) {
                    table = 'fl';

                } else if (data.bl_id.length > 0) {
                    table = 'bl';
                }
                if (table !== null) {


                    checkBlFlRm(this.props.database.db, table, data).then(res => {
                        resolve(res);
                    });
                } else {
                    resolve({good: false, message: this.translation.localNotFilled});
                }


            } else {
                resolve({good: true, message: this.translation.noSurvey})
            }
        })
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <View style={styles.buttonArea}>
                    <TouchableWithoutFeedback onPress={() => this.onPressRoom()}>
                        <View style={[styles.baseInput]}>
                            <Text style={[styles.input]}>{this.translation.room} </Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => this.onPressTa()}>
                        <View style={[styles.baseInput]}>
                            <Text style={[styles.input]}>{this.translation.building}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => this.onPressManuel()}>
                        <View style={[styles.baseInput]}>
                            <Text style={[styles.input]}>{this.translation.manual}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <ContainerScreen show={this.state.showRoom}/>
                <ManualModeScanning
                    modeScan={this.state.modeScan}
                    show={this.state.showManuel}
                    style={styles.scannerPart}
                    onChangeCodeBar={(value) => {
                        this.onChangeCodeBar(value)
                    }}
                    press={(value) => {
                        this.onChange(value)
                    }}
                    save={(value) => {
                        this.onSave(value)
                    }}
                    cancel={() => {
                        this.onCancel()
                    }}
                />
                <ScanerModeScan
                    modeScan={this.state.modeScan}
                    show={this.state.showScan}
                    style={styles.scannerPart}
                    focusOn={this.state.focusOn}
                    onChange={(value) => {
                        this.onChange(value)
                    }}
                    press={(value) => {
                        this.onChange(value)
                    }}
                    save={(value) => {
                        this.onSave(value)
                    }}
                    cancel={() => {
                        this.onCancel()
                    }}

                />
            </View>
        )
    };
}

const styles = StyleSheet.create({

    buttonArea: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 0.5,
        borderColor: '#ddd',
    },
    baseInput: {
        borderWidth: 1,
        borderRadius: 3,
        borderColor: '#6c88b0',
        flexDirection: 'row',
        height: 45,
        width: '30%',
        margin: 5,
    },
    input: {
        flex: 5,
        color: '#fff',
        backgroundColor: '#6c88b0',
        paddingTop: 13,
        paddingLeft: 10,
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 13
    },
    wrapper: {
        paddingTop: Constants.statusBarHeight, backgroundColor: '#fff', flex: 1
    },
    scannerPart: {
        height: 150,
        width: '100%', position: 'relative'
    },
    resultPart: {
        backgroundColor: 'red'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
const mapStateToProps = (state) => {
    return {
        user: state.userManagement,
        scanStatus: state.scanStatus,
        database: state.localDatabase,
        translation: state.translationManagement
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        setCodeBar: async (db, state, codebar, mode) => {
            return await dispatch(retrieveDataForCodeBar(db, dispatch, state, codebar, mode))
        },
        saveSurvey: async (db, dbState, state, user, mode) => {
            return await dispatch(saveSurveyAfterScanning(db, dispatch, dbState, state, user, mode))
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ScanningScreen)
