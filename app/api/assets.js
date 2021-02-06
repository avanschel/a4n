
/* asyncRetrieveAssetsType ====================
============================================= */
import {IMPORT_RETRIEVE_ASSETS_TYPE} from "../store/actions/actions";
import {GET_ASSET_FROM_SERVER} from "./api";

export function asyncRetrieveAssetsType(db){
    return asyncRetrieveAllAssetsType(db,false);

}
/* asyncRetrieveAllAssetsType ==================
============================================= */
export function asyncRetrieveAllAssetsType(db,includeAfmFlds){

    let assets = [];
    let aProm =  new Promise(
        function(resolve,reject){
            db.transaction(tx => {
                //	let query = `select count(1) from  `+tbl;
                let query="";
                if(!includeAfmFlds){
                    query = `select table_name, title, role from afm_flds where table_name not like 'afm_flds'  group by table_name, title, role`;
                }else{
                    //query = "SELECT name as table_name, name as title, null as role FROM sqlite_master WHERE type='table'";
                    query = `select table_name, title, role from afm_flds where table_name not like 'afm_flds' and table_name in (select name from sqlite_master where type='table') group by table_name, title, role 
				UNION ALL SELECT name as table_name, name as title, null as role FROM sqlite_master WHERE type='table' and name not in (select table_name from afm_flds) order by name`;
                }


                tx.executeSql( query   ,  [],
                    (_, { rows: { _array } }) => {
                        for(let i=0; i < _array.length ; i++){
                            let arrayi = _array[i];
                            let obj={};
                            (Object.keys(arrayi)).map((key,i)=>{
                                obj[key]=arrayi[key];
                            });
                            assets.push(obj);
                        }
                        resolve(assets);
                    }
                );
            },(err)=> {});
        }
    )
    return aProm.then((dataParam)=>{
            //Anciennement RETRIEVEASSETSTYPE nouveau
            return {
                type: IMPORT_RETRIEVE_ASSETS_TYPE,
                data : dataParam
            }
        }
    )
}

/* asyncRetrieveAssets ==================
============================================= */
export function asyncRetrieveAssets(db,tbl){
    return asyncRetrieveAssetsById(db,tbl,null,null,null);
}

/* asyncRetrieveAssetsById ==================
============================================= */
export async function asyncRetrieveAssetsById(db,tbl,fld,value,sort){
    return await asyncRetrieveAssetsLimit(db,tbl,fld,value,null,null,null,sort);
}

/* asyncRetrieveAssetsById ==================
============================================= */
export async function asyncRetrieveAssetsByFilter(db,tbl,filter){
    return await asyncRetrieveAssetsLimit(db,tbl,null,null,null,null,filter);
}

export async function asyncRetrieveMlHeading(){}
/* asyncRetrieveAssetsLimit ==================
============================================= */
export function asyncRetrieveAssetsLimit(db,tbl,fld,value,pageNum,pageSize,filters,sort){
    let clause ='';
    if(fld !=null && value !=null){
        clause=" where "+fld+" ='"+value+"' ";
    }else if(filters!=null && filters.length>0){
        clause=" where "+filters;
    }
    let assets = [];
    let limit="";
    if ((pageNum!=null) && (pageSize!=null)){
        limit = " LIMIT "+pageSize+" OFFSET "+(pageNum*pageSize);
    }
    if(sort!=null){
        sort=' order by  '+sort+' ';
    }else{
        sort='';
    }
    let aProm =  new Promise(
        function(resolve,reject){
            db.transaction(tx => {
                //	let query = `select count(1) from  `+tbl;
                let query = `select * from  `+tbl+clause+limit+sort;
                console.log('=====>my query : '+query)
                tx.executeSql( query   ,  [],
                    (_, { rows: { _array } }) => {
                        for(let i=0; i < _array.length ; i++){
                            let arrayi = _array[i];
                            let obj={};
                            (Object.keys(arrayi)).map((key,i)=>{
                                obj[key]=arrayi[key];
                            });
                            assets.push(obj);
                        }
                        resolve(assets);
                    }
                );
            },(err)=>{
                reject({error:true,msg:err});
            });
        }
    );
    return aProm.then((dataParam)=>{
            //console.log(JSON.stringify(dataParam))
            /*return {
                type: IMPORT_RETRIEVE_ASSETS,
                data : dataParam
            }*/
            return dataParam;
        }
    )
}

/* getAssetsFromApiAsync ============================
============================================= */
export async function getAssetsFromApiAsync(server,tbl,blocNb){
    return new Promise((resolve,reject)=>{

        try{
            fetch(server+GET_ASSET_FROM_SERVER+tbl.toUpperCase()+"&paramBloc="+blocNb).then(res=>{
                if(!res.ok){
                    reject(res.statusText);
                }
                let resJson = res.json();

                resJson.tbl = tbl;
                resolve(resJson);
            }).catch(err=>{reject(err);});

        }catch(err){
            reject(err);
        }
    })
}
