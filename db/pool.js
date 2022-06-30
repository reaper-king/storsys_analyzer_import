import dotenv from 'dotenv/config'
import pkg from 'pg';
import fs from 'fs';

var result_mapping = fs.readFileSync('./db/init_scripts/result_mapping.sql').toString();
var analyzer_function = fs.readFileSync('./db/init_scripts/analyzer_function.sql').toString();

const { Pool } = pkg;

let db_conf = {
    "host":`${process.env.HOST}`,
    "port": process.env.PORT,
    "user":`${process.env.USER}`,
    "password" : `${process.env.PASS}`,
    "database" :`${process.env.DB}`
  }

const pool = new Pool(db_conf) 
async function  initDB (){
          try {
            let anf = await pool.query(`${analyzer_function}`)
          } catch (error) {
            console.log(error.message)
          }
          
          try {
          let remap =  await  pool.query(`${result_mapping}`)
          console.log(remap)
          } catch (error) {
            console.log(error.message)
          }
}
initDB()

export default pool;