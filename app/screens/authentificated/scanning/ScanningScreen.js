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

class ScanningScreen extends React.Component {
    soundOK = null;
    soundChanged = null;
    soundNew = null;
    soundError = null;
    soundLoaded = false;

    constructor(props) {
        super(props);

        this.loadSounds().then(res => {
            this.soundLoaded = res;
        });
        this.state = {showRoom: true, showScan: false, showManual: false, focusOn: false}
    }

    async loadSounds() {
        try {
            await Audio.setIsEnabledAsync(true);
            this.soundOK = new Audio.Sound();
            await this.soundOK.loadAsync(require('../../../../assets/sound/normal_1.wav'));
            await this.soundOK.setVolumeAsync(0.6);
            this.soundChanged = new Audio.Sound();
            await this.soundChanged.loadAsync(require('../../../../assets/sound/changed_2.wav'));
            await this.soundChanged.setVolumeAsync(0.5);
            this.soundNew = new Audio.Sound();
            await this.soundNew.loadAsync(require('../../../../assets/sound/new_1.wav'));
            await this.soundNew.setVolumeAsync(0.5);
            this.soundError = new Audio.Sound();
            await this.soundError.loadAsync(require('../../../../assets/sound/error_1.wav'));
            await this.soundError.setVolumeAsync(0.6);
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
        this.props.saveSurvey(this.props.database.db, this.props.database, this.props.scanStatus, this.props.user.username).then(res => {
        });
        if (this.props.scanStatus.code === null) {
            this.props.setCodeBar(this.props.database.db, this.props.scanStatus, val).then((res) => {
                //scan and retrieve is finished
                this.launchPLaySound();
            })
        }
    }

    onChangeCodeBar(val) {
        console.log('onChangeCodeBar je change ma valeur', val);
        if (!this.props.scanStatus.error || this.state.showManual) {
            if (val === null) {

                this.props.setCodeBar(this.props.database.db, this.props.scanStatus, val).then((res) => {
                    //scan and retrieve is finished
                    this.launchPLaySound();
                })
            } else {
                if (this.props.scanStatus.code === null) {
                    this.props.setCodeBar(this.props.database.db, this.props.scanStatus, val).then((res) => {
                        //scan and retrieve is finished
                        this.launchPLaySound();
                    })
                }
            }
        }
    }

    onChange(val) {
        console.log('je scan', val);
        console.log('scanstatus', this.props.scanStatus.error);
        console.log('scanstatus txt', this.props.scanStatus.codebar);
        this.setState({focusOn: false});
        if (!this.props.scanStatus.error) {
            if (this.props.scanStatus.code === null) {
                this.props.setCodeBar(this.props.database.db, this.props.scanStatus, val).then((res) => {
                    //scan and retrieve is finished
                    this.launchPLaySound();
                })
            } else {
                this.controlRoom(this.props.scanStatus.survey).then(res => {
                    if (res.good) {
                        if (this.props.scanStatus.survey.hasOwnProperty('fn_std') && this.props.scanStatus.survey['fn_std'].length > 0) {
                            console.log('j ai du fnstd');
                            asyncRetrieveAssetsById(this.props.database.db, 'fnstd', 'fn_std', this.props.scanStatus.survey['fn_std'], null).then(res => {
                                if (res.length === 0) {
                                    alert('Erreur lors de l\'enregistrement : le standard de bien renseigné n\'existe pas');
                                } else {
                                    //Can scan if all required are filled ==> save and scan new .
                                    this.props.saveSurvey(this.props.database.db, this.props.database, this.props.scanStatus, this.props.user.username).then(res => {
                                    });
                                    if (val !== null) {
                                        this.props.setCodeBar(this.props.database.db, this.props.scanStatus, val).then((res) => {
                                            //scan and retrieve is finished
                                            this.launchPLaySound();
                                        })
                                    }
                                }
                            });
                        } else {

                            //Can scan if all required are filled ==> save and scan new .
                            this.props.saveSurvey(this.props.database.db, this.props.database, this.props.scanStatus, this.props.user.username).then(res => {
                                console.log('save survey', this.props.scanStatus.error);
                                if (!this.props.scanStatus.error) {
                                    if (val !== null) {
                                        this.props.setCodeBar(this.props.database.db, this.props.scanStatus, val).then((res) => {
                                            //scan and retrieve is finished
                                            this.launchPLaySound();
                                        })
                                    }

                                }
                            });
                        }
                    } else {
                        alert('Erreur lors de l\'enregistrement : ' + res.message);
                    }
                });
            }
        } else {
            alert('error');
            console.log(this.props.scanStatus);
        }
    }

    onSave(data) {
        this.props.saveSurvey(this.props.database.db, this.props.database, this.props.scanStatus, this.props.user.username).then(res => {
            if (!this.props.scanStatus.error) {
                this.props.setCodeBar(this.props.database.db, this.props.scanStatus, null).then((res) => {
                })
            }
            this.onPressTa();
        });
        this.onPressManuel();
    }

    onCancel() {
        this.props.setCodeBar(this.props.database.db, this.props.scanStatus, null).then((res) => {
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
                    resolve({good: false, message: 'Aucune information concernant le local n\' a été renseigné!'});
                }


            } else {
                resolve({good: true, message: 'Aucun survey en cours'})
            }
        })
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <View style={styles.buttonArea}>
                    <TouchableWithoutFeedback onPress={() => this.onPressRoom()}>
                        <View style={[styles.baseInput]}>
                            <Text style={[styles.input]}>Pièce </Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => this.onPressTa()}>
                        <View style={[styles.baseInput]}>
                            <Text style={[styles.input]}>Bien</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => this.onPressManuel()}>
                        <View style={[styles.baseInput]}>
                            <Text style={[styles.input]}>Manuel</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <ContainerScreen show={this.state.showRoom}/>
                <ManualModeScanning
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
        database: state.localDatabase
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        setCodeBar: async (db, state, codebar) => {
            return await dispatch(retrieveDataForCodeBar(db, dispatch, state, codebar))
        },
        saveSurvey: async (db, dbState, state, user) => {
            return await dispatch(saveSurveyAfterScanning(db, dispatch, dbState, state, user))
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ScanningScreen)
