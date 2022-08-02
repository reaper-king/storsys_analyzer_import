import XLSX from 'xlsx';
import { loadResult } from '../index.js';
import fs from 'fs'

export const xls = (file)=>{
var workbook = XLSX.readFile(`./share/${file}`);
var sheet_name_list = workbook.SheetNames;
var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
if(xlData[0]['System Name'].includes('Alinity')){

fs.rename(`./share/${file}`, `./share/processing/${file}`, function (err) {
    if (err){ console.log(err.message)}
    })

xlData = xlData.map(dt =>{
return { labno: dt['Sample ID'],test : dt['Assay Name'],test : dt['Assay Name'],test_id : dt['Assay Number'],result : dt['Result'], result_value : Number(dt['Result'].split(' ')[0]) , uom :dt['Result'].split(' ')[1]   , date_completed : dt['Date of Completion'].replaceAll('.','/')  }
})


xlData.forEach( (d,indx)=>{
 loadResult(d.labno,d.test,d.result_value,file,xlData.length,indx+1)
   
})}
}