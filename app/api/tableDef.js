/** Returns a JSON definition afm_flds based of a table passed as parameter
 table_name,field_name, primary_key, data_type, dflt_val, ENUM_LIST, ml_heading, ref_table, dep_cols*/
export const afmFldsFieldDefs = {
    fields:[
        {field_name:'validate_data', 	primary_key:0,},
        {field_name:'table_name', 	primary_key:1,},
        {field_name:'field_name', 	primary_key:2,},
        {field_name:'title',		primary_key:0,},
        {field_name:'primary_key',	primary_key:0,},
        {field_name:'data_type',	primary_key:0,},
        {field_name:'dflt_val',		primary_key:0,},
        {field_name:'enum_list',	primary_key:0,},
        {field_name:'ml_heading',	primary_key:0,},
        {field_name:'ref_table',	primary_key:0,}	,
        {field_name:'dep_cols',		primary_key:0,},
        {field_name:'nbblocrecord',	primary_key:0,},
        {field_name:'nbrecord', 	primary_key:0,},
        {field_name:'role',			primary_key:0,},
        {field_name:'restriction',	primary_key:0,},
        {field_name:'readonly',		primary_key:0,},
        {field_name:'required',		primary_key:0,},
        {field_name:'scantofld',	primary_key:0,},
        {field_name:'display_order',primary_key:0,}
    ]
};


export  function retrieveFields(defName,objRes){
    var res;
    if(defName==="afm_flds"){
        res= {fields:[
                {field_name:'table_name', 	primary_key:1,},
                {field_name:'field_name', 	primary_key:2,},
                {field_name:'title',		primary_key:0,},
                {field_name:'primary_key',	primary_key:0,},
                {field_name:'data_type',	primary_key:0,},
                {field_name:'dflt_val',		primary_key:0,},
                {field_name:'enum_list',	primary_key:0,},
                {field_name:'ml_heading',	primary_key:0,},
                {field_name:'ref_table',	primary_key:0,}	,
                {field_name:'dep_cols',		primary_key:0,},
                {field_name:'nbrecord',	    primary_key:0,},
                {field_name:'nbblocrecord',	primary_key:0,},
                {field_name:'role',			primary_key:0,},
                {field_name:'restriction',	primary_key:0,},
                {field_name:'readonly',		primary_key:0,},
                {field_name:'required',		primary_key:0,},
                {field_name:'scantofld',	primary_key:0,},
                {field_name:'display_order',primary_key:0,}
            ]
        }
    }else{
        res = {};
        res.fields = objRes;
    }
    return res;
}

/** Return a JSON array of json table afm_flds style
 - To be defined container.
 */
export function retrieveDefinitionList(){
    return [
        {
            name:'rm',
            dislay:'Room',
            container: true,

        },
        {
            name:'rmstd',
            dislay:'Room std',
            container: false,

        },
        {
            name:'fnstd',
            dislay:'Furn. std',
            container: false,

        },
        {
            name:'bl',
            dislay:'Building',
            container: true,

        },
        {
            name:'fl',
            dislay:'Floor',
            container: true,

        },
        {
            name:'ta',
            dislay:'Tagged Asset',
            form: true,
        },
        {
            name:'eq',
            dislay:'Equipments',
            form: true,
        },
        {
            name:'fn',
            dislay:'fn',
            form: true,

        },

    ]
}
