(function(){function p(c,a,e){a=document.getElementById(a);a.parentNode.removeChild(a);var b=document.getElementById(c);if(b){c=b.previousSibling;if(e)c.data="$!",b.setAttribute("data-dgst",e);else{e=c.parentNode;b=c.nextSibling;var h=0;do{if(b&&8===b.nodeType){var d=b.data;if("/$"===d)if(0===h)break;else h--;else"$"!==d&&"$?"!==d&&"$!"!==d||h++}d=b.nextSibling;e.removeChild(b);b=d}while(b);for(;a.firstChild;)e.insertBefore(a.firstChild,b);c.data="$"}c._reactRetry&&c._reactRetry()}}function B(c,a,
e){for(var b=new Map,h=document,d,g,q=h.querySelectorAll("link[data-precedence],style[data-precedence]"),w=[],r=0;g=q[r++];)"not all"===g.getAttribute("media")?w.push(g):("LINK"===g.tagName&&v.set(g.getAttribute("href"),g),b.set(g.dataset.precedence,d=g));g=0;q=[];var t,f;for(r=!0;;){if(r){var n=e[g++];if(!n){r=!1;g=0;continue}var k=!1,u=0;var l=n[u++];if(f=v.get(l)){var m=f._p;k=!0}else{f=h.createElement("link");f.href=l;f.rel="stylesheet";for(f.dataset.precedence=t=n[u++];m=n[u++];)f.setAttribute(m,
n[u++]);m=f._p=new Promise(function(C,D){f.onload=C;f.onerror=D});v.set(l,f)}l=f.getAttribute("media");!m||"l"===m.s||l&&!window.matchMedia(l).matches||q.push(m);if(k)continue}else{f=w[g++];if(!f)break;t=f.getAttribute("data-precedence");f.removeAttribute("media")}k=b.get(t)||d;k===d&&(d=f);b.set(t,f);k?k.parentNode.insertBefore(f,k.nextSibling):(k=h.head,k.insertBefore(f,k.firstChild))}Promise.all(q).then(p.bind(null,c,a,""),p.bind(null,c,a,"Resource failed to load"))}function x(c){c=c.querySelectorAll("template");
for(var a=0;a<c.length;a++)y(c[a])}function z(c){function a(b){for(var h=0;h<b.length;h++)for(var d=b[h].addedNodes,g=0;g<d.length;g++)d[g].parentNode&&y(d[g])}var e=new MutationObserver(a);e.observe(c,{childList:!0});window.addEventListener("DOMContentLoaded",function(){a(e.takeRecords());e.disconnect()})}function y(c){if(1===c.nodeType&&c.dataset){var a=c.dataset;if(null!=a.rxi){var e=a.dgst,b=a.msg,h=a.stck,d=document.getElementById(a.bid);d&&(a=d.previousSibling,a.data="$!",d=d.dataset,e&&(d.dgst=
e),b&&(d.msg=b),h&&(d.stck=h),a._reactRetry&&a._reactRetry());c.remove()}else if(null!=a.rri)B(a.bid,a.sid,JSON.parse(a.sty)),c.remove();else if(null!=a.rci)p(a.bid,a.sid),c.remove();else if(null!=a.rsi){e=a.pid;b=document.getElementById(a.sid);e=document.getElementById(e);for(b.parentNode.removeChild(b);b.firstChild;)e.parentNode.insertBefore(b.firstChild,e);e.parentNode.removeChild(e);c.remove()}}}var v=new Map;window.$RC||(window.$RC=p,window.$RM=new Map);if(null!=document.body)"loading"===document.readyState&&
z(document.body),x(document.body);else{var A=new MutationObserver(function(){null!=document.body&&("loading"===document.readyState&&z(document.body),x(document.body),A.disconnect())});A.observe(document.documentElement,{childList:!0})}})();
