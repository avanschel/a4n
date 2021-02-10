import React from 'react';
import {Alert, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View} from 'react-native';
import {connect} from 'react-redux'
import {SCAN_FOUND_AND_IDENTICAL, SCAN_FOUND_ERROR, SCAN_FOUND_WITH_DIFF, SCAN_NOT_FOUND} from "../../../../constante";
import ScanNewScreen from "./feedback/ScanNewScreen";
import ScanFoundButDiffScreen from "./feedback/ScanFoundButDiffScreen";
import ScanFoundIdenticScreen from "./feedback/ScanFoundIdenticScreen";
import {checkBlFlRm, getTableDef, onChangeSurvey, onSetSCanState} from "../../../api/scan";
import {asyncRetrieveAssetsById, asyncRetrieveAssetsLimit} from "../../../api/assets";
import {AntDesign} from "@expo/vector-icons";
import FormModalScreen from "./FormModalScreen";
import SelectorScreen from "./SelectorScreen";
import {retrieveFields} from "../../../api/tableDef";
import {translate} from "../../../store/reducers/translation";

class ScanningFormScreen extends React.Component {
    enumListLabels = {};
    blData = [];
    filterBlData = [];
    flData = [];
    filterFlData = [];
    rmData = [];
    filterRmData = [];
    stdData = [];
    filterStdData = [];
    change = false;
    stdTableName = 'eq';
    mlHeading = [];
    translation;

