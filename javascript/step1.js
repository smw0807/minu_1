var MYAPP = MYAPP || {};

MYAPP.namespace = function (ns_string) {
    var parts = ns_string.split('.'),
    parent = MYAPP,
    i;

    if (parts[0] === 'MYAPP') {
        parts = parts.slice(1);
    }

    for (i = 0; i <parts.length; i+= 1) {
        if (typeof parent[parts[i]] === 'undefined')  {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
}

var module2 = MYAPP.namespace("MYAPP.modules.module2");
console.log(module);
console.log(module2 === MYAPP.modiles.module2);