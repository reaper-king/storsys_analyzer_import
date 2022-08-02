import fs from 'fs';
import { xls } from './xls_reader.js';
import { loadResult } from '../index.js';
import { abottFileImport } from './abott.js';
import path from 'path';

var dirPath = path.resolve('./share/'); // path to your directory goes here

function counts(string, word) {
  return string.split(word).length - 1;
}


export  function listFiles(){
  
    fs.readdir(dirPath,  function(err, files){
        var filesList =   files.filter(function(e){
    return path.extname(e).toLowerCase() === '.p01' ||path.extname(e).toLowerCase() === '.xls' || path.extname(e).toLowerCase() === '.xlsx' ||path.extname(e).toLowerCase() === '.txt' || path.extname(e).toLowerCase() === '.csv'
  });
  if(filesList.length > 0){
    translateFile(filesList)
  }
        })
};


function convertExpo(val) {

   return val.split(' ').map(d=> {let e = Number(d) > 0 ? Number(d) : d ; return e  } ).join(' ')

}




export const translateFile = (fileList) =>{
   




    
    fileList.forEach( file => {
    

    try {
      if(file.includes('.xls')){
          xls(file)

      }
      
     else  if(file.includes('.P01')){
        abottFileImport(file)

    }
else
{
fs.readFile(`${dirPath}/${file}`, 'ascii', (err, data) => {
  let king = {data:""}  
    if (err) {
      console.error(err.message);
      return;
    }
     data = data.replace(/[\u0000]+/g,'')
        
    let recCount = (data.match(/RESULT TABLE/g) || []).length 
    if(recCount > 0 ){
      fs.rename(`./share/${file}`, `./share/processing/${file}`, function (err) {
          if (err){ console.log(err.message)}
          })

        try {
          let datas = data.split("RESULT TABLE")
          let filtered = datas.filter(d => d.includes('Test Disclaimer'))
    
    
          let filtered2 = [ filtered.map(d=>{
            return ( '{'+ d.substring(
                1, 
                d.lastIndexOf("Test Disclaimer"))
                .replace(/"/g,'')
                .replace('Sample ID,','"Sample ID":"')
                .replace('Patient ID,','"Patient ID":"')
                .replace('Assay,','"Test Name":"')
                .replace('Assay Version,','"Assay Version":"')
                .replace('Assay Type,','"Assay Type":"')
                .replace('Test Type,','"Test Type":"')
                .replace('Sample Type,','"Sample Type":"')
                .replace('Sample Type\r','"Sample Type":"\r')
                .replace('Notes,','"Notes":"')
                .replace('Notes\r','"Notes":"\r')
                .replace('Test Result,','"Test Result":"')
                .replace(/\r/g,'",')
                .slice(0,-2)
                         +'}' )
             })]

            
       let Jsoned =   JSON.parse('['+(filtered2)+']')
       Jsoned.forEach((data,i)=>{


        loadResult(data['Sample ID'] , data['Test Name'], data['Test Result'],file , Jsoned.length , i+1 )

      }


       )

             } catch (error) {
                            
            fs.rename(`./share/processing/${file}`, `./share/errored/${file}`, function (err) {
              if (err) throw err
              console.log(error.message + '\nFile stored under errored folder : '+file)
            })

 
        }

  }

  } );
}
    } catch (error) {
      
            fs.rename(`./share/${file}`, `./share/errored/${file}`, function (err) {
              if (err) throw err
              console.log(error.message + '\nFile stored under errored folder : '+file)
            })

      
    }
    
  });
    }