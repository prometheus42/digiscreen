// JavaScript flexImages v1.0.2
// https://github.com/Pixabay/JavaScript-flexImages
var flexImages=function(){function e(e){function t(e,r,n,i){function o(e){n.maxRows&&g>n.maxRows||n.truncate&&e&&g>1?c[a][0].style.display="none":(c[a][4]&&(c[a][3].setAttribute("src",c[a][4]),c[a][4]=""),c[a][0].style.width=l+"px",c[a][0].style.height=h+"px",c[a][0].style.display="block")}for(var a,l,s,d,f=1,g=1,u=e.clientWidth-2,c=[],m=0,h=n.rowHeight,w=0;w<r.length;w++)if(c.push(r[w]),m+=r[w][2]+n.margin,m>=u){var p=c.length*n.margin;for(f=(u-p)/(m-p),h=Math.ceil(n.rowHeight*f),s=0,l,a=0;a<c.length;a++)l=Math.ceil(c[a][2]*f),s+=l+n.margin,s>u&&(l-=s-u),o();c=[],m=0,g++}for(a=0;a<c.length;a++)l=Math.floor(c[a][2]*f),d=Math.floor(n.rowHeight*f),o(!0);i||u==e.clientWidth||t(e,r,n,!0)}if(document.querySelector){var r={selector:0,container:".item",object:"img",rowHeight:180,maxRows:0,truncate:0};for(var n in e)e.hasOwnProperty(n)&&(r[n]=e[n]);for(var i="object"==typeof r.selector?[r.selector]:document.querySelectorAll(r.selector),o=0;o<i.length;o++){var a=i[o],l=a.querySelectorAll(r.container),s=[],d=(new Date).getTime();if(l.length){var f=window.getComputedStyle?getComputedStyle(l[0],null):l[0].currentStyle;r.margin=(parseInt(f.marginLeft)||0)+(parseInt(f.marginRight)||0)+(Math.round(parseFloat(f.borderLeftWidth))||0)+(Math.round(parseFloat(f.borderRightWidth))||0);for(var g=0;g<l.length;g++){var u=l[g],c=parseInt(u.getAttribute("data-w")),m=c*(r.rowHeight/parseInt(u.getAttribute("data-h"))),h=u.querySelector(r.object);s.push([u,c,m,h,h.getAttribute("data-src")])}t(a,s,r);var w=function(){t(a,s,r)};document.addEventListener?(window["flexImages_listener"+d]=w,window.removeEventListener("resize",window["flexImages_listener"+a.getAttribute("data-flex-t")]),delete window["flexImages_listener"+a.getAttribute("data-flex-t")],window.addEventListener("resize",window["flexImages_listener"+d])):a.onresize=w,a.setAttribute("data-flex-t",d)}}}}return e}();!function(){"function"==typeof define&&define.amd?define("flexImages",function(){return flexImages}):"undefined"!=typeof module&&module.exports?module.exports=flexImages:window.flexImages=flexImages}();