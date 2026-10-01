(function(){
  "use strict";
  if(!window.InvoiceGuardCSV)return;

  const parserErrors={
    en:{UNCLOSED_QUOTE:"The CSV contains an unclosed quoted field near row {line}. Fix the file and try again.",ROW_WIDTH_MISMATCH:"CSV row {line} has {actual} columns; {expected} were expected. The audit was stopped to avoid shifted data.",EMPTY_HEADER:"The CSV header is empty.",GENERIC:"The CSV could not be parsed safely. Please check the file and try again."},
    ru:{UNCLOSED_QUOTE:"В CSV есть незакрытое поле в кавычках около строки {line}. Исправьте файл и повторите попытку.",ROW_WIDTH_MISMATCH:"В строке CSV {line} найдено столбцов: {actual}, ожидалось: {expected}. Проверка остановлена, чтобы не анализировать смещённые данные.",EMPTY_HEADER:"Заголовок CSV пуст.",GENERIC:"CSV не удалось безопасно разобрать. Проверьте файл и повторите попытку."},
    uz:{UNCLOSED_QUOTE:"CSV faylida {line}-qator yaqinida yopilmagan qo‘shtirnoqli maydon bor. Faylni tuzating va qayta urinib ko‘ring.",ROW_WIDTH_MISMATCH:"CSV {line}-qatorida {actual} ta ustun bor, {expected} ta kutilgan. Siljigan ma’lumotlarni tekshirmaslik uchun audit to‘xtatildi.",EMPTY_HEADER:"CSV sarlavhasi bo‘sh.",GENERIC:"CSV faylini xavfsiz tahlil qilib bo‘lmadi. Faylni tekshirib, qayta urinib ko‘ring."},
    es:{UNCLOSED_QUOTE:"El CSV contiene un campo entre comillas sin cerrar cerca de la fila {line}. Corrige el archivo e inténtalo de nuevo.",ROW_WIDTH_MISMATCH:"La fila CSV {line} tiene {actual} columnas; se esperaban {expected}. La auditoría se detuvo para evitar datos desplazados.",EMPTY_HEADER:"El encabezado CSV está vacío.",GENERIC:"No se pudo analizar el CSV de forma segura. Revisa el archivo e inténtalo de nuevo."},
    de:{UNCLOSED_QUOTE:"Die CSV-Datei enthält nahe Zeile {line} ein nicht geschlossenes Anführungszeichenfeld. Bitte korrigieren und erneut versuchen.",ROW_WIDTH_MISMATCH:"CSV-Zeile {line} hat {actual} Spalten; erwartet wurden {expected}. Die Prüfung wurde gestoppt, um verschobene Daten zu vermeiden.",EMPTY_HEADER:"Die CSV-Kopfzeile ist leer.",GENERIC:"Die CSV-Datei konnte nicht sicher verarbeitet werden. Bitte prüfen und erneut versuchen."},
    fr:{UNCLOSED_QUOTE:"Le CSV contient un champ entre guillemets non fermé près de la ligne {line}. Corrigez le fichier puis réessayez.",ROW_WIDTH_MISMATCH:"La ligne CSV {line} contient {actual} colonnes au lieu de {expected}. L’audit a été arrêté pour éviter des données décalées.",EMPTY_HEADER:"L’en-tête CSV est vide.",GENERIC:"Le CSV n’a pas pu être analysé en toute sécurité. Vérifiez le fichier puis réessayez."},
    pt:{UNCLOSED_QUOTE:"O CSV contém um campo entre aspas não fechado perto da linha {line}. Corrija o arquivo e tente novamente.",ROW_WIDTH_MISMATCH:"A linha CSV {line} tem {actual} colunas; eram esperadas {expected}. A auditoria foi interrompida para evitar dados deslocados.",EMPTY_HEADER:"O cabeçalho CSV está vazio.",GENERIC:"Não foi possível analisar o CSV com segurança. Verifique o arquivo e tente novamente."}
  };

  function errorText(err){
    const code=err&&err.code||"GENERIC";
    const language=window.invoiceGuardI18n?.lang||"en";
    let text=(parserErrors[language]||parserErrors.en)[code]||(parserErrors[language]||parserErrors.en).GENERIC;
    return text.replace("{line}",err?.line??"?").replace("{actual}",err?.actual??"?").replace("{expected}",err?.expected??"?");
  }

  window.parseCSV=function(text){
    let parsed;
    try{parsed=window.InvoiceGuardCSV.parse(text);}
    catch(err){alert(errorText(err));return[];}
    if(parsed.header.length<1||parsed.rows.length<1)return[];
    const raw=parsed.header;
    const h=raw.map(canonical);
    $("mapping").textContent=raw.map((x,i)=>x+" → "+h[i]).join(" · ");
    showUnknown(raw,h);
    return parsed.rows.map(record=>Object.fromEntries(record.cells.map((v,j)=>[h[j]||"col"+j,v]).concat([["_row",record.line]])));
  };
})();
