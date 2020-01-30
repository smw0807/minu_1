 var varMode = 'Y';
 function doEditMode(){
     if(varMode == "Y"){
      document.getElementById("CNTS").style.display = 'block';
      document.getElementById("CNTS_HTML").style.display = 'none';
      varMode = "N";
     }else{
      document.getElementById("CNTS").style.display = 'none';
      document.getElementById("CNTS_HTML").style.display = 'block';
      varMode = "Y";
     }
 }
 
 function doActionEdit(){
     doEditMode();
 } 
 
 function doActionAct(){
     var htmlObj = document.getElementById("CNTS_HTML");
     var obj = document.getElementById("CNTS");
     var inHtml = '';
  wrapText(obj, "<font color='#ff0000'>", "</font>");

  frm.SPEC_HEATOUT_AIM_LOV.value = obj.value;
  inHtml = obj.value;
  
  inHtml = replace(inHtml,"\r\n","<br>");
  htmlObj.innerHTML = inHtml;
  varMode = "N";
  doEditMode();
 }
 
 function wrapText(obj, beginTag, endTag){
  if(typeof obj.selectionStart == 'number'){
   // Mozilla, Opera, and other browsers
   var start = obj.selectionStart;
   var end = obj.selectionEnd;
   obj.value = obj.value.substring(0, start) + beginTag + obj.value.substring(start, end) + endTag + obj.value.substring(end, obj.value.length);
  }
  else if(document.selection){
   // Internet Explorer
   // make sure it's the textarea's selection
   //obj.focus();
   var range = document.selection.createRange();
   if(range.parentElement() != obj)
       return false;
   
   if(typeof range.text == 'string')
    document.selection.createRange().text = beginTag + range.text + endTag;
  }
  else{
      obj.value += text;
  }
 }

 

// str에서 mstr문자를 rstr로 변경한다.
function replace(str, mstr, rstr) {
 var pos = str.indexOf(mstr);
 var retstr = "";

 if(pos != -1 ) {
  while( pos != -1 ) {
   tstr = str.substring(0, pos);

   retstr = retstr + tstr + rstr;

   str = str.substring(pos+mstr.length);
   pos = str.indexOf(mstr);
   if(pos == -1) {
    retstr += str;
    break;
   }
  }
 } else {
  retstr = str;
 }

 return retstr;
}