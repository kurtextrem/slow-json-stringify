var _stringifyCallback=function(r,e){return e.isSJS?e.type+"__sjs":e},_prepare=function(r){var e=JSON.stringify(r,_stringifyCallback);return{_preparedString:e,_preparedSchema:JSON.parse(e)}},__find=function __find(path){for(var str="obj",i=0;i<path.length;++i)str+="?.['"+path[i]+"']";return eval("(obj=>"+str+")")};function _arraySerializer(r,e){for(var n="",a=e.length-1,t=0;t<a;++t)n+=r(e[t])+",";return n+=r(e[a]),console.log(n),"["+n+"]"}var _makeArraySerializer=function(r){return r instanceof Function?_arraySerializer.bind(null,r):JSON.stringify};function _arrayNullSerializer(r,e){if(null===e)return"null";r(e)}var _makeNullArraySerializer=function(r){var e=_makeArraySerializer(r);return _arrayNullSerializer.bind(null,e)},TYPES={number:null,string:null,boolean:null,array:_makeArraySerializer,null:null,nullArray:_makeNullArraySerializer},fnUser=function(r){return r},attr=function(r,e){var n;return{isSJS:!0,type:r,serializer:(null==(n=TYPES[r])?void 0:n.call(TYPES,e))||e||fnUser}},_defaultRegex=new RegExp('\\n|\\r|\\t|\\"|\\\\',"gm"),_escapeCallback=function(r){return"\\"+r},escape=function(r){return void 0===r&&(r=_defaultRegex),function(e){return e.replace(r,_escapeCallback)}},_sjsRegex=/__sjs/;function _prepareQueue(r,e,n,a){if(void 0===a&&(a=[]),_sjsRegex.test(n)){var t=Array.from(a),u=__find(t),i=u(r);e.push({serializer:i.serializer,find:u,name:a[a.length-1]})}else for(var _=Object.keys(n),l=0;l<_.length;++l){var s=_[l];_prepareQueue(r,e,n[s],[].concat(a,[s]))}}var _makeQueue=function(r,e){var n=[];return _prepareQueue(e,n,r),n},_stringRegex=/string/,_replaceString=function(r){return _stringRegex.test(r)?'"__par__"':"__par__"},_isLastRegex=/^("}|})/,chunkRegex=/"\w+__sjs"/gm,_matchStartRe=/^(\"\,|\,|\")/,_makeChunks=function(r,e){chunkRegex.lastIndex=0;for(var n=r.replace(chunkRegex,_replaceString).split("__par__"),a=[],t=0;t<n.length;++t){var u,i=n[t],_='("'+(null==(u=e[t])?void 0:u.name)+'":("?))$',l=_isLastRegex.test(n[t+1]||""),s=new RegExp(l?"(,?)"+_:_);a.push({flag:!1,pure:i,prevUndef:i.replace(_matchStartRe,""),isUndef:i.replace(s,""),bothUndef:i.replace(_matchStartRe,"").replace(s,"")})}return a},_select=function(r){return function(e,n){var a=r[n];return void 0!==e?a.flag?a.prevUndef+e:a.pure+e:(r[n+1].flag=!0,a.flag?a.bothUndef:a.isUndef)}},sjs=function(r){var e=_prepare(r),n=e._preparedString,a=_makeQueue(e._preparedSchema,r),t=_makeChunks(n,a),u=_select(t),i=a.length;return function(r){for(var e="",n=0;n!==i;){var _=a[n],l=_.serializer,s=(0,_.find)(r);e+=u(l(s),n),++n}var c=t[t.length-1];return e+(c.flag?c.prevUndef:c.pure)}};export{attr,escape,sjs};
//# sourceMappingURL=sjs.mjs.map
