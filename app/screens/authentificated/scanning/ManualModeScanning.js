import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {AntDesign} from "@expo/vector-icons";
import ScanningFormScreen from "./ScanningFormScreen";

class ManualModeScanning extends React.Component {
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
        console.log('mon state', this.state.scanVal);
    }

    UNSAFE_componentWillReceiveProps(props) {
    }

    onFocus() {
        this.setState({scanFocused: true});
    }

    onBlur(value) {
        this.setState({scanVal: value})
    }

    onChange(data) {
        this.setState({scanVal: data})
    }

    onPress() {
        this.props.onChangeCodeBar(this.state.scanVal);
        this.setState({showForm: true})
    }

    render() {
        if (this.props.show) {
            return (
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column', position: 'relative', zIndex: 600, backgroundColor: '#fff'
                    }}>

                    <View style={styles.textInput}>
                        <TextInput style={styles.textInputinput} value={this.state.scanVal} onBlur={(input) => {
                            this.onBlur(input)
                        }} onChangeText={(input) => {
                            this.onChange(input)
                        }}></TextInput>
                        <AntDesign name={'search1'} style={styles.textInputButton} onPress={() => {
                            this.onPress()
                        }}/>
                    </View>
                    <ScanningFormScreen
                        modeScan={this.props.modeScan}
                        manual={true}
                        show={this.state.showForm}
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
    }
});

export default ManualModeScanning;
