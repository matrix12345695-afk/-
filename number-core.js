(function(root){
  function parseAccountingNumber(value){
    if(typeof value==='number') return Number.isFinite(value)?value:NaN;
    let s=String(value??'').trim();
    if(!s) return NaN;

    let negative=false;
    const parenthesized=s.startsWith('(')||s.endsWith(')');
    if(parenthesized){
      if(!(s.startsWith('(')&&s.endsWith(')')))return NaN;
      negative=true;
      s=s.slice(1,-1).trim();
    }

    const sign=/^([+-])\s*/.exec(s);
    if(sign){
      if(parenthesized)return NaN;
      negative=sign[1]==='-';
      s=s.slice(sign[0].length);
    }
    if(!s)return NaN;

    // Permit one currency symbol only at the amount boundary. Never strip
    // arbitrary letters or punctuation from the middle of a financial value.
    const currencySymbols="$€£¥₹₽₩₺₴₦₪₫₱฿₡₲₵₭₮₸₼₾¤";
    const symbolPositions=[];
    for(let i=0;i<s.length;i++)if(currencySymbols.includes(s[i]))symbolPositions.push(i);
    if(symbolPositions.length>1)return NaN;
    if(symbolPositions.length===1){
      const pos=symbolPositions[0];
      if(pos===0)s=s.slice(1).trim();
      else if(pos===s.length-1)s=s.slice(0,-1).trim();
      else return NaN;
    }
    if(!s||[...s].some(c=>currencySymbols.includes(c)))return NaN;
    if(!/^[0-9,.'’\t \u00A0\u202F]+$/u.test(s)||!/[0-9]/.test(s))return NaN;

    const grouping=/[,.'’\t \u00A0\u202F]/u;
    const badGroupingEdges=/^[,.'’\t \u00A0\u202F]|[,.'’\t \u00A0\u202F]$/u;
    const repeatedGrouping=/[,.'’\t \u00A0\u202F]{2}/u;
    function validGroupedInteger(part){
      if(!part)return true;
      if(badGroupingEdges.test(part)||repeatedGrouping.test(part))return false;
      // Mixed grouping glyphs can turn malformed financial text into a plausible but wrong amount.
      const separators=part.match(/[,.'’\t \u00A0\u202F]/gu)||[];
      if(new Set(separators).size>1)return false;
      const groups=part.split(grouping);
      if(groups.some(group=>!/^[0-9]+$/.test(group)))return false;
      if(groups.length===1)return true;
      const western=groups[0].length>=1&&groups[0].length<=3&&groups.slice(1).every(group=>group.length===3);
      const indian=groups.length>=3&&groups[0].length>=1&&groups[0].length<=2&&groups.slice(1,-1).every(group=>group.length===2)&&groups[groups.length-1].length===3;
      return western||indian;
    }

    const commas=[...s.matchAll(/,/g)].map(match=>match.index);
    const dots=[...s.matchAll(/\./g)].map(match=>match.index);
    let integerPart=s,fraction="",hasDecimal=false;

    if(commas.length&&dots.length){
      const decimalIndex=Math.max(commas[commas.length-1],dots[dots.length-1]);
      integerPart=s.slice(0,decimalIndex);
      fraction=s.slice(decimalIndex+1);
      hasDecimal=true;
    }else{
      const positions=commas.length?commas:dots;
      if(positions.length===1){
        const index=positions[0];
        const before=s.slice(0,index);
        const after=s.slice(index+1);
        if(!/^[0-9]{1,6}$/.test(after))return NaN;
        const beforeDigits=before.replace(/[,.'’\t \u00A0\u202F]/gu,"");
        const zeroLeading=/^0+$/.test(beforeDigits);
        const isGrouping=after.length===3&&!zeroLeading&&before.length>=1&&before.length<=3&&/^[0-9]+$/.test(before);
        if(!isGrouping){
          integerPart=before;
          fraction=after;
          hasDecimal=true;
        }
      }
    }

    if(hasDecimal){
      if(!/^[0-9]{1,6}$/.test(fraction)||!validGroupedInteger(integerPart))return NaN;
    }else if(!validGroupedInteger(integerPart)){
      return NaN;
    }

    const digits=integerPart.replace(/[,.'’\t \u00A0\u202F]/gu,"");
    if(!digits&&!hasDecimal)return NaN;
    const normalized=(digits||"0")+(hasDecimal?"."+fraction:"");
    const number=Number(normalized);
    return Number.isFinite(number)?(negative?-number:number):NaN;
  }

  const api={parseAccountingNumber};
  if(typeof module!=='undefined'&&module.exports) module.exports=api;
  root.InvoiceGuardNumbers=api;
})(typeof window!=='undefined'?window:globalThis);
