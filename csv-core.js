(function(root,factory){
  const api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.InvoiceGuardCSV=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";

  function stripBom(text){
    text=String(text??"");
    return text.charCodeAt(0)===0xFEFF?text.slice(1):text;
  }

  function parseRecords(text,delimiter){
    text=stripBom(text);
    const rows=[];
    let row=[],field="",quoted=false,fieldQuoted=false,line=1,rowStart=1;
    for(let i=0;i<text.length;i++){
      const c=text[i];
      if(quoted){
        if(c==='"'){
          if(text[i+1]==='"'){field+='"';i++;}
          else quoted=false;
        }else{
          if(c==='\n')line++;
          field+=c;
        }
        continue;
      }
      if(c==='"'&&field.length===0){quoted=true;fieldQuoted=true;continue;}
      if(c===delimiter){row.push(fieldQuoted?field:field.trim());field="";fieldQuoted=false;continue;}
      if(c==='\r'||c==='\n'){
        row.push(fieldQuoted?field:field.trim());
        if(row.some(v=>v!==""))rows.push({cells:row,line:rowStart});
        row=[];field="";fieldQuoted=false;
        if(c==='\r'&&text[i+1]==='\n')i++;
        line++;rowStart=line;continue;
      }
      field+=c;
    }
    if(quoted){
      const err=new Error("Unclosed quoted field starting near line "+rowStart);
      err.code="UNCLOSED_QUOTE";err.line=rowStart;throw err;
    }
    row.push(fieldQuoted?field:field.trim());
    if(row.some(v=>v!==""))rows.push({cells:row,line:rowStart});
    return rows;
  }

  function scoreDelimiter(text,delimiter){
    try{
      const rows=parseRecords(text,delimiter).slice(0,12);
      if(!rows.length)return -Infinity;
      const widths=rows.map(r=>r.cells.length);
      const freq=new Map();
      widths.forEach(w=>freq.set(w,(freq.get(w)||0)+1));
      let mode=1,count=0;
      for(const [w,n] of freq)if(n>count||(n===count&&w>mode)){mode=w;count=n;}
      if(mode<2)return -1000;
      return count*100+mode*5-widths.reduce((a,w)=>a+Math.abs(w-mode),0)*20;
    }catch{return -Infinity;}
  }

  function detectDelimiter(text){
    text=stripBom(text);
    const candidates=[",",";","\t"];
    let best=",",bestScore=-Infinity;
    for(const delimiter of candidates){
      const score=scoreDelimiter(text,delimiter);
      if(score>bestScore){best=delimiter;bestScore=score;}
    }
    return best;
  }

  function parse(text,options={}){
    text=stripBom(text);
    if(!text.trim())return {delimiter:options.delimiter||",",header:[],rows:[]};
    const delimiter=options.delimiter||detectDelimiter(text);
    const records=parseRecords(text,delimiter);
    if(!records.length)return {delimiter,header:[],rows:[]};
    const header=records[0].cells;
    if(!header.length||header.every(v=>!v)){
      const err=new Error("CSV header is empty");err.code="EMPTY_HEADER";throw err;
    }
    const width=header.length;
    const rows=[];
    for(const record of records.slice(1)){
      if(record.cells.length!==width){
        const err=new Error("Row "+record.line+" has "+record.cells.length+" columns; expected "+width);
        err.code="ROW_WIDTH_MISMATCH";err.line=record.line;err.expected=width;err.actual=record.cells.length;throw err;
      }
      rows.push({cells:record.cells,line:record.line});
    }
    return {delimiter,header,rows};
  }

  return {stripBom,parseRecords,detectDelimiter,parse};
});
