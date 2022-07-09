import fs from 'fs';
import pool from "./db/pool.js";
import {  listFiles } from "./utilities/file_reader.js";

let analyzer = process.env.ANALYZER
let loadStatus = []


export const loadResult = async  ( sample_id, test, result, filename , recCount, indexx )=> {


        // if(result.includes('(log')){

        //   return  convertExpo(result).split('IU')[0]
        // }
        
        if(result.includes('(log')){
            result =   convertExpo(result).split('IU')[0]
        }
        sample_id = sample_id.substring(0,20)

    const archiveFiles = () => { if(recCount == indexx){

        if(loadStatus[`${filename}`].includes('bad')){

            fs.rename(`./share/${filename}`, `./share/issue/${filename}`, function (err) {
                if (err) throw err
                console.log( 'File stored under issue folder : '+filename)
              })

        }
        else{

            fs.rename(`./share/${filename}`, `./share/archive/${filename}`, function (err) {
                if (err) throw err
                console.log('File stored under issue folder : '+filename)
              })

        }
        

    } }


    let pushData = await pool.query(`select  clinlims.data_import('${analyzer}','${sample_id}','${test}','${result}')` )
    let dataStatus = await pushData.rows[0].data_import
    console.log(dataStatus + ' : '+filename)
    if(dataStatus == 'ok'){
        if (loadStatus[`${filename}`] == undefined){
            loadStatus[`${filename}`] = []
            loadStatus[`${filename}`].push('bad')
            archiveFiles()
        }else {
            loadStatus[`${filename}`].push('good')
            archiveFiles()
        }
    }
    else {
        if (loadStatus[`${filename}`] == undefined){
            loadStatus[`${filename}`] = []
            loadStatus[`${filename}`].push('bad')
            archiveFiles()
        }else {
            loadStatus[`${filename}`].push('bad')
            archiveFiles()
        }
    }
 
  

}


setInterval( 
   ()=>{

listFiles()
}
    
    ,10000)

    listFiles()

    function convertExpo(val) {

        return val.split(' ').map(d=> {let e = Number(d) > 0 ? Number(d) : d ; return e  } ).join(' ')
     
     }