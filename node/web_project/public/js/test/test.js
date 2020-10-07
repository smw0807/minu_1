console.log("test.js!");
var html = "";
html += '<script>alert("test");</script>';
// < &lt
// > &gt
html = html.replace(/[<]/gi, "&lt");
html = html.replace(/[>]/gi, "&gt");
$('#scriptTest').html(html);