(function(){
  "use strict";
  if(!window.InvoiceGuardCSV)return;

  const parserErrors={
    en:{UNCLOSED_QUOTE:"The CSV contains an unclosed quoted field near row {line}. Fix the file and try again.",ROW_WIDTH_MISMATCH:"CSV row {line} has {actual} columns; {expected} were expected. The audit was stopped to avoid shifted data.",EMPTY_HEADER:"The CSV header is empty.",UNEXPECTED_QUOTE:"A quote appears inside an unquoted CSV field near row {line}. Fix the quoting and try again.",UNEXPECTED_CHAR_AFTER_QUOTE:"Unexpected text follows a closing CSV quote near row {line}. Only a delimiter or line break may follow it.",GENERIC:"The CSV could not be parsed safely. Please check the file and try again."},
    ru:{UNCLOSED_QUOTE:"В CSV есть незакрытое поле в кавычках около строки {line}. Исправьте файл и повторите попытку.",ROW_WIDTH_MISMATCH:"В строке CSV {line} найдено столбцов: {actual}, ожидалось: {expected}. Проверка остановлена, чтобы не анализировать смещённые данные.",EMPTY_HEADER:"Заголовок CSV пуст.",UNEXPECTED_QUOTE:"Кавычка внутри поля CSV без кавычек около строки {line}. Исправьте кавычки и повторите попытку.",UNEXPECTED_CHAR_AFTER_QUOTE:"После закрывающей кавычки CSV в строке {line} найден лишний текст. После неё допустимы только разделитель или перенос строки.",GENERIC:"CSV не удалось безопасно разобрать. Проверьте файл и повторите попытку."},
    uz:{UNCLOSED_QUOTE:"CSV faylida {line}-qator yaqinida yopilmagan qo‘shtirnoqli maydon bor. Faylni tuzating va qayta urinib ko‘ring.",ROW_WIDTH_MISMATCH:"CSV {line}-qatorida {actual} ta ustun bor, {expected} ta kutilgan. Siljigan ma’lumotlarni tekshirmaslik uchun audit to‘xtatildi.",EMPTY_HEADER:"CSV sarlavhasi bo‘sh.",UNEXPECTED_QUOTE:"CSV faylining {line}-qatorida qo‘shtirnoqsiz maydon ichida qo‘shtirnoq bor. Qo‘shtirnoqlarni tuzatib, qayta urinib ko‘ring.",UNEXPECTED_CHAR_AFTER_QUOTE:"CSV faylining {line}-qatorida yopuvchi qo‘shtirnoqdan keyin ortiqcha matn bor. Undan keyin faqat ajratgich yoki yangi qator kelishi mumkin.",GENERIC:"CSV faylini xavfsiz tahlil qilib bo‘lmadi. Faylni tekshirib, qayta urinib ko‘ring."},
    es:{UNCLOSED_QUOTE:"El CSV contiene un campo entre comillas sin cerrar cerca de la fila {line}. Corrige el archivo e inténtalo de nuevo.",ROW_WIDTH_MISMATCH:"La fila CSV {line} tiene {actual} columnas; se esperaban {expected}. La auditoría se detuvo para evitar datos desplazados.",EMPTY_HEADER:"El encabezado CSV está vacío.",UNEXPECTED_QUOTE:"Hay una comilla dentro de un campo CSV sin comillas cerca de la fila {line}. Corrige las comillas e inténtalo de nuevo.",UNEXPECTED_CHAR_AFTER_QUOTE:"Hay texto inesperado después de una comilla de cierre cerca de la fila {line}. Después solo puede aparecer un delimitador o un salto de línea.",GENERIC:"No se pudo analizar el CSV de forma segura. Revisa el archivo e inténtalo de nuevo."},
    de:{UNCLOSED_QUOTE:"Die CSV-Datei enthält nahe Zeile {line} ein nicht geschlossenes Anführungszeichenfeld. Bitte korrigieren und erneut versuchen.",ROW_WIDTH_MISMATCH:"CSV-Zeile {line} hat {actual} Spalten; erwartet wurden {expected}. Die Prüfung wurde gestoppt, um verschobene Daten zu vermeiden.",EMPTY_HEADER:"Die CSV-Kopfzeile ist leer.",UNEXPECTED_QUOTE:"In einem nicht zitierten CSV-Feld steht nahe Zeile {line} ein Anführungszeichen. Bitte korrigieren und erneut versuchen.",UNEXPECTED_CHAR_AFTER_QUOTE:"Nach einem schließenden CSV-Anführungszeichen folgt nahe Zeile {line} unerwarteter Text. Danach sind nur Trennzeichen oder Zeilenumbruch zulässig.",GENERIC:"Die CSV-Datei konnte nicht sicher verarbeitet werden. Bitte prüfen und erneut versuchen."},
    fr:{UNCLOSED_QUOTE:"Le CSV contient un champ entre guillemets non fermé près de la ligne {line}. Corrigez le fichier puis réessayez.",ROW_WIDTH_MISMATCH:"La ligne CSV {line} contient {actual} colonnes au lieu de {expected}. L’audit a été arrêté pour éviter des données décalées.",EMPTY_HEADER:"L’en-tête CSV est vide.",UNEXPECTED_QUOTE:"Un guillemet apparaît dans un champ CSV non cité près de la ligne {line}. Corrigez les guillemets puis réessayez.",UNEXPECTED_CHAR_AFTER_QUOTE:"Un texte inattendu suit un guillemet fermant près de la ligne {line}. Seuls un séparateur ou un saut de ligne peuvent suivre.",GENERIC:"Le CSV n’a pas pu être analysé en toute sécurité. Vérifiez le fichier puis réessayez."},
    pt:{UNCLOSED_QUOTE:"O CSV contém um campo entre aspas não fechado perto da linha {line}. Corrija o arquivo e tente novamente.",ROW_WIDTH_MISMATCH:"A linha CSV {line} tem {actual} colunas; eram esperadas {expected}. A auditoria foi interrompida para evitar dados deslocados.",EMPTY_HEADER:"O cabeçalho CSV está vazio.",UNEXPECTED_QUOTE:"Há uma aspa dentro de um campo CSV não delimitado por aspas perto da linha {line}. Corrija as aspas e tente novamente.",UNEXPECTED_CHAR_AFTER_QUOTE:"Há texto inesperado após uma aspa de fechamento perto da linha {line}. Depois dela, só pode haver um delimitador ou uma quebra de linha.",GENERIC:"Não foi possível analisar o CSV com segurança. Verifique o arquivo e tente novamente."}
  };
  const fieldLabels={
    en:{invoice_number:"Invoice number",vendor:"Vendor",date:"Invoice date",subtotal:"Subtotal",tax:"Tax",total:"Total",currency:"Currency"},
    ru:{invoice_number:"Номер счёта",vendor:"Поставщик",date:"Дата счёта",subtotal:"Подытог",tax:"Налог",total:"Итого",currency:"Валюта"},
    uz:{invoice_number:"Hisob raqami",vendor:"Yetkazib beruvchi",date:"Hisob sanasi",subtotal:"Oraliq summa",tax:"Soliq",total:"Jami",currency:"Valyuta"},
    es:{invoice_number:"Número de factura",vendor:"Proveedor",date:"Fecha de factura",subtotal:"Subtotal",tax:"Impuesto",total:"Total",currency:"Moneda"},
    de:{invoice_number:"Rechnungsnummer",vendor:"Lieferant",date:"Rechnungsdatum",subtotal:"Zwischensumme",tax:"Steuer",total:"Gesamt",currency:"Währung"},
    fr:{invoice_number:"Numéro de facture",vendor:"Fournisseur",date:"Date de facture",subtotal:"Sous-total",tax:"Taxe",total:"Total",currency:"Devise"},
    pt:{invoice_number:"Número da fatura",vendor:"Fornecedor",date:"Data da fatura",subtotal:"Subtotal",tax:"Imposto",total:"Total",currency:"Moeda"}
  };
  const language=()=>window.invoiceGuardI18n?.lang||"en";
  const label=key=>(fieldLabels[language()]||fieldLabels.en)[key]||String(key).replaceAll("_"," ");
  const auditError=()=>window.invoiceGuardAuditState?.set?.("error");

  function errorText(err){
    const code=err&&err.code||"GENERIC";
    const dict=parserErrors[language()]||parserErrors.en;
    let text=dict[code]||dict.GENERIC;
    return text.replace("{line}",err?.line??"?").replace("{actual}",err?.actual??"?").replace("{expected}",err?.expected??"?");
  }

  window.InvoiceGuardFieldLabel=label;
  window.parseCSV=function(text){
    let parsed;
    try{parsed=window.InvoiceGuardCSV.parse(text);}
    catch(err){auditError();alert(errorText(err));return[];}
    if(parsed.header.length<1||parsed.rows.length<1){auditError();return[];}
    const raw=parsed.header;
    const h=raw.map(canonical);
    $("mapping").textContent=raw.map((x,i)=>x+" → "+label(h[i])).join(" · ");
    showUnknown(raw,h);
    return parsed.rows.map(record=>Object.fromEntries(record.cells.map((v,j)=>[h[j]||"col"+j,v]).concat([["_row",record.line]])));
  };
})();
