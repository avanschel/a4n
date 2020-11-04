import React from 'react';
import { StyleSheet, View } from 'react-native';
import {connect} from 'react-redux'
import { retrieveListOfTable, setTheCurrentHeaderToProps} from "../../../api/data";
import LoadingScreen from "../../LoadingScreen";
import SimpleTextButton from "../../../components/graphics/simpleTextButton";
import TableList from "../../../components/graphics/tableList";
import ChooseTableScreen from "./ChooseTableScreen";
import {asyncRetrieveAssetsById} from "../../../api/assets";
import {retrieveFields} from "../../../api/tableDef";
import {SURV_PREFIX} from "../../../../constante";

class DataScreen extends React.Component {
    constructor(props){
        super(props);
        this.state= {
            openMenu:false,
            loading:true,
            loadingMessage:'Retrieving list of table',
            chooseTable:false,
            listTable:[],
            currentTable:false
        }
        if(this.props.database.tables.length ===0){
            this.props.retrieveTables(this.props.database.db,this.props.database).then(res=>{
                this.setState({loading:false});
            });
        }
    }
    openChoose(){
        this.setState({openMenu:true});
    }
    closeChoose(value){
        if(value && value!== this.props.database.currentTable){
            asyncRetrieveAssetsById(this.props.database.db,"afm_flds","table_name",value.replace(SURV_PREFIX,''), "display_order asc").then(result=>{
                let currentHeader = retrieveFields(value,result);
                this.props.setCurrentHeader(this.props.database,value,currentHeader).then(res=>{
                    this.setState({openMenu:false,currentTable:value,chooseTable:true});
                });
            });
        }else{
            this.setState({openMenu:false});
        }
    }
    render(){

        if(this.props.database.tables.length ===0){
            this.props.retrieveTables(this.props.database.db,this.props.database).then(res=>{
                //this.setState({loading:false});
            }).catch(err=>{
            });
        }
        if(this.props.database.tables.loading){
            return (
                <LoadingScreen title={this.state.loadingMessage} message={'please wait'}/>
            )
        }else{
            if(this.state.openMenu){
                return (
                    <View style={styles.container}>
                        <ChooseTableScreen press={(value)=>this.closeChoose(value)}/>
                    </View>
                )
            }else{
                return (
                    <View style={styles.container}>
                        <View style = {(this.state.currentTable)?styles.wrapper:styles.wrapperBlank}>
                            <SimpleTextButton show ={true}  title={'CHOOSE TABLE'}  press={()=>this.openChoose()} style={(this.state.currentTable)?styles.btnBordered:styles.btn}/>
                        </View>
                        <TableList etat={this.state} />
                    </View>
                )
            }
        }
    };
}

const styles = StyleSheet.create({
    wrapper:{
        backgroundColor:'#6c88b0',
        width:'100%'
    },
    wrapperBlank:{
        width:'100%'
    },
    btn:{
        width:'90%',marginTop:10,height:40,
    },
    btnBordered:{
        width:'90%',marginTop:10,height:40,
        borderWidth:1,
        borderColor:'#49627f',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
});
const mapStateToProps = (state) => {
    return {
        database : state.localDatabase
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        retrieveTables: async (db,state) => {return await dispatch(retrieveListOfTable(db,dispatch,state))},
        setCurrentHeader: async (state,tableName,currentHeader)=> {return await dispatch(setTheCurrentHeaderToProps(dispatch,state,tableName,currentHeader))}
    };
};
export default connect(mapStateToProps,mapDispatchToProps)(DataScreen)