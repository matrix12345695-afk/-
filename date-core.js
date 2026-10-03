(function(root,factory){
  const api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.InvoiceGuardDateCore=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  'use strict';

  function validYmd(y,m,d){
    const year=Number(y),month=Number(m),day=Number(d);
    if(!Number.isInteger(year)||year<1900||year>9999||month<1||month>12||day<1||day>31)return null;
    const date=new Date(Date.UTC(year,month-1,day));
    if(date.getUTCFullYear()!==year||date.getUTCMonth()!==month-1||date.getUTCDate()!==day)return null;
    return date;
  }

  function parseInvoiceDate(value){
    const raw=String(value??'').trim();
    if(!raw)return {status:'missing',date:null,normalized:''};

    let match=raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if(match){
      const date=validYmd(match[1],match[2],match[3]);
      return date?{status:'ok',date,normalized:raw}:{status:'invalid',date:null,normalized:''};
    }

    // Numeric day/month forms are accepted only when their order is provable.
    // 03/04/2026 could mean 3 April or March 4, so it must be reviewed rather than guessed.
    match=raw.match(/^(\d{1,2})[/.](\d{1,2})[/.](\d{4})$/);
    if(match){
      const a=Number(match[1]),b=Number(match[2]);
      if(a<=12&&b<=12)return {status:'ambiguous',date:null,normalized:''};
      const day=a>12?a:b,month=a>12?b:a;
      const date=validYmd(match[3],month,day);
      return date?{status:'ok',date,normalized:`${match[3]}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`}:{status:'invalid',date:null,normalized:''};
    }

    return {status:'invalid',date:null,normalized:''};
  }

  function classifyInvoiceDate(value,now=new Date()){
    const parsed=parseInvoiceDate(value);
    if(parsed.status!=='ok')return parsed;
    const grace=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()+1,23,59,59,999));
    return {...parsed,status:parsed.date>grace?'future':'ok'};
  }

  return {parseInvoiceDate,classifyInvoiceDate};
});
