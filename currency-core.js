(function(root){
  'use strict';

  const SYMBOLS = Object.freeze({
    '$':'USD','US$':'USD','USD$':'USD',
    '€':'EUR','£':'GBP','¥':'JPY','￥':'JPY',
    '₽':'RUB','₸':'KZT','د.إ':'AED'
  });

  const ALIASES = Object.freeze({
    USDOLLAR:'USD',DOLLAR:'USD',
    EURO:'EUR',EUROS:'EUR',
    POUND:'GBP',POUNDS:'GBP',STERLING:'GBP',
    SUM:null,SOM:null,UZSOM:'UZS',
    TENGE:'KZT',
    DIRHAM:'AED',DIRHAMS:'AED'
  });

  function normalizeCurrency(value){
    const raw=String(value??'').normalize('NFKC').trim();
    if(!raw)return '';
    const compact=raw.replace(/\s+/g,'');
    if(SYMBOLS[raw])return SYMBOLS[raw];
    if(SYMBOLS[compact])return SYMBOLS[compact];
    const token=raw.toUpperCase().replace(/[.\s_-]+/g,'');
    if(Object.prototype.hasOwnProperty.call(ALIASES,token))return ALIASES[token]||'';
    if(/^[A-Z]{3}$/.test(token))return token;
    return '';
  }

  function normalizeAllowedCurrencies(values){
    const input=Array.isArray(values)?values:String(values??'').split(',');
    return [...new Set(input.map(normalizeCurrency).filter(Boolean))];
  }

  function classifyCurrency(value,allowed){
    const raw=String(value??'').trim();
    if(!raw)return {status:'missing',raw,currency:''};
    const currency=normalizeCurrency(raw);
    if(!currency)return {status:'unrecognized',raw,currency:''};
    const allow=normalizeAllowedCurrencies(allowed);
    if(allow.length&&!allow.includes(currency))return {status:'not_allowed',raw,currency};
    return {status:'ok',raw,currency};
  }

  const api={normalizeCurrency,normalizeAllowedCurrencies,classifyCurrency};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.InvoiceGuardCurrencyCore=api;
})(typeof window!=='undefined'?window:globalThis);
