(function(root){
  'use strict';

  const SYMBOLS = Object.freeze({
    '$':'USD','US$':'USD','USD$':'USD',
    '€':'EUR','£':'GBP','¥':'JPY','￥':'JPY',
    '₽':'RUB','₸':'KZT','د.إ':'AED'
  });

  // Keep this intentionally conservative: accepting any three letters as a currency
  // lets typos such as USX silently pass when no allow-list is configured.
  const ISO_CODES = new Set([
    'AED','AUD','BRL','CAD','CHF','CNY','CZK','DKK','EUR','GBP','HKD','HUF','IDR','ILS','INR',
    'JPY','KRW','KZT','MXN','MYR','NOK','NZD','PLN','RON','RUB','SAR','SEK','SGD','THB','TRY',
    'UAH','USD','UZS','VND','ZAR'
  ]);

  const EXACT_ALIASES = Object.freeze({
    "SO'M":'UZS','SO’M':'UZS','SOʻM':'UZS','СЎМ':'UZS','СУМ':'UZS',
    'РУБ':'RUB','РУБЛЬ':'RUB','РУБЛИ':'RUB',
    'ДОЛЛАР':'USD','ДОЛЛАР США':'USD',
    'ЕВРО':'EUR'
  });

  const ALIASES = Object.freeze({
    USDOLLAR:'USD',USDOLLARS:'USD',DOLLAR:'USD',DOLLARS:'USD',
    EURO:'EUR',EUROS:'EUR',
    POUND:'GBP',POUNDS:'GBP',STERLING:'GBP',
    SUM:null,SOM:null,UZSOM:'UZS',UZBEKSOM:'UZS',
    TENGE:'KZT',
    DIRHAM:'AED',DIRHAMS:'AED',
    YUAN:'CNY',RENMINBI:'CNY',
    YEN:'JPY',
    LIRA:'TRY'
  });

  function normalizeCurrency(value){
    const raw=String(value??'').normalize('NFKC').trim();
    if(!raw)return '';
    const compact=raw.replace(/\s+/g,'');
    if(SYMBOLS[raw])return SYMBOLS[raw];
    if(SYMBOLS[compact])return SYMBOLS[compact];

    const upper=raw.toUpperCase().replace(/\s+/g,' ');
    if(Object.prototype.hasOwnProperty.call(EXACT_ALIASES,upper))return EXACT_ALIASES[upper];

    const token=upper.replace(/[.\s_-]+/g,'');
    if(Object.prototype.hasOwnProperty.call(ALIASES,token))return ALIASES[token]||'';
    if(ISO_CODES.has(token))return token;
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
