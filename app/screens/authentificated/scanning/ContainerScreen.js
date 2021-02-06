import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {connect} from 'react-redux';
import {AntDesign} from '@expo/vector-icons';
import {asyncRetrieveAssetsById, asyncRetrieveAssetsLimit} from "../../../api/assets";
import ModalScreen from "./ModalScreen";
import {editContainer} from "../../../api/scan";
import {translate} from "../../../store/reducers/translation";
import {retrieveFields} from "../../../api/tableDef";

class ContainerScreen extends React.Component {
    blData = [];
    filterBlData = [];
    flData = [];
    filterFlData = [];
    rmData = [];
    filterRmData = [];
    translation;
    mlHeading=[];

    constructor(props) {
        super(props);
        this.state = {tableModal: null, showModal: false, titleModal: null, dataModal: null,header: null};
        asyncRetrieveAssetsLimit(this.props.database.db, 'bl', null, null, null, null, null).then(bl => {
            asyncRetrieveAssetsLimit(this.props.database.db, 'fl', null, null, null, null, null).then(fl => {
                asyncRetrieveAssetsLimit(this.props.database.db, 'rm', null, null, null, null, null).then(rm => {
                    asyncRetrieveAssetsById(this.props.database.db, "afm_flds", "table_name", 'bl', "display_order asc").then(blMlHeading => {
                        let currentHeader = retrieveFields('bl', blMlHeading);
                        this.mlHeading.push({
                            table: 'bl',
                            headers: currentHeader.fields,
                            cells: currentHeader.fields.length
                        });
                        asyncRetrieveAssetsById(this.props.database.db, "afm_flds", "table_name", 'fl', "display_order asc").then(flMlHeading => {
                            let currentHeader = retrieveFields('fl', flMlHeading);
                            this.mlHeading.push({
                                table: 'fl',
                                headers: currentHeader.fields,
                                cells: currentHeader.fields.length
                            });
                            asyncRetrieveAssetsById(this.props.database.db, "afm_flds", "table_name", 'rm', "display_order asc").then(rmMlHeading => {
                                let currentHeader = retrieveFields('rm', rmMlHeading);
                                this.mlHeading.push({
                                    table: 'rm',
                                    headers: currentHeader.fields,
                                    cells: currentHeader.fields.length
                                });
                                this.blData = bl;
                                this.filterBlData = bl;
                                this.flData = fl;
                                this.filterFlData = fl;
                                this.rmData = rm;
                                this.filterRmData = rm;
                            });
                        });
                    });
                });
            });
        });

        this.translation = {
            chooseBuilding: translate('container-screen', 'choose-building', this.props.translation),
            chooseFloor: translate('container-screen', 'choose-floor', this.props.translation),
            chooseRoom: translate('container-screen', 'choose-room', this.props.translation),
            chooseTable: translate('container-screen', 'choose-room-title', this.props.translation),
            buildingCode: translate('container-screen', 'code-building', this.props.translation),
            floorCode: translate('container-screen', 'code-floor', this.props.translation),
            roomCode: translate('container-screen', 'code-room', this.props.translation),
        }
    }

    filterBl(value) {
        if (value.length) {
            // Filter Data
            this.filterBlData = this.blData.filter(item => {
                return (item.bl_id.startsWith(value))
            })
            this.filterFlData = this.flData.filter(item => {
                return (item.bl_id.startsWith(value))
            });
            this.filterRmData = this.rmData.filter(item => {
                return (item.bl_id.startsWith(value))
            });
        } else {
            this.filterBlData = this.blData;
            this.filterFlData = this.flData;
            this.filterRmData = this.rmData;
        }
    }

