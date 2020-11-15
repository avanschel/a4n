import React from 'react';
import {TextInput, View, StyleSheet, Keyboard} from 'react-native';
import ScanningFormScreen from "./ScanningFormScreen";
import KeyboardSpacer from 'react-native-keyboard-spacer';

class ScanerModeScan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scanFocused: true,
            scanning_currtype: "afm_flds",
            scanning_currtype_iscontainer: false,
            scanning_scanitem: null,
            scanning_scanchanged: false,
            statusItem: '',
            showSelectValueModal: false,
            showScanField: false,
            //assetTypes:[],
            selectValueFilters: {},
            scanVal: '',

            containerPK: [],
            contentPK: [],
            scanToField: [],
            showForm: false

        }
    }

    UNSAFE_componentWillReceiveProps(props) {
    }

    onFocus() {
        this.setState({
            scanFocused: true
        }, () => {
            //this.updateDisplayScan();


        })
    }

    onBlur() {
        this.setState({
            scanFocused: false
        }, () => {
            //this.updateDisplayScan();


        })

        //---------------------------------------------------------------------------------
    }

    handleSetScanningValue(data) {
        this.props.onChange(data);
        //this.setState({scanVal:data})
    }

    render() {
        if (this.props.show) {
            return (
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column', position: 'relative', zIndex: 600, backgroundColor: '#000'
                    }}>
                    <TextInput
                        onEndEditing={() => {
                            this.onBlur()
                        }}
                        onBlur={() => this.onBlur()}
                        onFocus={() => {
                            Keyboard.dismiss();
                            //this.onFocus()
                            setTimeout(this.onFocus.bind(this), 400);
                        }
                        }
                        style={{
                            height: 40,
                            width: '100%',
                            backgroundColor: '#fff',
                            marginTop: 2,
                            borderColor: 'gray',
                            borderWidth: 1,
                            borderRadius: 3,
                            padding: 4
                        }}
                        underlineColorAndroid='transparent'
                        autoFocus
                        placeholderTextColor='black'
                        placeholder='ScanZone'
                        ref="scanField"

                        onChangeText={(text) => this.handleSetScanningValue(text)}
                        editable={true}
                        maxLength={40}
                        value={this.state.scanVal}
                    />
                    <KeyboardSpacer/>
                    <ScanningFormScreen modeScan={this.props.modeScan}
                                        manual={false}
                                        show={true}
                                        focuss={!this.props.focusOn}
                                        codeBar={this.state.codeBar}
                                        press={(value) => this.props.press(value)}
                                        save={(value) => this.props.save(value)}
                                        cancel={() => this.props.cancel()}

                    />

                </View>
            );

        } else {
            return false
        }

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center', zIndex: 0
    },
    qr: {
        marginTop: '20%',
        marginBottom: '20%',
        width: 360,
        height: 250,
    }
});

export default ScanerModeScan;
