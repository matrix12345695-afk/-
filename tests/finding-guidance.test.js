const assert=require('node:assert/strict');
const {languages,get}=require('../finding-guidance.js');
const keys=['missingNo','missingVendor','missingDate','invalidDate','futureDate','missingCurrency','currencyNotAllowed','invalidTotal','badMath','negativeTax','taxRate','pastDuplicate','duplicate'];
assert.deepEqual([...languages].sort(),['de','en','es','fr','pt','ru','uz']);
for(const language of languages){for(const key of keys){const text=get(key,language);assert.ok(text&&text.length>45,`${language}.${key} guidance missing/too short`);}}
assert.match(get('duplicate','en'),/Why:/);assert.match(get('duplicate','en'),/Verify:/);assert.match(get('duplicate','ru'),/Почему важно:/);assert.match(get('duplicate','ru'),/Проверить:/);
console.log('finding guidance regression checks passed');
