export const dropQuery = 'drop table if exists afm_flds;';
export const createAfmFldsTableQuery = 'create table if not exists afm_flds (nbblocrecord text,nbrecord text, table_name text, title text,  field_name text, primary_key text, data_type text, dflt_val text, enum_list text, ml_heading text, ref_table text, dep_cols text, role text, restriction text, required text, readonly text, scantofld text, display_order text,validate_data text)';
export const createParamTableQuery = 'create table if not exists param_table (param_name text, param_value text, description text)';


export const CREATE_AFM_FLDS_STRUCT = 'create table if not exists afm_flds (afm_module INTEGER,afm_size INTEGER,afm_type INTEGER,allow_null INTEGER,comments TEXT,data_type INTEGER,decimals INTEGER,dflt_val TEXT,display_order INTEGER,enum_list TEXT,field_name TEXT,is_atxt INTEGER,is_tc_traceable INTEGER,ml_heading TEXT,nbblocrecord INTEGER,nbrecord INTEGER,num_format INTEGER,primary_key INTEGER,readonly TEXT,required TEXT,role TEXT,scantofld TEXT,string_format INTEGER,survey_type_id TEXT,table_name TEXT,title TEXT,transfer_status TEXT,validate_data INTEGER)';
export const CREATE_PARAM_TABLE_STRUCT = 'create table if not exists param_table (param_name text, param_value text, description text)';
export const SELECT_PARAM_TABLE = 'select * from param_table';
export const SELECT_TABLE_DEF = 'select table_name, title, role,nbblocrecord,nbrecord  from afm_flds  group by table_name,title,role';
export const CREATE_LOGIN_TABLE = 'create table if not exists login (username text, password text)';
export const DELETE_STRUCT_DATA = 'delete from afm_flds';
export const CREATE_TABLE_FROM_AFM_FLDS = 'select distinct table_name from afm_flds where table_name <> "afm_flds"';
export const RETRIEVE_STRUCT_TABLE = 'select * from afm_flds where table_name like ? order by primary_key asc';

export const CREATE_TRANSLATION_TABLE = 'create table if not exists translation (lang_id text, row_num number, screen_id text, text_id text,text_title text,text_type text)';
export const SELECT_TRANSLATION_TABLE = 'select lang_id, row_num , screen_id , text_id ,text_title ,text_type from translation';
