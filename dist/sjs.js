var r=function(r,n){return n.reduce(function(r,n){return r&&r[n]},r)},n=function(r,n){if("array-simple"===n)return JSON.stringify(r);for(var e="",t=0,s=r;t<s.length;t+=1)e+=n(s[t])+",";return"["+e.slice(0,e.length-1)+"]"};exports.sjs=function(e){var t=function(r){return JSON.stringify(r,function(r,n){var e=Array.isArray(n);return"object"!=typeof n||e?(function(r){var n=new Set(["number","string","boolean","undefined","array-simple","function"]);if(Array.isArray(r)){if(n.has(r[0])||n.has(typeof r[0]))return;throw new Error('Expected either "array-simple" or a function. received '+r)}if("function"!=typeof r&&!n.has(r))throw new Error('Expected one of: "number", "string", "boolean", "undefined". received '+r)}(n),e?n:"function"==typeof n?n:n+"__sjs"):n})}(e),s=function(r,n){return r.replace(n,function(r){switch(r){case'"string__sjs"':case'"undefined__sjs"':return'"__par__"';case'"number__sjs"':case'"boolean__sjs"':case'["array-simple__sjs"]':case"[null]":return"__par__";default:return r}}).split("__par__")}(t,new RegExp('"(string__sjs|number__sjs|boolean__sjs|undefined__sjs)"|\\[(.*?)\\]',"gm")),i=s[s.length-1],a=function(r){return function(n,e){if(void 0!==n)return n;var t=r[e];return 34===t.charCodeAt(t.length-1)?n:'"'+n+'"'}}(s),u=function(n,e){var t=[],s=new Set(["number__sjs","string__sjs","boolean__sjs","undefined__sjs"]);return function i(a,u){void 0===u&&(u=[]);var o=Array.isArray(a);if(!s.has(r(n,u))&&!o)return Object.keys(a).map(function(r){return i(a[r],u.concat([r]))});t.push({isArray:o,method:!!o&&("string"==typeof a[0]?"array-simple":r(e,u)[0]),path:Array.isArray(u)?u:[u]})}(n),t}(JSON.parse(t),e),o=u.length;return function(e){for(var t="",f=0;f!==o;){var c=u[f],_=c.method,p=c.isArray,y=r(e,c.path),l=p?n(y,_):y;t+=s[f]+a(l,f),f+=1}return t+i}},exports.escape=function(r){var n=r||new RegExp('\\n|\\r|\\t|\\"|\\\\',"gm");return function(r){return r.replace(n,function(r){return"\\"+r})}};
//# sourceMappingURL=sjs.js.map