    constructor(props) {
        super(props);
        this.state = {
            tableModal: null,
            showMyModal: false,
            titleModal: null,
            dataModal: null,
            showSelector: false,
            dataSelector: false,
            fieldSelector: ''
        };
        this.stdTableName = (this.props.modeScan === 'eq') ? 'eqstd' : 'fnstd';
        this.props.getDefFields(this.props.database.db, this.props.scanStatus, this.props.modeScan).then(res => {
            var enums = res.state.defFields.filter(df => df["enum_list"] && df["enum_list"].length > 0);
            const survey = this.props.scanStatus["survey"];
            for (var i = 0; i < enums.length; i++) {
                this.enumListLabels[enums[i]["field_name"]] = survey[enums[i]["field_name"]];
            }
        });
        this.translation = {
            bien: translate('scan-screen', 'bien', this.props.translation),
            cancel: translate('scan-screen', 'cancel', this.props.translation),
            chooseBuilding: translate('scan-screen', 'choose-building', this.props.translation),
            chooseEqStd: translate('scan-screen', 'choose-eqstd', this.props.translation),
            chooseFnStd: translate('scan-screen', 'choose-fnstd', this.props.translation),
            chooseFloor: translate('scan-screen', 'choose-floor', this.props.translation),
            chooseRoom: translate('scan-screen', 'choose-room', this.props.translation),
            dontExist: translate('scan-screen', 'dont-exist', this.props.translation),
            elementNotFound: translate('scan-screen', 'element-not-found', this.props.translation),
            error: translate('scan-screen', 'error', this.props.translation),
            fillRequiredField: translate('scan-screen', 'fill-required-field', this.props.translation),
            localNotFilled: translate('scan-screen', 'local-not-filled', this.props.translation),
            manual: translate('scan-screen', 'manual', this.props.translation),
            noSurvey: translate('scan-screen', 'no-survey', this.props.translation),
            ok: translate('scan-screen', 'ok', this.props.translation),
            pleaseScan: translate('scan-screen', 'please-scan', this.props.translation),
            register: translate('scan-screen', 'register', this.props.translation),
            room: translate('scan-screen', 'room', this.props.translation),
            saveError: translate('scan-screen', 'save-error', this.props.translation),
            saveStandardNotExist: translate('scan-screen', 'save-standard-not-exist', this.props.translation),
            scanDone: translate('scan-screen', 'scan-done', this.props.translation),
            standardNotFoundPart: translate('scan-screen', 'standard-not-found-part', this.props.translation),

        }
        asyncRetrieveAssetsLimit(this.props.database.db, 'bl', null, null, null, null, null).then(bl => {
            asyncRetrieveAssetsLimit(this.props.database.db, 'fl', null, null, null, null, null).then(fl => {
                asyncRetrieveAssetsLimit(this.props.database.db, 'rm', null, null, null, null, null).then(rm => {
                    asyncRetrieveAssetsLimit(this.props.database.db, this.stdTableName, null, null, null, null, null).then(fnstd => {
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
                                    asyncRetrieveAssetsById(this.props.database.db, "afm_flds", "table_name", 'fnstd', "display_order asc").then(rmMlHeading => {
                                        let currentHeader = retrieveFields('fnstd', rmMlHeading);
                                        this.mlHeading.push({
                                            table: 'fnstd',
                                            headers: currentHeader.fields,
                                            cells: currentHeader.fields.length
                                        });
                                        asyncRetrieveAssetsById(this.props.database.db, "afm_flds", "table_name", 'eqstd', "display_order asc").then(rmMlHeading => {
                                            let currentHeader = retrieveFields('eqstd', rmMlHeading);
                                            this.mlHeading.push({
                                                table: 'eqstd',
                                                headers: currentHeader.fields,
                                                cells: currentHeader.fields.length
                                            });
                                            this.blData = bl;
                                            this.filterBlData = bl;
                                            this.flData = fl;
                                            this.filterFlData = fl;
                                            this.rmData = rm;
                                            this.filterRmData = rm;
                                            this.stdData = fnstd;
                                            this.filterStdData = fnstd;
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });

        });
    }

    UNSAFE_componentWillReceiveProps(props) {
    }

    onPress() {
        this.props.press(this.props.scanStatus.code);
    }

    onPressSave() {
        this.props.save(this.props.scanStatus.code);
    }

    onPressCancel() {
        this.props.cancel();
    }

    getStyleSubForm() {
        switch (this.props.scanStatus.status) {
            case SCAN_NOT_FOUND:
                return styles.subFormScanNotFound;
            case SCAN_FOUND_AND_IDENTICAL:
                return styles.subFormScanFoundIdentical;
            case SCAN_FOUND_WITH_DIFF:
                return styles.subFormScanFoundWidthDiff;
            case SCAN_FOUND_ERROR:
                return styles.subFormScanError;

        }
    }

    getStyle() {
        switch (this.props.scanStatus.status) {
            case SCAN_NOT_FOUND:
                return styles.scanNotFound;
            case SCAN_FOUND_AND_IDENTICAL:
                return styles.scanFoundIdentical;
            case SCAN_FOUND_WITH_DIFF:
                return styles.scanFoundWidthDiff;
            case SCAN_FOUND_ERROR:
                return styles.scanError;

        }
    }

    showSelector(field, data) {
        this.setState({showSelector: true, dataSelector: data, fieldSelector: field});
    }

    closeSelector(field, value) {
        if (value !== null) {
            this.enumListLabels[field] = value.label;
            this.onFieldChange(field, value.value);
        }
        this.setState({showSelector: false});
    }

    showMyModal(table) {
        switch (table) {
            case 'bl':
                this.filterBl(this.props.scanStatus.survey.bl_id);
                this.setState({
                    tableModal: 'bl',
                    showMyModal: true,
                    titleModal: this.translation.chooseBuilding,
                    dataModal: this.filterBlData,
                    header: this.mlHeading.filter(ml => ml.table === 'bl')[0]
                });
                break;

            case 'fl':
                this.filterFl(this.props.scanStatus.survey.fl_id);
                this.setState({
                    tableModal: 'fl',
                    showMyModal: true,
                    titleModal: this.translation.chooseFloor,
                    dataModal: this.filterFlData,
                    header: this.mlHeading.filter(ml => ml.table === 'fl')[0]
                });
                break;

            case 'rm':
                this.filterRm(this.props.scanStatus.survey.rm_id);
                this.setState({
                    tableModal: 'rm',
                    showMyModal: true,
                    titleModal: this.translation.chooseRoom,
                    dataModal: this.filterRmData,
                    header: this.mlHeading.filter(ml => ml.table === 'fl')[0]
                });
                break;
            case 'fnstd':
                this.setState({
                    tableModal: 'fnstd',
                    showMyModal: true,
                    titleModal: this.translation.chooseFnStd,
                    dataModal: this.filterStdData,
                    header: this.mlHeading.filter(ml => ml.table === 'fnstd')[0]
                });
                break;
            case 'eqstd':
                this.setState({
                    tableModal: 'eqstd',
                    showMyModal: true,
                    titleModal: this.translation.chooseEqStd,
                    dataModal: this.filterStdData,
                    header: this.mlHeading.filter(ml => ml.table === 'eqstd')[0]
                });
                break;
        }
    }

    closeMyModal(table, value) {
        this.setState({showMyModal: false});
        if (value !== 'title') {
            let survey = this.props.scanStatus.survey;
            this.change = true;
            switch (table) {
                case 'bl':
                    survey['bl_id'] = value.bl_id;
                    survey['fl_id'] = '';
                    survey['rm_id'] = '';
                    this.props.changeSurvey(this.props.scanStatus, survey).then(res => {
                    });
                    break;
                case 'fl':
                    survey['bl_id'] = value.bl_id;
                    survey['fl_id'] = value.fl_id;
                    survey['rm_id'] = '';
                    this.props.changeSurvey(this.props.scanStatus, survey).then(res => {
                    });
                    break;
                case 'rm':
                    survey['bl_id'] = value.bl_id;
                    survey['fl_id'] = value.fl_id;
                    survey['rm_id'] = value.rm_id;
                    this.props.changeSurvey(this.props.scanStatus, survey).then(res => {
                    });
                    break;
                case 'fnstd':
                    survey['fn_std'] = value.fn_std;
                    this.props.changeSurvey(this.props.scanStatus, survey).then(res => {
                    });
                case 'eqstd':
                    survey['eq_std'] = value.eq_std;
                    this.props.changeSurvey(this.props.scanStatus, survey).then(res => {
                    });
                    break;
            }
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

    filterStandard() {
        if (this.stdTableName === 'eqstd') {
            this.filterStdData = (this.props.scanStatus.survey.eq_std && this.props.scanStatus.survey.eq_std.length) ? this.stdData.filter(item => {
                return (item.eq_std.startsWith(this.props.scanStatus.survey.eq_std))
            }) : this.stdData;
        } else {
            this.filterStdData = (this.props.scanStatus.survey.fn_std && this.props.scanStatus.survey.fn_std.length) ? this.stdData.filter(item => {
                return (item.fn_std.startsWith(this.props.scanStatus.survey.fn_std))
            }) : this.stdData;
        }
    }

    filterFl(value) {
        if (this.props.scanStatus.survey.bl_id.length) {
            if (value && value.length) {
                this.filterFlData = this.flData.filter(item => {
                    return (item.bl_id.startsWith(this.props.scanStatus.survey.bl_id) && item.fl_id.startsWith(value))
                });
            } else {
                this.filterFlData = this.flData.filter(item => {
                    return (item.bl_id.startsWith(this.props.scanStatus.survey.bl_id))
                });
            }
        } else {
            if (value && value.length) {
                this.filterFlData = this.flData.filter(item => {
                    return item.fl_id.startsWith(value)
                });
            } else {
                this.filterFlData = this.flData;
            }
        }
        if (value && value.length) {
            this.filterRm('');
        }
    }

    filterRm(value) {
        if (this.props.scanStatus.survey.bl_id.length) {
            //bl id fill and fl id fill
            if (this.props.scanStatus.survey.fl_id.length) {
                //bl fl rm fill
                if (value && value.length) {
                    this.filterRmData = this.rmData.filter(item => {
                        return (item.bl_id.startsWith(this.props.scanStatus.survey.bl_id) && item.fl_id.startsWith(this.props.scanStatus.survey.fl_id) && item.rm_id.startsWith(value))
                    });
                } else {
                    this.filterRmData = this.rmData.filter(item => {
                        return (item.bl_id.startsWith(this.props.scanStatus.survey.bl_id) && item.fl_id.startsWith(this.props.scanStatus.survey.fl_id))
                    });
                }
            } else {
                //bl and rm fill
                if (value && value.length) {
                    this.filterRmData = this.rmData.filter(item => {
                        return (item.bl_id.startsWith(this.props.scanStatus.survey.bl_id) && item.rm_id.startsWith(value))
                    });
                } else {
                    this.filterRmData = this.rmData.filter(item => {
                        return (item.bl_id.startsWith(this.props.scanStatus.survey.bl_id))
                    });
                }
            }
        } else {
            //bl id fill and fl id fill
            if (this.props.scanStatus.survey.fl_id.length) {
                //bl fl rm fill
                if (value && value.length) {
                    this.filterRmData = this.rmData.filter(item => {
                        return (item.fl_id.startsWith(this.props.scanStatus.survey.fl_id) && item.rm_id.startsWith(value))
                    });
                } else {
                    this.filterRmData = this.rmData.filter(item => {
                        return (item.fl_id.startsWith(this.props.scanStatus.survey.fl_id))
                    });
                }
            } else {
                //bl and rm fill
                if (value && value.length) {
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

    setFilter(field, value) {
        switch (field) {
            case 'bl_id':
                this.filterBl(value);
                break;
            case 'fl_id':
                this.filterFl(value);
                break;
            case 'rm_id':
                this.filterRm(value);
                break;
            case 'standard':
                this.filterStandard();
        }
    }

    onFieldChange(field, value) {
        this.change = true;
        let survey = this.props.scanStatus.survey;
        survey[field] = value;
        switch (field) {
            case 'bl_id':
                survey.fl_id = '';
                survey.rm_id = '';
                break;
            case 'fl_id':
                survey.rm_id = '';
        }
        this.props.changeSurvey(this.props.scanStatus, survey).then(res => {
        });

        //this.setFilter(field,value);
    }

    selectValuesField(defField) {
        if (defField.ref_table.length > 0) {
            var val = this.props.scanStatus.survey[defField.field_name];
            if (defField.field_name === 'rm_id' || defField.field_name === 'bl_id' || defField.field_name === 'fl_id') {
                if (!this.change) {
                    this.props.scanStatus.survey[defField.field_name] = this.props.scanStatus.container[defField.field_name];
                }
                return (
                    <View style={styles.textInput}>
                        <TextInput style={styles.formInput} onBlur={(input) => {
                            this.onBlur(defField.field_name.replace('_id', ''))
                        }} value={this.props.scanStatus.survey[defField.field_name]} onChangeText={(input) => {
                            this.onFieldChange(defField.field_name, input)
                        }}/>
                        <AntDesign name={'search1'} style={styles.textInputButton} onPress={() => {
                            this.showMyModal(defField.ref_table)
                        }}/>
                    </View>
                )
            } else {
                return (
                    <View style={styles.textInput}>
                        <TextInput style={styles.formInput} onBlur={(input) => {
                            this.onBlowBlur(defField.ref_table, defField.field_name)
                        }} value={this.props.scanStatus.survey[defField.field_name]} onChangeText={(input) => {
                            this.onFieldChange(defField.field_name, input)
                        }}/>
                        <AntDesign name={'search1'} style={styles.textInputButton} onPress={() => {
                            this.showMyModal(defField.ref_table)
                        }}/>
                    </View>
                )
            }
        } else {
            // Add custom code for enum field
            if (defField && defField["enum_list"] && defField["enum_list"].length > 0) {
                const enumlistData = defField["enum_list"].split(";");
                const enumList = [{value: '', label: 'No value'}];
                let value = "";
                for (var i = 0; i < enumlistData.length; i = i + 2) {
                    enumList.push({value: enumlistData[i], label: enumlistData[i + 1]});
                    if (value.length === 0) {
                        value = (this.props.scanStatus.survey[defField.field_name].length > 0 && this.props.scanStatus.survey[defField.field_name] === enumlistData[i]) ? enumlistData[i + 1] : "";
                    }
                }
                return (

                    <TouchableWithoutFeedback
                        onPress={() => this.showSelector(defField.field_name, enumList)}>
                        <View>
                            <Text
                                style={styles.formInputTT}>{value}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                )
            } else {
                return (
                    <View style={styles.textInput}>
                        <TextInput style={styles.formInput} value={this.props.scanStatus.survey[defField.field_name]}
                                   onChangeText={(input) => {
                                       this.onFieldChange(defField.field_name, input)
                                   }}/>
                    </View>
                )
            }
        }
    }

    readOnlyField(defField) {
        if (defField.readonly === 'Y') {
            return (<Text
                style={styles.formInputReadOnly}>{(defField.field_name !== 'ta_id') ? this.props.scanStatus.data[defField.field_name] : 'AUTO'} </Text>)
        } else {
            return this.selectValuesField(defField);
        }
    }

    generateField(defField) {
        return (
            <View key={'fie_' + defField.field_name} style={styles.formRow}>
                <Text
                    style={styles.formLabel}>{defField.ml_heading.replace(/\n|\r|(\n\r)/g, ' ').toUpperCase()} {(defField.required === 'Y') ? '*' : ''}</Text>
                {
                    this.readOnlyField(defField)
                }
            </View>

        )
    }

    showError() {

        Alert.alert(this.translation.scanDone, this.translation.fillRequiredField,
            [
                {
                    text: this.translation.ok, onPress: () => {
                        this.removeError()
                    }
                }
            ]);
    }

    removeError() {
        let state = {...this.props.scanStatus, error: false, text: ''};
        this.props.setNewState(state);
    }

    onBlur(table) {
        checkBlFlRm(this.props.database.db, table, this.props.scanStatus.survey).then(res => {
        })
    }

    onBlowBlur(table, field) {
        let message = this.translation.elementNotFound;
        switch (table) {
            case 'fnstd':
                message = this.translation.standardNotFoundPart + ' (' + this.props.scanStatus.survey[field] + ') ' + this.translation.dontExist;
                break;
        }
        if (this.props.scanStatus.survey[field].length > 0) {
            asyncRetrieveAssetsById(this.props.database.db, table, field, this.props.scanStatus.survey[field], null).then(res => {
            });
        }
    }

    render() {
        if (this.props.show) {
            if (!this.props.manual && this.props.scanStatus.loading) {
                return (

                    <View style={styles.main}>
                        <View style={styles.wrapper}>
                            <Text style={styles.placeHolder}>{this.translation.pleaseScan}</Text>
                        </View>
                    </View>
                )
            } else {
                if (!this.props.scanStatus.loading) {
                    if (!this.props.scanStatus.error) {
                        this.setFilter('bl_id', this.props.scanStatus.survey.bl_id);
                        this.setFilter('fl_id', this.props.scanStatus.survey.fl_id);
                        this.setFilter('rm_id', this.props.scanStatus.survey.rm_id);
                        this.setFilter('standard', null);
                    }
                    return (
                        <View style={styles.main}>
                            <View style={styles.wrapper}>
                                <View style={styles.container} onPress={() => this.onPress()}>
                                    <View style={[styles.bordered, this.getStyle()]}>
                                        <Text>{this.props.scanStatus.code}</Text>
                                    </View>
                                </View>
                                <ScanNewScreen press={() => this.onPress()}/>
                                <ScanFoundButDiffScreen press={() => this.onPress()}/>
                                <ScanFoundIdenticScreen press={() => this.onPress()}/>
                                <View style={styles.buttonArea}>
                                    <TouchableWithoutFeedback onPress={() => this.onPressSave()}>
                                        <View style={[styles.baseInput]}>
                                            <Text style={[styles.input]}>{this.translation.register} </Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={() => this.onPressCancel()}>
                                        <View style={[styles.baseInput]}>
                                            <Text style={[styles.input]}>{this.translation.cancel}</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                                {
                                    this.props.scanStatus.error ?
                                        <View style={styles.errorPan}>
                                            <Text>{this.translation.fillRequiredField}</Text>
                                        </View>
                                        : false
                                }
                                <View style={styles.forms}>
                                    <ScrollView style={[styles.subForm, this.getStyleSubForm()]}>
                                        <View>
                                            {
                                                this.props.scanStatus.defFields.map((key, index) => {
                                                    return this.generateField(key);
                                                })
                                            }
                                        </View>
                                    </ScrollView>
                                </View>

                            </View>
                            <FormModalScreen show={this.state.showMyModal} table={this.state.tableModal}
                                             title={this.state.titleModal} data={this.state.dataModal}
                                             header={this.state.header}
                                             press={(table, value) => this.closeMyModal(table, value)}/>
                            <SelectorScreen show={this.state.showSelector} field={this.state.fieldSelector}
                                            data={this.state.dataSelector}
                                            press={(field, value) => this.closeSelector(field, value)}/>

                        </View>
                    )
                } else {
                    return false;
                }
            }
        } else {
            return false
        }
    };

}

const styles = StyleSheet.create({
    errorPan: {
        padding: 8,
        color: '#a94442',
        backgroundColor: '#f2dede',
        margin: 5,
        borderWidth: 1,
        borderColor: '#ebccd1'
    },
    placeHolder: {
        textAlign: 'center', padding: 20,
        fontSize: 16,
        color: '#464646'
    },
    main: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 200,
        flex: 1,
        backgroundColor: '#fff'
    },
    subForm: {
        margin: 8,
        borderWidth: 1
    },

    subFormScanNotFound: {
        borderColor: '#c0392b'
    },
    subFormScanError: {
        borderColor: '#c0392b',
    },
    subFormScanFoundIdentical: {
        borderColor: '#1abc9c'
    },
    subFormScanFoundWidthDiff: {
        borderColor: '#2980b9'
    },
    forms: {
        backgroundColor: '#fff',
        flex: 1,
    },
    scanNotFound: {
        backgroundColor: '#e74c3c',
        borderColor: '#c0392b'
    },
    scanError: {
        backgroundColor: '#000', borderColor: '#c0392b', color: '#fff'
    },
    textInput: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
    },
    scanFoundIdentical: {
        backgroundColor: '#1abc9c',
        borderColor: '#16a085'
    },
    scanFoundWidthDiff: {
        backgroundColor: '#3498db',
        borderColor: '#2980b9'
    },
    bordered: {
        borderWidth: 1, padding: 8
    },
    container: {

        backgroundColor: '#fff',
        padding: 10,
    },
    wrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        flex: 1,
    },
    buttonArea: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 0.5,
        borderColor: '#ddd',
        backgroundColor: '#fff'
    },
    baseInput: {
        borderWidth: 1,
        borderRadius: 3,
        borderColor: '#aaa',
        flexDirection: 'row',
        height: 30,
        width: '45%',
        margin: 5,
    },
    input: {
        flex: 5,
        color: '#6c88b0',
        backgroundColor: '#eee',
        padding: 5,
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 13
    },
    formRow: {
        padding: 10, borderBottomWidth: 1, borderColor: '#f6f6f6',
    },
    formLabel: {
        paddingBottom: 5,
    },
    formInput: {
        flex: 2,
        borderWidth: 1, borderColor: '#ddd', paddingLeft: 5, height: 40
    },
    formInputTT: {
        width: '100%',
        borderRadius: 0,
        borderWidth: 1, borderColor: '#ddd', paddingLeft: 5, height: 40,
        paddingTop: 10,
    },
    formInputReadOnly: {
        borderWidth: 1, borderColor: '#ddd', padding: 5, backgroundColor: '#eee'
    },
    textInputButton: {
        width: 40, height: 40,
        textAlign: 'center',
        backgroundColor: '#6c88b0',
        color: '#fff',
        padding: 12, fontSize: 18
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
        getDefFields: async (db, state, table) => {
            return await dispatch(getTableDef(dispatch, state, db, table))
        },
        changeSurvey: async (state, survey) => {
            return await dispatch(onChangeSurvey(state, survey))
        },
        setNewState: async (state) => {
            return await dispatch(onSetSCanState(state))
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ScanningFormScreen)
