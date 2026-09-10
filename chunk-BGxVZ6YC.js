import{$t as kE,An as x,At as bI,D as Gf,Fn as yy,Ft as cp,Ht as fl,Jt as hh,Kt as hc,Ln as zI,Lt as dc,P as Ia,Pn as yh,Q as Ri,Sn as tE,St as _n,T as Fe,Ut as fr,Y as Qf,Yt as hp,Zt as ii,_t as YI,at as TI,b as EI,bn as sp,cn as oE,d as $y,et as SI,f as Ah,fn as pr,ft as Vl,ht as Xf,it as T,j as Hl,ln as op,lt as U$1,nn as lE,nt as Sn,ot as TP,p as Ao,pn as q,q as Q$1,qt as he,rn as lm,wn as uE,xn as sr,xt as _e,yt as ZI,z as Kn}from"./main-SQM5MYTH.js";import{C as Xe$1,D as ft$1,E as f,N as qe$1,T as an,a as Ct,c as Fn,d as Le,f as Li,k as hn,r as At,s as Fi,v as U$2,w as _n$1}from"./chunk-rbKXg8Q9.js";import{a as S}from"./chunk-CgEjF9RD.js";import{n as Ie}from"./chunk-51NxjFAd.js";import{a as Kt,c as W,f as gt$1,g as re$1,i as K,m as pe,n as B,o as M,r as Ht,s as Vt,t as $t,u as at$1}from"./chunk-BT3nv0Af.js";function at(i,o){}var g=class{viewContainerRef;injector;id;role=`dialog`;panelClass=``;hasBackdrop=!0;backdropClass=``;disableClose=!1;closePredicate;width=``;height=``;minWidth;minHeight;maxWidth;maxHeight;positionStrategy;data=null;direction;ariaDescribedBy=null;ariaLabelledBy=null;ariaLabel=null;ariaModal=!1;autoFocus=`first-tabbable`;restoreFocus=!0;scrollStrategy;closeOnNavigation=!0;closeOnDestroy=!0;closeOnOverlayDetachments=!0;disableAnimations=!1;providers;container;templateContext;bindings};var ne=(()=>{class i extends W{_elementRef=T(pr);_focusTrapFactory=T(hn);_config;_interactivityChecker=T(an);_ngZone=T(_e);_focusMonitor=T(At);_renderer=T(Ia);_changeDetectorRef=T(TP);_injector=T(he);_platform=T(f);_document=T(Kn);_portalOutlet;_focusTrapped=new Q$1;_focusTrap=null;_elementFocusedBeforeDialogWasOpened=null;_closeInteractionType=null;_ariaLabelledByQueue=[];_isDestroyed=!1;constructor(){super(),this._config=T(g,{optional:!0})||new g,this._config.ariaLabelledBy&&this._ariaLabelledByQueue.push(this._config.ariaLabelledBy)}_addAriaLabelledBy(e){this._ariaLabelledByQueue.push(e),this._changeDetectorRef.markForCheck()}_removeAriaLabelledBy(e){let t=this._ariaLabelledByQueue.indexOf(e);t>-1&&(this._ariaLabelledByQueue.splice(t,1),this._changeDetectorRef.markForCheck())}_contentAttached(){this._initializeFocusTrap(),this._captureInitialFocus()}_captureInitialFocus(){this._trapFocus()}ngOnDestroy(){this._focusTrapped.complete(),this._isDestroyed=!0,this._restoreFocus()}attachComponentPortal(e){this._portalOutlet.hasAttached();let t=this._portalOutlet.attachComponentPortal(e);return this._contentAttached(),t}attachTemplatePortal(e){this._portalOutlet.hasAttached();let t=this._portalOutlet.attachTemplatePortal(e);return this._contentAttached(),t}attachDomPortal=e=>{this._portalOutlet.hasAttached();let t=this._portalOutlet.attachDomPortal(e);return this._contentAttached(),t};_recaptureFocus(){this._containsFocus()||this._trapFocus()}_forceFocus(e,t){this._interactivityChecker.isFocusable(e)||(e.tabIndex=-1,this._ngZone.runOutsideAngular(()=>{let n=()=>{a(),l(),e.removeAttribute(`tabindex`)},a=this._renderer.listen(e,`blur`,n),l=this._renderer.listen(e,`mousedown`,n)})),e.focus(t)}_focusByCssSelector(e,t){let n=this._elementRef.nativeElement.querySelector(e);n&&this._forceFocus(n,t)}_trapFocus(e){this._isDestroyed||yy(()=>{let t=this._elementRef.nativeElement;switch(this._config.autoFocus){case!1:case`dialog`:this._containsFocus()||t.focus(e);break;case!0:case`first-tabbable`:this._focusTrap?.focusInitialElement(e)||this._focusDialogContainer(e);break;case`first-heading`:this._focusByCssSelector(`h1, h2, h3, h4, h5, h6, [role="heading"]`,e);break;default:this._focusByCssSelector(this._config.autoFocus,e);break}this._focusTrapped.next()},{injector:this._injector})}_restoreFocus(){let e=this._config.restoreFocus,t=null;if(typeof e==`string`?t=this._document.querySelector(e):typeof e==`boolean`?t=e?this._elementFocusedBeforeDialogWasOpened:null:e&&(t=e),this._config.restoreFocus&&t&&typeof t.focus==`function`){let n=Xe$1(),a=this._elementRef.nativeElement;(!n||n===this._document.body||n===a||a.contains(n))&&(this._focusMonitor?(this._focusMonitor.focusVia(t,this._closeInteractionType),this._closeInteractionType=null):t.focus())}this._focusTrap&&this._focusTrap.destroy()}_focusDialogContainer(e){this._elementRef.nativeElement.focus?.(e)}_containsFocus(){let e=this._elementRef.nativeElement,t=Xe$1();return e===t||e.contains(t)}_initializeFocusTrap(){this._platform.isBrowser&&(this._focusTrap=this._focusTrapFactory.create(this._elementRef.nativeElement),this._document&&(this._elementFocusedBeforeDialogWasOpened=Xe$1()))}static ɵfac=function(t){return new(t||i)};static ɵcmp=EI({type:i,selectors:[[`cdk-dialog-container`]],viewQuery:function(t,n){if(t&1&&cp(pe,7),t&2){let a;lE(a=uE())&&(n._portalOutlet=a.first)}},hostAttrs:[`tabindex`,`-1`,1,`cdk-dialog-container`],hostVars:6,hostBindings:function(t,n){t&2&&Xf(`id`,n._config.id||null)(`role`,n._config.role)(`aria-modal`,n._config.ariaModal)(`aria-labelledby`,n._config.ariaLabel?null:n._ariaLabelledByQueue[0])(`aria-label`,n._config.ariaLabel)(`aria-describedby`,n._config.ariaDescribedBy||null)},features:[Gf],decls:1,vars:0,consts:[[`cdkPortalOutlet`,``]],template:function(t,n){t&1&&Qf(0,at,0,0,`ng-template`,0)},dependencies:[pe],styles:[`.cdk-dialog-container {
  display: block;
  width: 100%;
  height: 100%;
  min-height: inherit;
  max-height: inherit;
}
`],encapsulation:2,changeDetection:1})}return i})();var b=class{overlayRef;config;componentInstance=null;componentRef=null;containerInstance;disableClose;closed=new Q$1;backdropClick;keydownEvents;outsidePointerEvents;id;_detachSubscription;constructor(o,e){this.overlayRef=o,this.config=e,this.disableClose=e.disableClose,this.backdropClick=o.backdropClick(),this.keydownEvents=o.keydownEvents(),this.outsidePointerEvents=o.outsidePointerEvents(),this.id=e.id,this.keydownEvents.subscribe(t=>{t.keyCode===27&&!this.disableClose&&!Le(t)&&(t.preventDefault(),this.close(void 0,{focusOrigin:`keyboard`}))}),this.backdropClick.subscribe(()=>{!this.disableClose&&this._canClose()?this.close(void 0,{focusOrigin:`mouse`}):this.containerInstance._recaptureFocus?.()}),this._detachSubscription=o.detachments().subscribe(()=>{e.closeOnOverlayDetachments!==!1&&this.close()})}close(o,e){if(this._canClose(o)){let t=this.closed;this.containerInstance._closeInteractionType=e?.focusOrigin||`program`,this._detachSubscription.unsubscribe(),this.overlayRef.dispose(),t.next(o),t.complete(),this.componentInstance=this.containerInstance=null}}updatePosition(){return this.overlayRef.updatePosition(),this}updateSize(o=``,e=``){return this.overlayRef.updateSize({width:o,height:e}),this}addPanelClass(o){return this.overlayRef.addPanelClass(o),this}removePanelClass(o){return this.overlayRef.removePanelClass(o),this}_canClose(o){let e=this.config;return!!this.containerInstance&&(!e.closePredicate||e.closePredicate(o,e,this.componentInstance))}};var rt=new x(`DialogScrollStrategy`,{providedIn:`root`,factory:()=>{let i=T(he);return()=>Ht(i)}});var st=new x(`DialogData`);var lt=new x(`DefaultDialogConfig`);function ct(i){let o=Ao(i),e=new Fe;return{valueSignal:o,get value(){return o()},change:e,ngOnDestroy(){e.complete()}}}var oe=(()=>{class i{_injector=T(he);_defaultOptions=T(lt,{optional:!0});_parentDialog=T(i,{optional:!0,skipSelf:!0});_overlayContainer=T(Kt);_idGenerator=T(Ct);_openDialogsAtThisLevel=[];_afterAllClosedAtThisLevel=new Q$1;_afterOpenedAtThisLevel=new Q$1;_ariaHiddenElements=new Map;_scrollStrategy=T(rt);get openDialogs(){return this._parentDialog?this._parentDialog.openDialogs:this._openDialogsAtThisLevel}get afterOpened(){return this._parentDialog?this._parentDialog.afterOpened:this._afterOpenedAtThisLevel}afterAllClosed=hh(()=>this.openDialogs.length?this._getAfterAllClosed():this._getAfterAllClosed().pipe(Ah(void 0)));open(e,t){t=U$1(U$1({},this._defaultOptions||new g),t),t.id=t.id||this._idGenerator.getId(`cdk-dialog-`),t.id&&this.getDialogById(t.id);let a=this._getOverlayConfig(t),l=gt$1(this._injector,a),s=new b(l,t),c=this._attachContainer(l,s,t);if(s.containerInstance=c,!this.openDialogs.length){let u=this._overlayContainer.getContainerElement();c._focusTrapped?c._focusTrapped.pipe(Ri(1)).subscribe(()=>{this._hideNonDialogContentFromAssistiveTechnology(u)}):this._hideNonDialogContentFromAssistiveTechnology(u)}return this._attachDialogContent(e,s,c,t),this.openDialogs.push(s),s.closed.subscribe(()=>this._removeOpenDialog(s,!0)),this.afterOpened.next(s),s}closeAll(){ie(this.openDialogs,e=>e.close())}getDialogById(e){return this.openDialogs.find(t=>t.id===e)}ngOnDestroy(){ie(this._openDialogsAtThisLevel,e=>{e.config.closeOnDestroy===!1&&this._removeOpenDialog(e,!1)}),ie(this._openDialogsAtThisLevel,e=>e.close()),this._afterAllClosedAtThisLevel.complete(),this._afterOpenedAtThisLevel.complete(),this._openDialogsAtThisLevel=[]}_getOverlayConfig(e){let t=new B({positionStrategy:e.positionStrategy||$t().centerHorizontally().centerVertically(),scrollStrategy:e.scrollStrategy||this._scrollStrategy(),panelClass:e.panelClass,hasBackdrop:e.hasBackdrop,direction:e.direction,minWidth:e.minWidth,minHeight:e.minHeight,maxWidth:e.maxWidth,maxHeight:e.maxHeight,width:e.width,height:e.height,disposeOnNavigation:e.closeOnNavigation,disableAnimations:e.disableAnimations});return e.backdropClass&&(t.backdropClass=e.backdropClass),t}_attachContainer(e,t,n){let a=n.injector||n.viewContainerRef?.injector,l=[{provide:g,useValue:n},{provide:b,useValue:t},{provide:K,useValue:e}],s;n.container?typeof n.container==`function`?s=n.container:(s=n.container.type,l.push(...n.container.providers(n))):s=ne;let c=new at$1(s,n.viewContainerRef,he.create({parent:a||this._injector,providers:l}));return e.attach(c).instance}_attachDialogContent(e,t,n,a){if(e instanceof sr){let l=this._createInjector(a,t,n,void 0),s={$implicit:a.data,dialogRef:t};a.templateContext&&(s=U$1(U$1({},s),typeof a.templateContext==`function`?a.templateContext():a.templateContext)),n.attachTemplatePortal(new M(e,null,s,l))}else{let l=this._createInjector(a,t,n,this._injector),s=n.attachComponentPortal(new at$1(e,a.viewContainerRef,l,null,a.bindings));t.componentRef=s,t.componentInstance=s.instance}}_createInjector(e,t,n,a){let l=e.injector||e.viewContainerRef?.injector,s=[{provide:st,useValue:e.data},{provide:b,useValue:t}];return e.providers&&(typeof e.providers==`function`?s.push(...e.providers(t,e,n)):s.push(...e.providers)),e.direction&&(!l||!l.get(Fn,null,{optional:!0}))&&s.push({provide:Fn,useValue:ct(e.direction)}),he.create({parent:l||a,providers:s})}_removeOpenDialog(e,t){let n=this.openDialogs.indexOf(e);n>-1&&(this.openDialogs.splice(n,1),this.openDialogs.length||(this._ariaHiddenElements.forEach((a,l)=>{a?l.setAttribute(`aria-hidden`,a):l.removeAttribute(`aria-hidden`)}),this._ariaHiddenElements.clear(),t&&this._getAfterAllClosed().next()))}_hideNonDialogContentFromAssistiveTechnology(e){if(e.parentElement){let t=e.parentElement.children;for(let n=t.length-1;n>-1;n--){let a=t[n];a!==e&&a.nodeName!==`SCRIPT`&&a.nodeName!==`STYLE`&&!a.hasAttribute(`aria-live`)&&!a.hasAttribute(`popover`)&&(this._ariaHiddenElements.set(a,a.getAttribute(`aria-hidden`)),a.setAttribute(`aria-hidden`,`true`))}}}_getAfterAllClosed(){let e=this._parentDialog;return e?e._getAfterAllClosed():this._afterAllClosedAtThisLevel}static ɵfac=function(t){return new(t||i)};static ɵprov=fr({token:i,factory:i.ɵfac})}return i})();function ie(i,o){let e=i.length;for(;e--;)o(i[e])}var Qe=(()=>{class i{static ɵfac=function(t){return new(t||i)};static ɵmod=TI({type:i});static ɵinj=fl({providers:[oe],imports:[re$1,Vt,_n$1,Vt]})}return i})();function dt(i,o){}var U=class{viewContainerRef;injector;id;role=`dialog`;panelClass=``;hasBackdrop=!0;backdropClass=``;disableClose=!1;closePredicate;width=``;height=``;minWidth;minHeight;maxWidth;maxHeight;position;data=null;direction;ariaDescribedBy=null;ariaLabelledBy=null;ariaLabel=null;ariaModal=!1;autoFocus=`first-tabbable`;restoreFocus=!0;delayFocusTrap=!0;scrollStrategy;closeOnNavigation=!0;enterAnimationDuration;exitAnimationDuration;bindings};var ae=`mdc-dialog--open`;var Ue=`mdc-dialog--opening`;var qe=`mdc-dialog--closing`;var mt=150;var ut=75;var ht=(()=>{class i extends ne{_animationStateChanged=new Fe;_animationsEnabled=!U$2();_actionSectionCount=0;_hostElement=this._elementRef.nativeElement;_enterAnimationDuration=this._animationsEnabled?Ze(this._config.enterAnimationDuration)??mt:0;_exitAnimationDuration=this._animationsEnabled?Ze(this._config.exitAnimationDuration)??ut:0;_animationTimer=null;_contentAttached(){super._contentAttached(),this._startOpenAnimation()}_startOpenAnimation(){this._animationStateChanged.emit({state:`opening`,totalTime:this._enterAnimationDuration}),this._animationsEnabled?(this._hostElement.style.setProperty(Ye,`${this._enterAnimationDuration}ms`),this._requestAnimationFrame(()=>this._hostElement.classList.add(Ue,ae)),this._waitForAnimationToComplete(this._enterAnimationDuration,this._finishDialogOpen)):(this._hostElement.classList.add(ae),Promise.resolve().then(()=>this._finishDialogOpen()))}_startExitAnimation(){this._animationStateChanged.emit({state:`closing`,totalTime:this._exitAnimationDuration}),this._hostElement.classList.remove(ae),this._animationsEnabled?(this._hostElement.style.setProperty(Ye,`${this._exitAnimationDuration}ms`),this._requestAnimationFrame(()=>this._hostElement.classList.add(qe)),this._waitForAnimationToComplete(this._exitAnimationDuration,this._finishDialogClose)):Promise.resolve().then(()=>this._finishDialogClose())}_updateActionSectionCount(e){this._actionSectionCount+=e,this._changeDetectorRef.markForCheck()}_finishDialogOpen=()=>{this._clearAnimationClasses(),this._openAnimationDone(this._enterAnimationDuration)};_finishDialogClose=()=>{this._clearAnimationClasses(),this._animationStateChanged.emit({state:`closed`,totalTime:this._exitAnimationDuration})};_clearAnimationClasses(){this._hostElement.classList.remove(Ue,qe)}_waitForAnimationToComplete(e,t){this._animationTimer!==null&&clearTimeout(this._animationTimer),this._animationTimer=setTimeout(t,e)}_requestAnimationFrame(e){this._ngZone.runOutsideAngular(()=>{typeof requestAnimationFrame==`function`?requestAnimationFrame(e):e()})}_captureInitialFocus(){this._config.delayFocusTrap||this._trapFocus()}_openAnimationDone(e){this._config.delayFocusTrap&&this._trapFocus(),this._animationStateChanged.next({state:`opened`,totalTime:e})}ngOnDestroy(){super.ngOnDestroy(),this._animationTimer!==null&&clearTimeout(this._animationTimer)}attachComponentPortal(e){let t=super.attachComponentPortal(e);return t.location.nativeElement.classList.add(`mat-mdc-dialog-component-host`),t}static ɵfac=(()=>{let e;return function(n){return(e||(e=lm(i)))(n||i)}})();static ɵcmp=EI({type:i,selectors:[[`mat-dialog-container`]],hostAttrs:[`tabindex`,`-1`,1,`mat-mdc-dialog-container`,`mdc-dialog`],hostVars:10,hostBindings:function(t,n){t&2&&(op(`id`,n._config.id),Xf(`aria-modal`,n._config.ariaModal)(`role`,n._config.role)(`aria-labelledby`,n._config.ariaLabel?null:n._ariaLabelledByQueue[0])(`aria-label`,n._config.ariaLabel)(`aria-describedby`,n._config.ariaDescribedBy||null),hp(`_mat-animation-noopable`,!n._animationsEnabled)(`mat-mdc-dialog-container-with-actions`,n._actionSectionCount>0))},features:[Gf],decls:3,vars:0,consts:[[1,`mat-mdc-dialog-inner-container`,`mdc-dialog__container`],[1,`mat-mdc-dialog-surface`,`mdc-dialog__surface`],[`cdkPortalOutlet`,``]],template:function(t,n){t&1&&(ii(0,`div`,0)(1,`div`,1),Qf(2,dt,0,0,`ng-template`,2),dc()())},dependencies:[pe],styles:[`.mat-mdc-dialog-container {
  width: 100%;
  height: 100%;
  display: block;
  box-sizing: border-box;
  max-height: inherit;
  min-height: inherit;
  min-width: inherit;
  max-width: inherit;
  outline: 0;
}

.cdk-overlay-pane.mat-mdc-dialog-panel {
  max-width: var(--%NS%mat-dialog-container-max-width, 560px);
  min-width: var(--%NS%mat-dialog-container-min-width, 280px);
}
@media (max-width: 599px) {
  .cdk-overlay-pane.mat-mdc-dialog-panel {
    max-width: var(--%NS%mat-dialog-container-small-max-width, calc(100vw - 32px));
  }
}

.mat-mdc-dialog-inner-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  box-sizing: border-box;
  height: 100%;
  opacity: 0;
  transition: opacity linear var(--%NS%mat-dialog-transition-duration, 0ms);
  max-height: inherit;
  min-height: inherit;
  min-width: inherit;
  max-width: inherit;
}
.mdc-dialog--closing .mat-mdc-dialog-inner-container {
  transition: opacity 75ms linear;
  transform: none;
}
.mdc-dialog--open .mat-mdc-dialog-inner-container {
  opacity: 1;
}
._mat-animation-noopable .mat-mdc-dialog-inner-container {
  transition: none;
}

.mat-mdc-dialog-surface {
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  position: relative;
  overflow-y: auto;
  outline: 0;
  transform: scale(0.8);
  transition: transform var(--%NS%mat-dialog-transition-duration, 0ms) cubic-bezier(0, 0, 0.2, 1);
  max-height: inherit;
  min-height: inherit;
  min-width: inherit;
  max-width: inherit;
  box-shadow: var(--%NS%mat-dialog-container-elevation-shadow, none);
  border-radius: var(--%NS%mat-dialog-container-shape, var(--%NS%mat-sys-corner-extra-large, 4px));
  background-color: var(--%NS%mat-dialog-container-color, var(--%NS%mat-sys-surface, white));
}
[dir=rtl] .mat-mdc-dialog-surface {
  text-align: right;
}
.mdc-dialog--open .mat-mdc-dialog-surface, .mdc-dialog--closing .mat-mdc-dialog-surface {
  transform: none;
}
._mat-animation-noopable .mat-mdc-dialog-surface {
  transition: none;
}
.mat-mdc-dialog-surface::before {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 2px solid transparent;
  border-radius: inherit;
  content: "";
  pointer-events: none;
}

.mat-mdc-dialog-title {
  display: block;
  position: relative;
  flex-shrink: 0;
  box-sizing: border-box;
  margin: 0 0 1px;
  padding: var(--%NS%mat-dialog-headline-padding, 6px 24px 13px);
}
.mat-mdc-dialog-title::before {
  display: inline-block;
  width: 0;
  height: 40px;
  content: "";
  vertical-align: 0;
}
[dir=rtl] .mat-mdc-dialog-title {
  text-align: right;
}
.mat-mdc-dialog-container .mat-mdc-dialog-title {
  color: var(--%NS%mat-dialog-subhead-color, var(--%NS%mat-sys-on-surface, rgba(0, 0, 0, 0.87)));
  font-family: var(--%NS%mat-dialog-subhead-font, var(--%NS%mat-sys-headline-small-font, inherit));
  line-height: var(--%NS%mat-dialog-subhead-line-height, var(--%NS%mat-sys-headline-small-line-height, 1.5rem));
  font-size: var(--%NS%mat-dialog-subhead-size, var(--%NS%mat-sys-headline-small-size, 1rem));
  font-weight: var(--%NS%mat-dialog-subhead-weight, var(--%NS%mat-sys-headline-small-weight, 400));
  letter-spacing: var(--%NS%mat-dialog-subhead-tracking, var(--%NS%mat-sys-headline-small-tracking, 0.03125em));
}

.mat-mdc-dialog-content {
  display: block;
  flex-grow: 1;
  box-sizing: border-box;
  margin: 0;
  overflow: auto;
  max-height: 65vh;
}
.mat-mdc-dialog-content > :first-child {
  margin-top: 0;
}
.mat-mdc-dialog-content > :last-child {
  margin-bottom: 0;
}
.mat-mdc-dialog-container .mat-mdc-dialog-content {
  color: var(--%NS%mat-dialog-supporting-text-color, var(--%NS%mat-sys-on-surface-variant, rgba(0, 0, 0, 0.6)));
  font-family: var(--%NS%mat-dialog-supporting-text-font, var(--%NS%mat-sys-body-medium-font, inherit));
  line-height: var(--%NS%mat-dialog-supporting-text-line-height, var(--%NS%mat-sys-body-medium-line-height, 1.5rem));
  font-size: var(--%NS%mat-dialog-supporting-text-size, var(--%NS%mat-sys-body-medium-size, 1rem));
  font-weight: var(--%NS%mat-dialog-supporting-text-weight, var(--%NS%mat-sys-body-medium-weight, 400));
  letter-spacing: var(--%NS%mat-dialog-supporting-text-tracking, var(--%NS%mat-sys-body-medium-tracking, 0.03125em));
}
.mat-mdc-dialog-container .mat-mdc-dialog-content {
  padding: var(--%NS%mat-dialog-content-padding, 20px 24px);
}
.mat-mdc-dialog-container-with-actions .mat-mdc-dialog-content {
  padding: var(--%NS%mat-dialog-with-actions-content-padding, 20px 24px 0);
}
.mat-mdc-dialog-container .mat-mdc-dialog-title + .mat-mdc-dialog-content {
  padding-top: 0;
}

.mat-mdc-dialog-actions {
  display: flex;
  position: relative;
  flex-shrink: 0;
  flex-wrap: wrap;
  align-items: center;
  box-sizing: border-box;
  min-height: 52px;
  margin: 0;
  border-top: 1px solid transparent;
  padding: var(--%NS%mat-dialog-actions-padding, 16px 24px);
  justify-content: var(--%NS%mat-dialog-actions-alignment, flex-end);
}
@media (forced-colors: active) {
  .mat-mdc-dialog-actions {
    border-top-color: CanvasText;
  }
}
.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-start, .mat-mdc-dialog-actions[align=start] {
  justify-content: start;
}
.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-center, .mat-mdc-dialog-actions[align=center] {
  justify-content: center;
}
.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-end, .mat-mdc-dialog-actions[align=end] {
  justify-content: flex-end;
}
.mat-mdc-dialog-actions .mat-button-base + .mat-button-base,
.mat-mdc-dialog-actions .mat-mdc-button-base + .mat-mdc-button-base {
  margin-left: 8px;
}
[dir=rtl] .mat-mdc-dialog-actions .mat-button-base + .mat-button-base,
[dir=rtl] .mat-mdc-dialog-actions .mat-mdc-button-base + .mat-mdc-button-base {
  margin-left: 0;
  margin-right: 8px;
}

.mat-mdc-dialog-component-host {
  display: contents;
}
`],encapsulation:2,changeDetection:1})}return i})();var Ye=`--mat-dialog-transition-duration`;function Ze(i){return i==null?null:typeof i==`number`?i:i.endsWith(`ms`)?qe$1(i.substring(0,i.length-2)):i.endsWith(`s`)?qe$1(i.substring(0,i.length-1))*1e3:i===`0`?0:null}var Q=(function(i){return i[i.OPEN=0]=`OPEN`,i[i.CLOSING=1]=`CLOSING`,i[i.CLOSED=2]=`CLOSED`,i})(Q||{});var A=class{_ref;_config;_containerInstance;componentInstance;componentRef=null;disableClose;id;_afterOpened=new _n(1);_beforeClosed=new _n(1);_result;_closeFallbackTimeout;_state=Q.OPEN;_closeInteractionType;constructor(o,e,t){this._ref=o,this._config=e,this._containerInstance=t,this.disableClose=e.disableClose,this.id=o.id,o.addPanelClass(`mat-mdc-dialog-panel`),t._animationStateChanged.pipe(Sn(n=>n.state===`opened`),Ri(1)).subscribe(()=>{this._afterOpened.next(),this._afterOpened.complete()}),t._animationStateChanged.pipe(Sn(n=>n.state===`closed`),Ri(1)).subscribe(()=>{clearTimeout(this._closeFallbackTimeout),this._finishDialogClose()}),o.overlayRef.detachments().subscribe(()=>{this._beforeClosed.next(this._result),this._beforeClosed.complete(),this._finishDialogClose()}),yh(this.backdropClick(),this.keydownEvents().pipe(Sn(n=>n.keyCode===27&&!this.disableClose&&!Le(n)))).subscribe(n=>{this.disableClose||(n.preventDefault(),pt(this,n.type===`keydown`?`keyboard`:`mouse`))})}close(o){let e=this._config.closePredicate;e&&!e(o,this._config,this.componentInstance)||(this._result=o,this._containerInstance._animationStateChanged.pipe(Sn(t=>t.state===`closing`),Ri(1)).subscribe(t=>{this._beforeClosed.next(o),this._beforeClosed.complete(),this._ref.overlayRef.detachBackdrop(),this._closeFallbackTimeout=setTimeout(()=>this._finishDialogClose(),t.totalTime+100)}),this._state=Q.CLOSING,this._containerInstance._startExitAnimation())}afterOpened(){return this._afterOpened}afterClosed(){return this._ref.closed}beforeClosed(){return this._beforeClosed}backdropClick(){return this._ref.backdropClick}keydownEvents(){return this._ref.keydownEvents}updatePosition(o){let e=this._ref.config.positionStrategy;return o&&(o.left||o.right)?o.left?e.left(o.left):e.right(o.right):e.centerHorizontally(),o&&(o.top||o.bottom)?o.top?e.top(o.top):e.bottom(o.bottom):e.centerVertically(),this._ref.updatePosition(),this}updateSize(o=``,e=``){return this._ref.updateSize(o,e),this}addPanelClass(o){return this._ref.addPanelClass(o),this}removePanelClass(o){return this._ref.removePanelClass(o),this}getState(){return this._state}_finishDialogClose(){this._state=Q.CLOSED,this._ref.close(this._result,{focusOrigin:this._closeInteractionType}),this.componentInstance=null}};function pt(i,o,e){return i._closeInteractionType=o,i.close(e)}var re=new x(`MatMdcDialogData`);var gt=new x(`mat-mdc-dialog-default-options`);var ft=new x(`mat-mdc-dialog-scroll-strategy`,{providedIn:`root`,factory:()=>{let i=T(he);return()=>Ht(i)}});var Ke=(()=>{class i{_defaultOptions=T(gt,{optional:!0});_scrollStrategy=T(ft);_parentDialog=T(i,{optional:!0,skipSelf:!0});_idGenerator=T(Ct);_injector=T(he);_dialog=T(oe);_animationsDisabled=U$2();_openDialogsAtThisLevel=[];_afterAllClosedAtThisLevel=new Q$1;_afterOpenedAtThisLevel=new Q$1;dialogConfigClass=U;_dialogRefConstructor;_dialogContainerType;_dialogDataToken;get openDialogs(){return this._parentDialog?this._parentDialog.openDialogs:this._openDialogsAtThisLevel}get afterOpened(){return this._parentDialog?this._parentDialog.afterOpened:this._afterOpenedAtThisLevel}_getAfterAllClosed(){let e=this._parentDialog;return e?e._getAfterAllClosed():this._afterAllClosedAtThisLevel}afterAllClosed=hh(()=>this.openDialogs.length?this._getAfterAllClosed():this._getAfterAllClosed().pipe(Ah(void 0)));constructor(){this._dialogRefConstructor=A,this._dialogContainerType=ht,this._dialogDataToken=re}open(e,t){let n;t=U$1(U$1({},this._defaultOptions||new U),t),t.id=t.id||this._idGenerator.getId(`mat-mdc-dialog-`),t.scrollStrategy=t.scrollStrategy||this._scrollStrategy();let a=this._dialog.open(e,q(U$1({},t),{positionStrategy:$t(this._injector).centerHorizontally().centerVertically(),disableClose:!0,closePredicate:void 0,closeOnDestroy:!1,closeOnOverlayDetachments:!1,disableAnimations:this._animationsDisabled||t.enterAnimationDuration?.toLocaleString()===`0`||t.exitAnimationDuration?.toString()===`0`,container:{type:this._dialogContainerType,providers:()=>[{provide:this.dialogConfigClass,useValue:t},{provide:g,useValue:t}]},templateContext:()=>({dialogRef:n}),providers:(l,s,c)=>(n=new this._dialogRefConstructor(l,t,c),n.updatePosition(t?.position),[{provide:this._dialogContainerType,useValue:c},{provide:this._dialogDataToken,useValue:s.data},{provide:this._dialogRefConstructor,useValue:n},{provide:b,useValue:null}])}));return n.componentRef=a.componentRef,n.componentInstance=a.componentInstance,this.openDialogs.push(n),this.afterOpened.next(n),n.afterClosed().subscribe(()=>{let l=this.openDialogs.indexOf(n);l>-1&&(this.openDialogs.splice(l,1),this.openDialogs.length||this._getAfterAllClosed().next())}),n}closeAll(){this._closeDialogs(this.openDialogs)}getDialogById(e){return this.openDialogs.find(t=>t.id===e)}ngOnDestroy(){this._closeDialogs(this._openDialogsAtThisLevel),this._afterAllClosedAtThisLevel.complete(),this._afterOpenedAtThisLevel.complete()}_closeDialogs(e){let t=e.length;for(;t--;)e[t].close()}static ɵfac=function(t){return new(t||i)};static ɵprov=fr({token:i,factory:i.ɵfac})}return i})();var Xe=(()=>{class i{_dialogRef=T(A,{optional:!0});_elementRef=T(pr);_dialog=T(Ke);ngOnInit(){this._dialogRef||(this._dialogRef=_t(this._elementRef,this._dialog.openDialogs)),this._dialogRef&&Promise.resolve().then(()=>{this._onAdd()})}ngOnDestroy(){this._dialogRef?._containerInstance&&Promise.resolve().then(()=>{this._onRemove()})}static ɵfac=function(t){return new(t||i)};static ɵdir=bI({type:i})}return i})();var Je=(()=>{class i extends Xe{id=T(Ct).getId(`mat-mdc-dialog-title-`);_onAdd(){this._dialogRef._containerInstance?._addAriaLabelledBy?.(this.id)}_onRemove(){this._dialogRef?._containerInstance?._removeAriaLabelledBy?.(this.id)}static ɵfac=(()=>{let e;return function(n){return(e||(e=lm(i)))(n||i)}})();static ɵdir=bI({type:i,selectors:[[``,`mat-dialog-title`,``],[``,`matDialogTitle`,``]],hostAttrs:[1,`mat-mdc-dialog-title`,`mdc-dialog__title`],hostVars:1,hostBindings:function(t,n){t&2&&op(`id`,n.id)},inputs:{id:`id`},exportAs:[`matDialogTitle`],features:[Gf]})}return i})();var et=(()=>{class i{static ɵfac=function(t){return new(t||i)};static ɵdir=bI({type:i,selectors:[[``,`mat-dialog-content`,``],[`mat-dialog-content`],[``,`matDialogContent`,``]],hostAttrs:[1,`mat-mdc-dialog-content`,`mdc-dialog__content`],features:[SI([Ie])]})}return i})();var tt=(()=>{class i extends Xe{align;_onAdd(){this._dialogRef._containerInstance?._updateActionSectionCount?.(1)}_onRemove(){this._dialogRef._containerInstance?._updateActionSectionCount?.(-1)}static ɵfac=(()=>{let e;return function(n){return(e||(e=lm(i)))(n||i)}})();static ɵdir=bI({type:i,selectors:[[``,`mat-dialog-actions`,``],[`mat-dialog-actions`],[``,`matDialogActions`,``]],hostAttrs:[1,`mat-mdc-dialog-actions`,`mdc-dialog__actions`],hostVars:6,hostBindings:function(t,n){t&2&&hp(`mat-mdc-dialog-actions-align-start`,n.align===`start`)(`mat-mdc-dialog-actions-align-center`,n.align===`center`)(`mat-mdc-dialog-actions-align-end`,n.align===`end`)},inputs:{align:`align`},features:[Gf]})}return i})();function _t(i,o){let e=i.nativeElement.parentElement;for(;e&&!e.classList.contains(`mat-mdc-dialog-container`);)e=e.parentElement;return e?o.find(t=>t.id===e.id):null}var it=(()=>{class i{static ɵfac=function(t){return new(t||i)};static ɵmod=TI({type:i});static ɵinj=fl({providers:[Ke],imports:[Qe,re$1,Vt,ft$1]})}return i})();function yt(i,o){if(i&1){let e=tE();ii(0,`button`,6),sp(`click`,function(){let n=Vl(e).$index;return Hl(oE().selectLetter(n))}),kE(1),dc()}if(i&2){let e=o.$implicit,t=o.$index,n=oE();hp(`letter-picker__choice--current`,t===n.data.currentIndex),Xf(`aria-selected`,t===n.data.currentIndex),$y(),hc(` `,e,` `)}}var nt=class i{dialogRef=T(A);data=T(re);selectLetter(o){this.dialogRef.close(o)}close(){this.dialogRef.close()}static ɵfac=function(e){return new(e||i)};static ɵcmp=EI({type:i,selectors:[[`app-letter-picker-dialog`]],decls:9,vars:0,consts:[[`mat-dialog-title`,``,1,`letter-picker__title`],[1,`letter-picker__content`],[`role`,`listbox`,`aria-label`,`Список букв`,1,`letter-picker__grid`],[`type`,`button`,1,`letter-picker__choice`,3,`letter-picker__choice--current`],[`align`,`end`],[`mat-stroked-button`,``,`type`,`button`,3,`click`],[`type`,`button`,1,`letter-picker__choice`,3,`click`]],template:function(e,t){e&1&&(ii(0,`h2`,0),kE(1,`Выбери букву`),dc(),ii(2,`mat-dialog-content`,1)(3,`div`,2),ZI(4,yt,2,4,`button`,3,zI),dc()(),ii(6,`mat-dialog-actions`,4)(7,`button`,5),sp(`click`,function(){return t.close()}),kE(8,`Закрыть`),dc()()),e&2&&($y(4),YI(t.data.letters))},dependencies:[it,Je,tt,et,Li,Fi],styles:[`.letter-picker__title[_ngcontent-%COMP%]{margin:0;font-size:clamp(1.25rem,4vw,1.5rem);font-weight:800;color:var(--%NS%wp-heading);text-align:center}.letter-picker__content[_ngcontent-%COMP%]{padding-top:.25rem!important}.letter-picker__grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fill,minmax(2.75rem,1fr));gap:.55rem}.letter-picker__choice[_ngcontent-%COMP%]{display:inline-flex;align-items:center;justify-content:center;aspect-ratio:1;min-height:2.75rem;padding:0;border:2px solid var(--%NS%wp-border);border-radius:.7rem;background:#fff;color:var(--%NS%wp-heading);font-size:clamp(1rem,3.5vw,1.2rem);font-weight:800;line-height:1;cursor:pointer;transition:transform .15s ease,border-color .15s ease,background-color .15s ease,box-shadow .15s ease,color .15s ease}.letter-picker__choice[_ngcontent-%COMP%]:hover:not(.letter-picker__choice--current){transform:translateY(-1px);border-color:var(--%NS%wp-purple);background:var(--%NS%wp-purple-soft)}.letter-picker__choice--current[_ngcontent-%COMP%]{border-color:transparent;background:var(--%NS%wp-purple);color:#fff;box-shadow:0 3px 10px #8b6fc047}.letter-picker__choice--%NS%current[_ngcontent-%COMP%]:hover{transform:translateY(-1px);background:var(--%NS%wp-purple-deep);box-shadow:0 4px 14px #8b6fc057}@media(prefers-reduced-motion:reduce){.letter-picker__choice[_ngcontent-%COMP%]{transition:none}}`]})};var se=[{id:`black`,color:`#4a4560`,label:`Чёрный`},{id:`red`,color:`#f0a0a0`,label:`Красный`},{id:`pink`,color:`#f5a8c8`,label:`Розовый`},{id:`lilac`,color:`#b49fd4`,label:`Сиреневый`},{id:`mint`,color:`#7bc89a`,label:`Мятный`},{id:`sky`,color:`#7eb8dc`,label:`Голубой`},{id:`peach`,color:`#ffb88a`,label:`Персиковый`},{id:`yellow`,color:`#f5dfa0`,label:`Жёлтый`},{id:`teal`,color:`#8ed4c8`,label:`Бирюзовый`}];var yi=.97;var vi=.98;function vt(){return se[Math.floor(Math.random()*se.length)].color}function Ci(i){return se.find(o=>o.color===i)?.id}function Di(i,o){let e=i.replace(`#`,``);return`rgba(${Number.parseInt(e.slice(0,2),16)}, ${Number.parseInt(e.slice(2,4),16)}, ${Number.parseInt(e.slice(4,6),16)}, ${o})`}function Ai(i){return S(i).map(o=>({letter:o.label,sampleWord:o.label,guideColor:vt()}))}function xi(i,o,e,t){return ot(i,o,e,t,128)}function ki(i,o,e,t){return ot(i,o,e,t)}function ot(i,o,e,t,n=16){let a=o.getImageData(0,0,e,t).data,l=i.getImageData(0,0,e,t).data,s=0,c=0;for(let u=3;u<a.length;u+=4)a[u]>=n&&(s+=1,l[u]>16&&(c+=1));return s===0?0:c/s}export{ki as a,vi as c,Ke as i,xi as l,Ci as n,nt as o,Di as r,se as s,Ai as t,yi as u};