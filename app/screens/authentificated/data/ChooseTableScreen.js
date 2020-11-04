import React from 'react';
import {FlatList, Text, TouchableWithoutFeedback, View,StyleSheet,SafeAreaView, ScrollView} from 'react-native';
import {connect, Provider} from 'react-redux'
import {AntDesign} from "@expo/vector-icons";

class ChooseTableScreen extends React.Component {
    constructor(props){
        super(props);

        this.state= {list:this.setList()};
        //this.setList();
    }
    press(value) {
        this.props.press(value);
    }
    refresh(){
        if(this.props.database.tables.length ===0){
            this.props.retrieveTables(this.props.database.db,this.props.database).then(res=>{
                this.setState({list:this.setList()});
            });
        }else{
            this.setState({list:this.setList()});
        }
    }
    setList(){
        let list=[];
        for(let i=0;i<this.props.database.tables.length;i++){
            if(this.props.database.tables[i].table_name !=='afm_flds'){
            let title = (this.props.database.tables[i].table_name ==='afm_flds')?
                    'afm_flds':this.props.database.tables[i].title;
            title+= (this.props.database.tables[i].table_name ==='afm_flds')?'':' ('+this.props.database.tables[i].table_name+')';
            title+= ' '+this.props.database.tables[i].nb_element+' ';
            title+= (this.props.database.tables[i].nb_element > 1) ? ' elements': ' element';
            list.push({key:this.props.database.tables[i].table_name,text:title});

            }
        }
        return list;

    }
    render() {
        if(this.state.list.length >0){
            return (
                <TouchableWithoutFeedback  >
                            <View style={styles.container}>
                                <View style={styles.header} >
                                    <Text style={[styles.txt]} onPress={() => this.press(false)}>CHOOSE TABLE</Text>
                                    <AntDesign name={'close'} style={[styles.icon]} onPress={() => this.press(false)}/>
                                </View>
                                    <FlatList
                                        data={this.state.list}
                                        renderItem={({item}) => <Text style={styles.item} onPress={() => this.press(item.key)}>{item.text.toUpperCase()}</Text>}
                                    />
                            </View>
                </TouchableWithoutFeedback >
            )

        }else{
            return (
                <TouchableWithoutFeedback  >
                    <View style={styles.container}>
                        <View style={styles.header} >
                            <Text style={[styles.txt]} onPress={() => this.press(false)}>CHOOSE TABLE</Text>
                            <AntDesign name={'close'} style={[styles.icon]} onPress={() => this.press(false)}/>
                        </View>
                        <Text style={styles.item} onPress={()=>{this.refresh()}}>Aucune table, cliquez ici pour raffraichir la liste</Text>
                    </View>
                </TouchableWithoutFeedback >
            )
        }
    };
}
const styles = StyleSheet.create({

    container:{
        flex:1,
        width:'100%',
    },
    header: {
        paddingTop:20,
        flexDirection: 'row',
        height:70,
        alignItems:'center',
        borderBottomWidth:1,
        backgroundColor:'#6c88b0',
    },
    txt:{
      flex:2,
        textAlign:'center',
        paddingLeft:10,
        fontSize:15,color:'#fff'

    },
    icon:{
        marginTop:5,
        width:45,
        height:45,
        fontSize:25,
        paddingTop:8,textAlign:'center',
        alignContent:'center',color:'#fff'
    },
    item:{
        height:45,
        borderBottomWidth:1,
        lineHeight:45,
        paddingLeft:10,
        borderColor:'#ddd',
        color:'#6c88b0'
    }
});
const mapStateToProps = (state) => {
    return {
        database : state.localDatabase
    };
};
export default connect(mapStateToProps)(ChooseTableScreen)