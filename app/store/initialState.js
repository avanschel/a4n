export const initialState = {
    progress: {
        cat: '',
        error: false,
        errorMessage: '',
        loading: false,
        text: '',
        percent: 0
    },
    database: {
        initialized: false,
        archibus: false,
        tables: [],
        firstLoadData: false,
        currentTable: null,
        currentData: [],
        currentHeader: {fields: []},
        currentPage: 0,
        dbName: 'A4N_db.db',
        db: null,
        error: {error: false, title: 'Database error', message: 'An error occured while tryin to create data.'},
        loading: {loading: false, message: null}
    },
    user: {
        logged: false,
        error: {error: false, title: 'Login error', message: 'An error occured while tryin to connect.'},
        loading: {loading: false, message: null},
        username: null,
        password: null,
        server: 'https://macif.aremis.com/archibus', //'http://192.168.1',
        initialized: false
    },
    scan: {
        loading: true,
        error: false,
        text: '',
        container: {bl_id: '', fl_id: '', rm_id: ''},
        code: null,
        founded: false,
        status: false,
        data: {},
        defFields: [],
        survey: {},
        canScan: true
    }
}
