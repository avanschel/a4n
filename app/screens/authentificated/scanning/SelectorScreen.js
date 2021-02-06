import React from "react";
import {editContainer} from "../../../api/scan";
import {connect} from "react-redux";
import {Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import {translate} from "../../../store/reducers/translation";


class SelectorScreen extends React.Component {
    header = [];
    width = Math.round(Dimensions.get('window').width);
    title = '';
    translation;

    constructor(props) {
        super(props);
        this.translation = {
            chooseValue: translate('selector-screen', 'choose-value', this.props.translation)
        }
    }

    setWidthOfFlatList() {
        this.width = Math.round(Dimensions.get('window').width);
    }

    keyExtractor = (item, index) => '' + index;

    generateLine(item) {
        return (<View style={{flexDirection: 'row'}}>
            <TouchableWithoutFeedback key={'vw' + item.value} onPress={() => {
                this.props.press(this.props.field, item);
            }}><View style={[styles.row]}><Text
                style={styles.lineTitle}>{item.label}</Text></View></TouchableWithoutFeedback>
        </View>)
    }

    render() {
        if (this.props.show) {
            this.setWidthOfFlatList();
            return (<View style={styles.container}>
                <View style={styles.header}>
                    <Text style={[styles.txt]} onPress={() => {
                        this.props.press(this.props.field, null);
                    }}>{this.translation.chooseValue}</Text>
                    <AntDesign name={'close'} style={[styles.icon]} onPress={() => {
                        this.props.press(this.props.field, null);
                    }}/>
                </View>
                <ScrollView horizontal style={{flex: 1, width: '100%'}}
                            directionalLockEnabled={false}
                            contentContainerStyle={{width: this.width}}
                            scrollEnabled={true}>
                    <View style={{flexDirection: 'column', width: '100%'}}>
                        <FlatList
                            data={this.props.data}
                            keyExtractor={this.keyExtractor}
                            renderItem={({item}) => (this.generateLine(item))}
                        />
                    </View>
                </ScrollView>
            </View>);
        } else {
            return false;
        }
    }
}

const styles = StyleSheet.create({
    tables: {},
    container: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#fff', zIndex: 10000, flex: 1, width: '100%'
    },
    header: {
        height: 40,
        borderBottomWidth: 0.5,
        borderColor: '#49627f',
        backgroundColor: '#6c88b0'
    },
    row: {
        padding: 10,
        borderBottomWidth: 1,
        width: '100%',
        borderColor: '#ccc',
        flexDirection: 'row'
    },
    scrollView: {
        backgroundColor: 'red',

    },
    txtHeader: {
        textAlign: 'center', color: '#fff'
    },
    noElement: {
        padding: 10,
        fontSize: 18,
        textAlign: 'center'
    },
    headerRow: {
        padding: 10,
        backgroundColor: '#6c88b0',
        borderBottomWidth: 1,
        borderColor: '#49627f',
    },
    borderLeftHeader: {
        borderLeftWidth: 1,
        borderColor: '#49627f',
    },
    borderLeft: {
        borderLeftWidth: 1,
        borderColor: '#ccc',
    },
    textInput: {
        borderColor: '#eee',
        borderWidth: 1,
        backgroundColor: '#fff'
    },
    headerTitle: {
        color: '#fff'
    },
    lineTitle: {
        color: '#6d88b0'
    },
    icon: {
        marginTop: 5,
        width: 40,
        height: 40,
        fontSize: 18,
        paddingTop: 5, textAlign: 'center',
        alignContent: 'center', color: '#fff',
        position: 'absolute',
        top: 0, right: 0, bottom: 0,

    },
    txt: {
        paddingTop: 10,
        height: 40,
        flex: 2,
        textAlign: 'center',
        borderColor: '#FF0000',
        fontSize: 15, color: '#fff'

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
export default connect(mapStateToProps, mapDispatchToProps)(SelectorScreen)
