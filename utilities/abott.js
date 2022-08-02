
import { loadResult } from '../index.js';
import fs from 'fs'


function tsvJSON(tsv){
 
	var lines=tsv.split("\n");
   
	var result = [];
   
	var headers=lines[0].split("\t");
   
	for(var i=1;i<lines.length;i++){
   
		var obj = {};
		var currentline=lines[i].split("\t");
   
		for(var j=0;j<headers.length;j++){
			obj[headers[j]] = currentline[j];
		}
   
		result.push(obj);
   
	}
	
	//return result; //JavaScript object
	return result; //JSON
  }




export const abottFileImport = (file)=>{

    fs.readFile(`./share/${file}`,'utf16le' ,(err, data) => {
        if (err)console.log(err.message);
    
        let convertedData = tsvJSON(data).map(dets=>{
            return { sample_id :dets['SID'], test: dets['ASSAY'] , result: dets['RESULT'], completed: dets['DATE/TIME COMPLETED']}
        })


        
        fs.rename(`./share/${file}`, `./share/processing/${file}`, function (err) {
            if (err){ console.log(err.message)}
            })


            
            convertedData.filter(v=>v.sample_id !== undefined).forEach( (d,indx)=>{
    loadResult(d.sample_id,d.test,d.result,file,convertedData.filter(v=>v.sample_id !== undefined).length,indx+1)
      
   })
    
})

};
