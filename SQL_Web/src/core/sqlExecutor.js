import initSqlJs from 'sql.js';

let SQL;

export const initDB = async(initSql)=>{
    if(!SQL){
        SQL=await initSqlJs({
            locateFile:()=>`/sql-wasm.wasm`,
        });
    }

    const db = new SQL.Database();

    if(initSql){
        db.run(initSql);
    }

    return db;
};

export const runSQL = (db,sql)=>{
    return db.exec(sql);
};
