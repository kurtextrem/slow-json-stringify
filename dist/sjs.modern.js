const _stringifyCallback=(e,r)=>r.isSJS?`${r.type}__sjs`:r,_prepare=e=>{const r=JSON.stringify(e,_stringifyCallback);return{_preparedString:r,_preparedSchema:JSON.parse(r)}},__find=path=>{let str="obj";for(let e=0;e<path.length;++e)str+=`?.['${path[e]}']`;return eval(`(obj=>${str})`)};function _arraySerializer(e,r){let a="";const n=r.length-1;for(let t=0;t<n;++t)a+=`${e(r[t])},`;return a+=e(r[n]),console.log(a),`[${a}]`}const _makeArraySerializer=e=>e instanceof Function?_arraySerializer.bind(null,e):JSON.stringify;function _arrayNullSerializer(e,r){if(null===r)return"null";e(r)}const _makeNullArraySerializer=e=>{const r=_makeArraySerializer(e);return _arrayNullSerializer.bind(null,r)},TYPES={number:null,string:null,boolean:null,array:_makeArraySerializer,null:null,nullArray:_makeNullArraySerializer},fnUser=e=>e,attr=(e,r)=>{var a;return{isSJS:!0,type:e,serializer:(null==(a=TYPES[e])?void 0:a.call(TYPES,r))||r||fnUser}},_defaultRegex=new RegExp('\\n|\\r|\\t|\\"|\\\\',"gm"),_escapeCallback=e=>"\\"+e,escape=(e=_defaultRegex)=>r=>r.replace(e,_escapeCallback),_sjsRegex=/__sjs/;function _prepareQueue(e,r,a,n=[]){if(_sjsRegex.test(a)){const a=Array.from(n),t=__find(a),{serializer:l}=t(e);return void r.push({serializer:l,find:t,name:n[n.length-1]})}const t=Object.keys(a);for(let l=0;l<t.length;++l){const _=t[l];_prepareQueue(e,r,a[_],[...n,_])}}const _makeQueue=(e,r)=>{const a=[];return _prepareQueue(r,a,e),a},_stringRegex=/string/,_replaceString=e=>_stringRegex.test(e)?'"__par__"':"__par__",_isLastRegex=/^("}|})/,chunkRegex=/"\w+__sjs"/gm,_matchStartRe=/^(\"\,|\,|\")/,_makeChunks=(e,r)=>{chunkRegex.lastIndex=0;const a=e.replace(chunkRegex,_replaceString).split("__par__"),n=[];for(let e=0;e<a.length;++e){var t;const l=a[e],_=`("${null==(t=r[e])?void 0:t.name}":("?))$`,s=_isLastRegex.test(a[e+1]||""),i=new RegExp(s?`(,?)${_}`:_);n.push({flag:!1,pure:l,prevUndef:l.replace(_matchStartRe,""),isUndef:l.replace(i,""),bothUndef:l.replace(_matchStartRe,"").replace(i,"")})}return n},_select=e=>(r,a)=>{const n=e[a];return void 0!==r?n.flag?n.prevUndef+r:n.pure+r:(e[a+1].flag=!0,n.flag?n.bothUndef:n.isUndef)},sjs=e=>{const{_preparedString:r,_preparedSchema:a}=_prepare(e),n=_makeQueue(a,e),t=_makeChunks(r,n),l=_select(t),_=n.length;return e=>{let r="",a=0;for(;a!==_;){const{serializer:t,find:_}=n[a],s=_(e);r+=l(t(s),a),++a}const{flag:s,pure:i,prevUndef:u}=t[t.length-1];return r+(s?u:i)}};export{attr,escape,sjs};
//# sourceMappingURL=sjs.modern.js.map