import React from 'react';
import {StyleSheet, Text, Dimensions, View, ScrollView, TextInput, FlatList} from "react-native";
import {connect} from "react-redux";
import {setCurrentDataToProps} from "../../api/data";
import {asyncRetrieveAssetsLimit} from "../../api/assets";
import {SURV_PREFIX} from "../../../constante";

class TableList extends React.Component {
    width = Math.round(Dimensions.get('window').width);
    title = '';
    nbItems = 0;
    sizeCell = 150;
    changing = false;

    constructor(props) {
        super(props);
        this.state = {
            firstLoad: false,
            currentPage: 0,
            filters: {}
        };

    }

    setWidthOfFlatList() {
        this.nbItems = Object.keys(this.props.database.currentData[0]).length;
        let screenWidth = Math.round(Dimensions.get('window').width);
        if (screenWidth / this.nbItems > 150) {
            this.width = Math.round(Dimensions.get('window').width);
            this.sizeCell = this.width / this.nbItems;
        } else {
            this.width = this.nbItems * this.sizeCell;
        }
    }

    getTitle() {
        let elem = this.props.database.tables.filter((e) => {
            return e.table_name === this.props.database.currentTable
        });
        if (elem.length) {
            elem = elem[0];
            this.title = ((this.props.database.currentData.length > elem.nb_element) ? elem.nb_element : this.props.database.currentData.length) + '/' + elem.nb_element + ' ' + elem.title + ' (' + elem.table_name + ')';
        } else {
            this.title = '';
        }

        return this.title;
    }

    createFilter() {
        let filterString = "";
        Object.keys(this.state.filters).map((key, ind) => {
            let value = this.state.filters[key];
            if (value.length > 0) filterString += " upper(" + key + ") like '" + value.toUpperCase() + "%' AND";
        });
        filterString = filterString.slice(0, -3);
        return filterString;
    }

    initLoading() {
        if (!this.props.database.firstLoadData) {
            this.loadData(false).then(res => {
            })
        }
    }

    async loadData(reset) {
        let stringFilter = await this.createFilter();
        let elem = this.props.database.tables.find((e) => {
            return e.table_name === this.props.database.currentTable
        });
        if (!reset) {
            if (this.changing) {
                reset = true;
                this.changing = false;
            }
        }
        let nbPage = (elem) ? Math.ceil(elem.nb_element / 20) : 0;

        if (reset || this.props.database.currentPage < nbPage) {
            await asyncRetrieveAssetsLimit(this.props.database.db, this.props.database.currentTable, null, null, (reset) ? 0 : this.props.database.currentPage, 20, stringFilter).then(res => {
                this.props.setCurrentData(this.props.database, res, this.props.database.currentPage + 1, reset);
            });
        }
        return true;
    }

    onChangeText(field_name, input) {
        let filters = this.state.filters;
        if (filters.hasOwnProperty(field_name)) {
            filters[field_name] = input;
        } else {
            filters[field_name] = input;
        }
        this.setState({filters: filters});
        this.changing = true;
        this.loadData(true);

    }

    search(field_name, input) {
        this.loadData(true);
    }

    Header() {
        let style;
        return (
            <View style={{width: this.width, flexDirection: 'row'}}>
                {
                    this.props.database.currentHeader.fields.map((item, i) => {
                        style = (i === 0) ? [styles.headerRow, {width: this.sizeCell}] : [styles.headerRow, {width: this.sizeCell}, styles.borderLeft];
                        return <View key={'vw' + i} style={style}>
                            <Text
                                style={styles.headerTitle}>{item.ml_heading.replace(/\n|\r|(\n\r)/g, ' ').toUpperCase()}</Text>
                            <TextInput style={styles.textInput}
                                       onEndEditing={(input) => {
                                           this.search(item.field_name, input)
                                       }}
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
                this.props.database.currentHeader.fields.map((header, i) => {
                    let style = (i === 0) ? [styles.row, {width: this.sizeCell}] : [styles.row, {
                        background: 'blue',
                        width: this.sizeCell
                    }, styles.borderLeft];
                    return <View key={'vw' + i} style={style}><Text
                        style={styles.headerTitle}>{item[header.field_name]}</Text></View>
                })
            }
        </View>)
    }

    render() {
        if (this.props.etat.chooseTable) {
            this.initLoading();
            if (this.props.database.currentData.length) {
                this.setWidthOfFlatList();
                return (
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <Text style={styles.txtHeader}>{this.getTitle().toUpperCase()} </Text>
                        </View>
                        <ScrollView horizontal style={{flex: 1}}
                                    directionalLockEnabled={false}
                                    contentContainerStyle={{width: this.width}}
                                    scrollEnabled={true}
                        >
                            <View style={{flexDirection: 'column', width: '100%'}}>
                                {this.Header()}
                                <FlatList
                                    data={this.props.database.currentData}
                                    keyExtractor={this.keyExtractor}
                                    renderItem={({item}) => (this.generateLine(item))}
                                    onEndReached={() => {
                                        this.loadData(false)
                                    }}
                                />
                            </View>
                        </ScrollView>
                    </View>
                )
            } else {
                return (
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <Text style={styles.txtHeader}>{this.getTitle().toUpperCase()} </Text>
                        </View>

                        <ScrollView horizontal style={{flex: 1}}
                                    directionalLockEnabled={false}
                                    contentContainerStyle={{width: this.width}}
                                    scrollEnabled={true}
                        >
                            <View style={{flexDirection: 'column', width: '100%'}}>
                                {this.Header()}
                                <Text
                                    style={styles.noElement}>{'No data for ' + this.props.database.currentTable} </Text>
                            </View>
                        </ScrollView>
                    </View>
                )
            }
        } else {
            return false;
        }
    };
}

const styles = StyleSheet.create({
    row: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        flexDirection: 'row'
    },
    scrollView: {
        backgroundColor: 'red',

    },
    header: {
        backgroundColor: '#6c88b0',

        width: '100%', padding: 10
    },
    txtHeader: {
        textAlign: 'center', color: '#fff'
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        width: '100%'
    },
    noElement: {
        padding: 10,
        fontSize: 18,
        textAlign: 'center'
    },
    headerRow: {
        padding: 10,
        backgroundColor: '#eee',
        borderBottomWidth: 1,
        borderColor: '#ccc',
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
        color: '#6d88b0'
    }

});
const mapStateToProps = (state) => {
    return {
        database: state.localDatabase
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        setCurrentData: async (state, currentData, currentPage, reset) => {
            return await dispatch(setCurrentDataToProps(dispatch, state, currentData, currentPage, reset))
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(TableList)