    filterFl(value) {
        if (this.props.scanStatus.container.bl_id.length) {
            if (value.length) {
                this.filterFlData = this.flData.filter(item => {
                    return (item.bl_id.startsWith(this.props.scanStatus.container.bl_id) && item.fl_id.startsWith(value))
                });
            } else {
                this.filterFlData = this.flData.filter(item => {
                    return (item.bl_id.startsWith(this.props.scanStatus.container.bl_id))
                });
            }
        } else {
            if (value.length) {
                this.filterFlData = this.flData.filter(item => {
                    return item.fl_id.startsWith(value)
                });
            } else {
                this.filterFlData = this.flData;
            }
        }
        this.props.setContainer(this.props.scanStatus, 'fl', value, false);
        if (value.length) {
        }
        this.filterRm();
    }

    filterRm() {
        let value = this.props.scanStatus.container.rm_id;
        if (this.props.scanStatus.container.bl_id.length) {
            //bl id fill and fl id fill
            if (this.props.scanStatus.container.fl_id.length) {
                //bl fl rm fill
                if (value.length) {
                    this.filterRmData = this.rmData.filter(item => {
                        return (item.bl_id.startsWith(this.props.scanStatus.container.bl_id) && item.fl_id.startsWith(this.props.scanStatus.container.fl_id) && item.rm_id.startsWith(value))
                    });
                } else {
                    this.filterRmData = this.rmData.filter(item => {
                        return (item.bl_id.startsWith(this.props.scanStatus.container.bl_id) && item.fl_id.startsWith(this.props.scanStatus.container.fl_id))
                    });
                }
            } else {
                //bl and rm fill
                if (value.length) {
                    this.filterRmData = this.rmData.filter(item => {
                        return (item.bl_id.startsWith(this.props.scanStatus.container.bl_id) && item.rm_id.startsWith(value))
                    });
                } else {
                    this.filterRmData = this.rmData.filter(item => {
                        return (item.bl_id.startsWith(this.props.scanStatus.container.bl_id))
                    });
                }
            }
        } else {
            //bl id fill and fl id fill
            if (this.props.scanStatus.container.fl_id.length) {
                //bl fl rm fill
                if (value.length) {
                    this.filterRmData = this.rmData.filter(item => {
                        return (item.fl_id.startsWith(this.props.scanStatus.container.fl_id) && item.rm_id.startsWith(value))
                    });
                } else {
                    this.filterRmData = this.rmData.filter(item => {
                        return (item.fl_id.startsWith(this.props.scanStatus.container.fl_id))
                    });
                }
            } else {
                //bl and rm fill
                if (value.length) {
                    this.filterRmData = this.rmData.filter(item => {
                        return (item.rm_id.startsWith(value))
                    });
                } else {
                    this.filterRmData = this.rmData.filter(item => {
                        return true
                    });
                }
            }
        }

    }

    onChangeBl(value) {
        this.props.setContainer(this.props.scanStatus, 'bl', {bl_id: value, fl_id: '', rm_id: ''}, true);
        this.filterBl(value);
    }

    onChangeFl(value) {
        this.props.setContainer(this.props.scanStatus, 'fl', {
            bl_id: this.props.scanStatus.container.bl_id,
            fl_id: value,
            rm_id: ''
        }, true);
    }

    onChangeRm(value) {
        this.props.setContainer(this.props.scanStatus, 'rm', {
            bl_id: this.props.scanStatus.container.bl_id,
            fl_id: this.props.scanStatus.container.fl_id,
            rm_id: value
        }, true);
    }

    showModal(table) {
        switch (table) {
            case 'bl':
                this.setState({
                    tableModal: 'bl',
                    showModal: true,
                    titleModal: this.translation.chooseBuilding,
                    dataModal: this.filterBlData,
                    header: this.mlHeading.filter(ml => ml.table === 'bl')[0]
                });
                break;

            case 'fl':
                this.filterFl(this.props.scanStatus.container.fl_id);
                this.setState({
                    tableModal: 'fl',
                    showModal: true,
                    titleModal: this.translation.chooseFloor,
                    dataModal: this.filterFlData,
                    header: this.mlHeading.filter(ml => ml.table === 'fl')[0]
                });
                break;

            case 'rm':
                this.filterRm('');
                this.setState({
                    tableModal: 'rm',
                    showModal: true,
                    titleModal: this.translation.chooseRoom,
                    dataModal: this.filterRmData,
                    header: this.mlHeading.filter(ml => ml.table === 'rm')[0]
                });
                break;
        }
    }

