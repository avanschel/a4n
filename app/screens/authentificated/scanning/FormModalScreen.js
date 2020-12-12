import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    ScrollView,
    FlatList,
    TouchableWithoutFeedback,
    TextInput
} from 'react-native';
import {connect} from 'react-redux';
import {AntDesign} from "@expo/vector-icons";

class FormModalScreen extends React.Component {
    header = [];
    width = Math.round(Dimensions.get('window').width);
    title = '';
    nbItems = 0;
    sizeCell = 150;
    // for filtering
    filteredData;
    needToReload = true;
    table = null;

    constructor(props) {
        super(props);
        this.state = {
            filters: {}
        }
    }

    setWidthOfFlatList() {
        let screenWidth = Math.round(Dimensions.get('window').width);
        if (screenWidth / this.nbItems > 150) {
            this.width = Math.round(Dimensions.get('window').width);
            this.sizeCell = this.width / this.nbItems;
        } else {
            this.width = this.nbItems * this.sizeCell;
        }
    }

    Header() {
        let header;
        switch (this.props.table) {
            case 'bl':
                this.header = [{ml_heading: 'Code bât', field_name: 'bl_id'}, {ml_heading: 'Nom', field_name: 'name'}];
                this.nbItems = 2;
                break;

            case 'fl':
                this.header = [{ml_heading: 'Code bât', field_name: 'bl_id'}, {
                    ml_heading: 'Code étage',
                    field_name: 'fl_id'
                }];
                this.nbItems = 2;
                break;

            case 'rm':
                this.header = [{ml_heading: 'Code bât', field_name: 'bl_id'}, {
                    ml_heading: 'Code étage',
                    field_name: 'fl_id'
                }, {ml_heading: 'Code local', field_name: 'rm_id'}];
                this.nbItems = 3;
                break;
            case 'fnstd':
                this.header = [{ml_heading: 'Code Standard', field_name: 'fn_std'}, {
                    ml_heading: 'Standard',
                    field_name: 'description'
                }];
                this.nbItems = 2;
                break;
            case 'eqstd':
                this.header = [{ml_heading: 'Code Standard', field_name: 'eq_std'}, {
                    ml_heading: 'Standard',
                    field_name: 'description'
                }];
                this.nbItems = 2;
                break;
            default:
                header = [];
                this.nbItems = 0;

        }
        this.setWidthOfFlatList();
    }

    renderHeader() {
        let style;
        return (
            <View style={{width: this.width, flexDirection: 'row'}}>
                {
                    this.header.map((item, i) => {
                        style = (i === 0) ? [styles.headerRow, {width: this.sizeCell}] : [styles.headerRow, {width: this.sizeCell}, styles.borderLeftHeader];
                        return <View key={'vw' + i} style={style}>
                            <Text style={styles.headerTitle}>{item.ml_heading.toUpperCase()}</Text>
                            <TextInput style={styles.textInputHeader}
                                       onChangeText={(input) => {
                                           this.onChangeText(item.field_name, input)
                                       }}>
                            </TextInput>
                        </View>
                    })
                }
            </View>
        )
    }

    keyExtractor = (item, index) => '' + index;

    generateLine(item) {
        return (<View style={{flexDirection: 'row'}}>
            {
                this.header.map((header, i) => {
                    let style = (i === 0) ? [styles.row, {width: this.sizeCell}] : [styles.row, {
                        background: 'blue',
                        width: this.sizeCell
                    }, styles.borderLeft];
                    return <TouchableWithoutFeedback key={'vw' + i} onPress={() => {
                        this.chooseLine(item);
                    }}><View style={style}><Text
                        style={styles.lineTitle}>{item[header.field_name]}</Text></View></TouchableWithoutFeedback>
                })
            }
        </View>)
    }

    // search part

    onChangeText(field_name, input) {
        let filters = this.state.filters;
        if (filters.hasOwnProperty(field_name)) {
            filters[field_name] = input;
        } else {
            filters[field_name] = input;
        }
        this.setState({filters: filters});
        this.filterData();

    }

    filterData() {
        this.filteredData = this.props.data;
        Object.keys(this.state.filters).map((key, ind) => {
            let value = this.state.filters[key];
            value = (value && value.length) ? value.toUpperCase() : value;
            this.filteredData = this.filteredData.filter(f => (f[key] && f[key].toUpperCase()).startsWith(value))
        })
        return true;
    }

    reload() {
        if (this.needToReload) {
            this.needToReload = false;
            this.filteredData = this.props.data;
        }
    }
    chooseLine(item){
        this.setState({filters: {}});
        this.needToReload = true;
        this.props.press(this.props.table, item);
    }
    close() {
        this.setState({filters: {}});
        this.needToReload = true;
        this.props.press(this.props.table, 'title');
    }

    render() {
        if (this.props.show) {
            this.Header();
            this.reload();
            return (
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={[styles.txt]} onPress={() => {
                            this.props.press(this.props.table, 'title');
                        }}>{this.props.title.toUpperCase()}</Text>
                        <AntDesign name={'close'} style={[styles.icon]} onPress={() => {
                           this.close()
                        }}/>
                    </View>
                    <ScrollView horizontal style={{flex: 1}}
                                directionalLockEnabled={false}
                                contentContainerStyle={{width: this.width}}
                                scrollEnabled={true}>
                        <View style={{flexDirection: 'column', width: '100%'}}>
                            {this.renderHeader()}
                            <FlatList
                                data={this.filteredData}
                                keyExtractor={this.keyExtractor}
                                renderItem={({item}) => (this.generateLine(item))}
                            />
                        </View>
                    </ScrollView>
                </View>)
        } else {
            return false;
        }
    };
}

const styles = StyleSheet.create({
    tables: {},
    container: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#fff', zIndex: 10000, flex: 1, width: '100%'
    },
    header: {
        flexDirection: 'row',
        textAlign: 'center',
        height: 40,
        borderBottomWidth: 0.5,
        borderColor: '#49627f',
        backgroundColor: '#6c88b0', color: '#fff'
    },
    row: {
        padding: 10,
        borderBottomWidth: 1,
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
        alignContent: 'center', color: '#fff'
    },
    textInputHeader: {
        borderColor: '#eee',
        borderWidth: 1,
        backgroundColor: '#fff'
    },
    txt: {
        padding: 10,
        flex: 2,
        textAlign: 'center',
        paddingLeft: 10,
        fontSize: 15, color: '#fff'

    },
});
const mapStateToProps = (state) => {
    return {
        scanStatus: state.scanStatus,
        database: state.localDatabase
    };
};
const mapDispatchToProps = (dispatch) => {
    return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(FormModalScreen)
