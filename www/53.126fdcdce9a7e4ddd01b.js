(window.webpackJsonp=window.webpackJsonp||[]).push([[53],{"5ZYv":function(e,o,t){"use strict";t.r(o),t.d(o,"IonPopover",function(){return b}),t.d(o,"IonPopoverController",function(){return y});var n=t("cBjU"),r=t("s9Q1"),i=t("ccrQ"),a=t("XGMM"),p=function(e,o,t,n){return new(t||(t=Promise))(function(r,i){function a(e){try{s(n.next(e))}catch(e){i(e)}}function p(e){try{s(n.throw(e))}catch(e){i(e)}}function s(e){e.done?r(e.value):new t(function(o){o(e.value)}).then(a,p)}s((n=n.apply(e,o||[])).next())})},s=function(e,o){var t,n,r,i,a={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return i={next:p(0),throw:p(1),return:p(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function p(i){return function(p){return function(i){if(t)throw new TypeError("Generator is already executing.");for(;a;)try{if(t=1,n&&(r=2&i[0]?n.return:i[0]?n.throw||((r=n.return)&&r.call(n),0):n.next)&&!(r=r.call(n,i[1])).done)return r;switch(n=0,r&&(i=[2&i[0],r.value]),i[0]){case 0:case 1:r=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,n=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!(r=(r=a.trys).length>0&&r[r.length-1])&&(6===i[0]||2===i[0])){a=0;continue}if(3===i[0]&&(!r||i[1]>r[0]&&i[1]<r[3])){a.label=i[1];break}if(6===i[0]&&a.label<r[1]){a.label=r[1],r=i;break}if(r&&a.label<r[2]){a.label=r[2],a.ops.push(i);break}r[2]&&a.ops.pop(),a.trys.pop();continue}i=o.call(e,a)}catch(e){i=[6,e],n=0}finally{t=r=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,p])}}};function l(e,o,t){var n="top",r="left",i=o.querySelector(".popover-content"),a=i.getBoundingClientRect(),p=a.width,s=a.height,l=window.innerWidth,d=window.innerHeight,u=t&&t.target&&t.target.getBoundingClientRect(),m=u&&"top"in u?u.top:d/2-s/2,f=u&&"left"in u?u.left:l/2,b=u&&u.width||0,v=u&&u.height||0,y=o.querySelector(".popover-arrow"),h=y.getBoundingClientRect(),g=h.width,w=h.height;u||(y.style.display="none");var x={top:m+v,left:f+b/2-g/2},P={top:m+v+(w-1),left:f+b/2-p/2},D=!1,k=!1;P.left<c+25?(D=!0,P.left=c):p+c+P.left+25>l&&(k=!0,P.left=l-p-c,r="right"),m+v+s>d&&m-s>0?(x.top=m-(w+1),console.log(x),console.log(m),console.log(s),P.top=m-s-(w-1),o.className=o.className+" popover-bottom",n="bottom"):m+v+s>d&&(i.style.bottom=c+"%"),y.style.top=x.top+"px",y.style.left=x.left+"px",i.style.top=P.top+"px",i.style.left=P.left+"px",D&&(i.style.left="calc("+P.left+"px + var(--ion-safe-area-left, 0px)"),k&&(i.style.left="calc("+P.left+"px + var(--ion-safe-area-right, 0px)"),i.style.transformOrigin=n+" "+r;var j=new e,O=new e;O.addElement(o.querySelector("ion-backdrop")),O.fromTo("opacity",.01,.08);var E=new e;return E.addElement(o.querySelector(".popover-wrapper")),E.fromTo("opacity",.01,1),Promise.resolve(j.addElement(o).easing("ease").duration(100).add(O).add(E))}var c=5;function d(e,o){var t=new e,n=new e;n.addElement(o.querySelector("ion-backdrop"));var r=new e;return r.addElement(o.querySelector(".popover-wrapper")),r.fromTo("opacity",.99,0),n.fromTo("opacity",.08,0),Promise.resolve(t.addElement(o).easing("ease").duration(500).add(n).add(r))}function u(e,o,t){var n="top",r="left",i=o.querySelector(".popover-content"),a=i.getBoundingClientRect(),p=a.width,s=a.height,l=window.innerWidth,c=window.innerHeight,d=t&&t.target&&t.target.getBoundingClientRect(),u=d&&"top"in d?d.top:c/2-s/2,f=d&&d.height||0,b={top:u,left:d&&"left"in d?d.left:l/2-p/2};b.left<m?b.left=m:p+m+b.left>l&&(b.left=l-p-m,r="right"),u+f+s>c&&u-s>0?(b.top=u-s,o.className=o.className+" popover-bottom",n="bottom"):u+f+s>c&&(i.style.bottom=m+"px"),i.style.top=b.top+"px",i.style.left=b.left+"px",i.style.transformOrigin=n+" "+r;var v=new e,y=new e;y.addElement(o.querySelector("ion-backdrop")),y.fromTo("opacity",.01,.08);var h=new e;h.addElement(o.querySelector(".popover-wrapper")),h.fromTo("opacity",.01,1);var g=new e;g.addElement(o.querySelector(".popover-content")),g.fromTo("scale",.001,1);var w=new e;return w.addElement(o.querySelector(".popover-viewport")),w.fromTo("opacity",.01,1),Promise.resolve(v.addElement(o).easing("cubic-bezier(0.36,0.66,0.04,1)").duration(300).add(y).add(h).add(g).add(w))}var m=12;function f(e,o){var t=new e,n=new e;n.addElement(o.querySelector("ion-backdrop"));var r=new e;return r.addElement(o.querySelector(".popover-wrapper")),r.fromTo("opacity",.99,0),n.fromTo("opacity",.08,0),Promise.resolve(t.addElement(o).easing("ease").duration(500).add(n).add(r))}var b=function(){function e(){this.presented=!1,this.keyboardClose=!0,this.backdropDismiss=!0,this.showBackdrop=!0,this.translucent=!1,this.willAnimate=!0}return e.prototype.componentDidLoad=function(){this.ionPopoverDidLoad.emit()},e.prototype.componentDidUnload=function(){this.ionPopoverDidUnload.emit()},e.prototype.onDismiss=function(e){e.stopPropagation(),e.preventDefault(),this.dismiss()},e.prototype.onBackdropTap=function(){this.dismiss(null,i.e)},e.prototype.lifecycle=function(e){var o=this.usersElement,t=v[e.type];if(o&&t){var n=new CustomEvent(t,{bubbles:!1,cancelable:!1,detail:e.detail});o.dispatchEvent(n)}},e.prototype.present=function(){return p(this,void 0,void 0,function(){var e,o,t;return s(this,function(n){switch(n.label){case 0:if(this.presented)return[2];if(!(e=this.el.querySelector(".popover-content")))throw new Error("container is undefined");return o=Object.assign({},this.componentProps,{popover:this.el}),t=this,[4,Object(r.a)(this.delegate,e,this.component,["popover-viewport"],o)];case 1:return t.usersElement=n.sent(),[2,Object(i.i)(this,"popoverEnter",l,u,this.event)]}})})},e.prototype.dismiss=function(e,o){return p(this,void 0,void 0,function(){return s(this,function(t){switch(t.label){case 0:return[4,Object(i.f)(this,e,o,"popoverLeave",d,f,this.event)];case 1:return t.sent(),[4,Object(r.b)(this.delegate,this.usersElement)];case 2:return t.sent(),[2]}})})},e.prototype.onDidDismiss=function(e){return Object(i.g)(this.el,"ionPopoverDidDismiss",e)},e.prototype.onWillDismiss=function(e){return Object(i.g)(this.el,"ionPopoverWillDismiss",e)},e.prototype.hostData=function(){var e=this.translucent?Object(a.a)(this.mode,"popover-translucent"):{};return{style:{zIndex:1e4+this.overlayId},"no-router":!0,class:Object.assign({},Object(a.a)(this.mode,"popover"),Object(a.e)(this.cssClass),e)}},e.prototype.render=function(){var e=Object(a.a)(this.mode,"popover-wrapper");return[Object(n.b)("ion-backdrop",{tappable:this.backdropDismiss}),Object(n.b)("div",{class:e},Object(n.b)("div",{class:"popover-arrow"}),Object(n.b)("div",{class:"popover-content"}))]},Object.defineProperty(e,"is",{get:function(){return"ion-popover"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"properties",{get:function(){return{animationCtrl:{connect:"ion-animation-controller"},backdropDismiss:{type:Boolean,attr:"backdrop-dismiss"},color:{type:String,attr:"color"},component:{type:String,attr:"component"},componentProps:{type:"Any",attr:"component-props"},config:{context:"config"},cssClass:{type:String,attr:"css-class"},delegate:{type:"Any",attr:"delegate"},dismiss:{method:!0},el:{elementRef:!0},enterAnimation:{type:"Any",attr:"enter-animation"},event:{type:"Any",attr:"event"},keyboardClose:{type:Boolean,attr:"keyboard-close"},leaveAnimation:{type:"Any",attr:"leave-animation"},mode:{type:String,attr:"mode"},onDidDismiss:{method:!0},onWillDismiss:{method:!0},overlayId:{type:Number,attr:"overlay-id"},present:{method:!0},showBackdrop:{type:Boolean,attr:"show-backdrop"},translucent:{type:Boolean,attr:"translucent"},willAnimate:{type:Boolean,attr:"will-animate"}}},enumerable:!0,configurable:!0}),Object.defineProperty(e,"events",{get:function(){return[{name:"ionPopoverDidLoad",method:"ionPopoverDidLoad",bubbles:!0,cancelable:!0,composed:!0},{name:"ionPopoverDidUnload",method:"ionPopoverDidUnload",bubbles:!0,cancelable:!0,composed:!0},{name:"ionPopoverDidPresent",method:"didPresent",bubbles:!0,cancelable:!0,composed:!0},{name:"ionPopoverWillPresent",method:"willPresent",bubbles:!0,cancelable:!0,composed:!0},{name:"ionPopoverWillDismiss",method:"willDismiss",bubbles:!0,cancelable:!0,composed:!0},{name:"ionPopoverDidDismiss",method:"didDismiss",bubbles:!0,cancelable:!0,composed:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(e,"listeners",{get:function(){return[{name:"ionDismiss",method:"onDismiss"},{name:"ionBackdropTap",method:"onBackdropTap"},{name:"ionPopoverDidPresent",method:"lifecycle"},{name:"ionPopoverWillPresent",method:"lifecycle"},{name:"ionPopoverWillDismiss",method:"lifecycle"},{name:"ionPopoverDidDismiss",method:"lifecycle"}]},enumerable:!0,configurable:!0}),Object.defineProperty(e,"style",{get:function(){return'ion-popover{left:0;right:0;top:0;bottom:0;display:-webkit-box;display:-ms-flexbox;display:flex;position:absolute;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;z-index:1000}.popover-wrapper{opacity:0;z-index:10}.popover-content{display:-webkit-box;display:-ms-flexbox;display:flex;position:absolute;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;overflow:auto;z-index:10}.popover-content ion-content{position:relative;contain:none}.popover-ios .popover-content{border-radius:10px;width:200px;min-width:0;min-height:0;max-height:90%;background-color:var(--ion-background-color,#fff);color:var(--ion-text-color,#000)}.popover-ios .popover-arrow{display:block;position:absolute;width:20px;height:10px;overflow:hidden}.popover-ios .popover-arrow::after{left:3px;top:3px;border-radius:3px;position:absolute;width:14px;height:14px;-webkit-transform:rotate(45deg);transform:rotate(45deg);background-color:var(--ion-background-color,#fff);content:"";z-index:10}.popover-ios.popover-bottom .popover-arrow{top:auto;bottom:-10px}.popover-ios.popover-bottom .popover-arrow::after{top:-6px}.popover-translucent-ios .popover-arrow::after,.popover-translucent-ios .popover-content{background:rgba(var(--ion-background-color-rgb,255,255,255),.8);-webkit-backdrop-filter:saturate(180%) blur(20px);backdrop-filter:saturate(180%) blur(20px)}'},enumerable:!0,configurable:!0}),Object.defineProperty(e,"styleMode",{get:function(){return"ios"},enumerable:!0,configurable:!0}),e}(),v={ionPopoverDidPresent:"ionViewDidEnter",ionPopoverWillPresent:"ionViewWillEnter",ionPopoverWillDismiss:"ionViewWillDismiss",ionPopoverDidDismiss:"ionViewDidDismiss"},y=function(){function e(){this.popovers=new Map}return e.prototype.popoverWillPresent=function(e){this.popovers.set(e.target.overlayId,e.target)},e.prototype.popoverWillDismiss=function(e){this.popovers.delete(e.target.overlayId)},e.prototype.escapeKeyUp=function(){Object(i.d)(this.popovers)},e.prototype.create=function(e){return Object(i.a)(this.doc.createElement("ion-popover"),e)},e.prototype.dismiss=function(e,o,t){return void 0===t&&(t=-1),Object(i.b)(e,o,this.popovers,t)},e.prototype.getTop=function(){return Object(i.c)(this.popovers)},Object.defineProperty(e,"is",{get:function(){return"ion-popover-controller"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"properties",{get:function(){return{create:{method:!0},dismiss:{method:!0},doc:{context:"document"},getTop:{method:!0}}},enumerable:!0,configurable:!0}),Object.defineProperty(e,"listeners",{get:function(){return[{name:"body:ionPopoverWillPresent",method:"popoverWillPresent"},{name:"body:ionPopoverWillDismiss",method:"popoverWillDismiss"},{name:"body:ionPopoverDidUnload",method:"popoverWillDismiss"},{name:"body:keyup.escape",method:"escapeKeyUp"}]},enumerable:!0,configurable:!0}),e}()}}]);