    closeModal(table, value) {
        this.setState({showModal: false});
        if (value !== 'title') {
            switch (table) {
                case 'bl':
                    this.onChangeBl(value.bl_id);
                    break;
                case 'fl':
                    this.props.setContainer(this.props.scanStatus, 'fl', {
                        bl_id: value.bl_id,
                        fl_id: value.fl_id,
                        rm_id: ''
                    }, true);
                    // this.filterFl(value.fl_id);
                    break;
                case 'rm':
                    this.props.setContainer(this.props.scanStatus, 'rm', {
                        bl_id: value.bl_id,
                        fl_id: value.fl_id,
                        rm_id: value.rm_id
                    }, true);
                    this.filterRm(value.rm_id);
                    break;
            }
        }
    }

    onBlur(table) {
    }

    render() {
        if (this.props.show) {
            return (
                <View style={{flex: 1}}>
                    <ModalScreen show={this.state.showModal} table={this.state.tableModal} title={this.state.titleModal}
                                 data={this.state.dataModal} header={this.state.header} press={(table, value) => this.closeModal(table, value)}/>
                    <Text style={styles.header}>{this.translation.chooseTable}</Text>
                    <View>
                        <Text style={styles.label}>{this.translation.buildingCode}</Text>
                        <View style={styles.textInput}>
                            <TextInput style={styles.textInputinput} value={this.props.scanStatus.container.bl_id}
                                       onChangeText={(input) => {
                                           this.onChangeBl(input)
                                       }}></TextInput>
                            <AntDesign name={'search1'} style={styles.textInputButton} onPress={() => {
                                this.showModal('bl')
                            }}/>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.label}>{this.translation.floorCode}</Text>
                        <View style={styles.textInput}>
                            <TextInput style={styles.textInputinput} value={this.props.scanStatus.container.fl_id}
                                       onBlur={(input) => {
                                           this.onBlur('fl')
                                       }} onChangeText={(input) => {
                                this.onChangeFl(input)
                            }}></TextInput>
                            <AntDesign name={'search1'} style={styles.textInputButton} onPress={() => {
                                this.showModal('fl')
                            }}/>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.label}>{this.translation.roomCode}</Text>
                        <View style={styles.textInput}>
                            <TextInput style={styles.textInputinput} value={this.props.scanStatus.container.rm_id}
                                       onBlur={(input) => {
                                           this.onBlur('rm')
                                       }} onChangeText={(input) => {
                                this.onChangeRm(input)
                            }}></TextInput>
                            <AntDesign name={'search1'} style={styles.textInputButton} onPress={() => {
                                this.showModal('rm')
                            }}/>
                        </View>
                    </View>
                </View>)
        } else {
            return false;
        }
    };
}

const styles = StyleSheet.create({
    header: {
        textAlign: 'center', padding: 10,
        borderBottomWidth: 0.5,
        borderColor: '#ddd',
    },
    label: {
        margin: 10,
        marginBottom: 0
    },
    textInputinput: {
        flex: 1,
        borderWidth: 1, borderRightWidth: 0, borderColor: '#ddd'
    },
    textInputButton: {
        width: 40, height: 40,
        textAlign: 'center',
        backgroundColor: '#6c88b0',
        color: '#fff',
        padding: 12, fontSize: 18
    },
    textInput: {
        margin: 10,
        flexDirection: 'row'
    },
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
const mapStateToProps = (state) => {
    return {
        scanStatus: state.scanStatus,
        database: state.localDatabase,
        translation: state.translationManagement
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        setContainer: async (state, table, value, full) => {
            return await dispatch(editContainer(dispatch, state, table, value, full))
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ContainerScreen)
