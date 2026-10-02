(function(root){
  function parseAccountingNumber(value){
    if(typeof value==='number') return Number.isFinite(value)?value:NaN;
    let s=String(value??'').trim();
    if(!s) return NaN;
    let negative=false;
    if(/^\(.*\)$/.test(s)){negative=true;s=s.slice(1,-1).trim();}
    // Currency symbols and common surrounding labels are tolerated, but a value
    // containing no digit must never collapse to zero (for example "not-a-number").
    if(!/\d/.test(s)) return NaN;
    s=s.replace(/[\u00A0\u202F\s'’]/g,'').replace(/[^0-9,\.\-+]/g,'');
    if(!s||!/\d/.test(s)) return NaN;
    if(s.startsWith('-')){negative=!negative;s=s.slice(1);} else if(s.startsWith('+')) s=s.slice(1);
    s=s.replace(/[+-]/g,'');
    const comma=s.lastIndexOf(','), dot=s.lastIndexOf('.');
    let decimal=null;
    if(comma>=0&&dot>=0) decimal=comma>dot?',':'.';
    else if(comma>=0){const parts=s.split(',');const tail=parts[parts.length-1];decimal=(parts.length===2&&tail.length!==3)||tail.length===1||tail.length===2?',':null;}
    else if(dot>=0){const parts=s.split('.');const tail=parts[parts.length-1];decimal=(parts.length===2&&tail.length!==3)||tail.length===1||tail.length===2?'.':null;}
    if(decimal){const pos=s.lastIndexOf(decimal);const whole=s.slice(0,pos).replace(/[,.]/g,'');const frac=s.slice(pos+1).replace(/[,.]/g,'');s=whole+'.'+frac;}
    else s=s.replace(/[,.]/g,'');
    const n=Number(s);return Number.isFinite(n)?(negative?-n:n):NaN;
  }
  const api={parseAccountingNumber};
  if(typeof module!=='undefined'&&module.exports) module.exports=api;
  root.InvoiceGuardNumbers=api;
})(typeof window!=='undefined'?window:globalThis);
