import{Bt as fE,Dt as ap,E as GI,Et as ao,It as cp,Nn as xp,Qt as ii,Rt as dc,T as Fe,Tn as uE,Ut as fl,Xt as hp,at as T,b as EI,bn as se,d as $y,gt as Xf,h as CP,ht as WI,jn as x,jt as bI,ln as oE,m as BE,ot as TI,p as Ao,pn as pr,rn as lE,st as TP,wn as tp,wt as aE,xn as sp,yn as sE,zt as ep}from"./main-GBGHIN67.js";import{D as ft$1,M as oi,S as We,a as Ct,c as Fn,d as Le,h as O,n as $e,r as At,v as U}from"./chunk-KcuVqNTo.js";import{a as Pe,c as fe,i as En}from"./chunk-Cfe_KCVL.js";import{a as p}from"./chunk-CkcqC1PA.js";var ht=[`button`];var mt=[`*`];function vt(a,o){if(a&1&&(ii(0,`div`,2),tp(1,`mat-pseudo-checkbox`,6),dc()),a&2){let t=oE();$y(),ep(`disabled`,t.disabled)}}var nt=new x(`MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS`,{providedIn:`root`,factory:()=>({hideSingleSelectionIndicator:!1,hideMultipleSelectionIndicator:!1,disabledInteractive:!1})});var ot=new x(`MatButtonToggleGroup`);var ft={provide:Pe,useExisting:ao(()=>_t),multi:!0};var m=class{source;value;constructor(o,t){this.source=o,this.value=t}};var _t=(()=>{class a{_changeDetector=T(TP);_dir=T(Fn,{optional:!0});_multiple=!1;_disabled=!1;_disabledInteractive=!1;_selectionModel;_rawValue;_controlValueAccessorChangeFn=()=>{};_onTouched=()=>{};_buttonToggles;appearance;get name(){return this._name}set name(t){this._name=t,this._markButtonsForCheck()}_name=T(Ct).getId(`mat-button-toggle-group-`);vertical=!1;get value(){let t=this._selectionModel?this._selectionModel.selected:[];return this.multiple?t.map(e=>e.value):t[0]?t[0].value:void 0}set value(t){this._setSelectionByValue(t),this.valueChange.emit(this.value)}valueChange=new Fe;get selected(){let t=this._selectionModel?this._selectionModel.selected:[];return this.multiple?t:t[0]||null}get multiple(){return this._multiple}set multiple(t){this._multiple=t,this._markButtonsForCheck()}get disabled(){return this._disabled}set disabled(t){this._disabled=t,this._markButtonsForCheck()}get disabledInteractive(){return this._disabledInteractive}set disabledInteractive(t){this._disabledInteractive=t,this._markButtonsForCheck()}get dir(){return this._dir&&this._dir.value===`rtl`?`rtl`:`ltr`}change=new Fe;get hideSingleSelectionIndicator(){return this._hideSingleSelectionIndicator}set hideSingleSelectionIndicator(t){this._hideSingleSelectionIndicator=t,this._markButtonsForCheck()}_hideSingleSelectionIndicator;get hideMultipleSelectionIndicator(){return this._hideMultipleSelectionIndicator}set hideMultipleSelectionIndicator(t){this._hideMultipleSelectionIndicator=t,this._markButtonsForCheck()}_hideMultipleSelectionIndicator;constructor(){let t=T(nt,{optional:!0});this.appearance=t&&t.appearance?t.appearance:`standard`,this._hideSingleSelectionIndicator=t?.hideSingleSelectionIndicator??!1,this._hideMultipleSelectionIndicator=t?.hideMultipleSelectionIndicator??!1}ngOnInit(){this._selectionModel=new fe(this.multiple,void 0,!1)}ngAfterContentInit(){this._selectionModel.select(...this._buttonToggles.filter(t=>t.checked)),this.multiple||this._initializeTabIndex()}writeValue(t){this.value=t,this._changeDetector.markForCheck()}registerOnChange(t){this._controlValueAccessorChangeFn=t}registerOnTouched(t){this._onTouched=t}setDisabledState(t){this.disabled=t}_keydown(t){if(this.multiple||this.disabled||Le(t))return;let n=t.target.id,i=this._buttonToggles.toArray().findIndex(c=>c.buttonId===n),r=null;switch(t.keyCode){case 32:case 13:r=this._buttonToggles.get(i)||null;break;case 38:r=this._getNextButton(i,-1);break;case 37:r=this._getNextButton(i,this.dir===`ltr`?-1:1);break;case 40:r=this._getNextButton(i,1);break;case 39:r=this._getNextButton(i,this.dir===`ltr`?1:-1);break;default:return}r&&(t.preventDefault(),r._onButtonClick(),r.focus())}_emitChangeEvent(t){let e=new m(t,this.value);this._rawValue=e.value,this._controlValueAccessorChangeFn(e.value),this.change.emit(e)}_syncButtonToggle(t,e,n=!1,i=!1){!this.multiple&&this.selected&&!t.checked&&(this.selected.checked=!1),this._selectionModel?e?this._selectionModel.select(t):this._selectionModel.deselect(t):i=!0,i?Promise.resolve().then(()=>this._updateModelValue(t,n)):this._updateModelValue(t,n)}_isSelected(t){return this._selectionModel&&this._selectionModel.isSelected(t)}_isPrechecked(t){return typeof this._rawValue>`u`?!1:this.multiple&&Array.isArray(this._rawValue)?this._rawValue.some(e=>t.value!=null&&e===t.value):t.value===this._rawValue}_initializeTabIndex(){if(this._buttonToggles.forEach(t=>{t.tabIndex=-1}),this.selected)this.selected.tabIndex=0;else for(let t=0;t<this._buttonToggles.length;t++){let e=this._buttonToggles.get(t);if(!e.disabled){e.tabIndex=0;break}}}_getNextButton(t,e){let n=this._buttonToggles;for(let i=1;i<=n.length;i++){let r=(t+e*i+n.length)%n.length,c=n.get(r);if(c&&!c.disabled)return c}return null}_setSelectionByValue(t){if(this._rawValue=t,!this._buttonToggles)return;let e=this._buttonToggles.toArray();if(this.multiple&&t?(this._clearSelection(),t.forEach(n=>this._selectValue(n,e))):(this._clearSelection(),this._selectValue(t,e)),!this.multiple&&e.every(n=>n.tabIndex===-1)){for(let n of e)if(!n.disabled){n.tabIndex=0;break}}}_clearSelection(){this._selectionModel.clear(),this._buttonToggles.forEach(t=>{t.checked=!1,this.multiple||(t.tabIndex=-1)})}_selectValue(t,e){for(let n of e)if(n.value===t){n.checked=!0,this._selectionModel.select(n),this.multiple||(n.tabIndex=0);break}}_updateModelValue(t,e){e&&this._emitChangeEvent(t),this.valueChange.emit(this.value)}_markButtonsForCheck(){this._buttonToggles?.forEach(t=>t._markForCheck())}static ɵfac=function(e){return new(e||a)};static ɵdir=bI({type:a,selectors:[[`mat-button-toggle-group`]],contentQueries:function(e,n,i){if(e&1&&ap(i,at,5),e&2){let r;lE(r=uE())&&(n._buttonToggles=r)}},hostAttrs:[1,`mat-button-toggle-group`],hostVars:6,hostBindings:function(e,n){e&1&&sp(`keydown`,function(r){return n._keydown(r)}),e&2&&(Xf(`role`,n.multiple?`group`:`radiogroup`)(`aria-disabled`,n.disabled),hp(`mat-button-toggle-vertical`,n.vertical)(`mat-button-toggle-group-appearance-standard`,n.appearance===`standard`))},inputs:{appearance:`appearance`,name:`name`,vertical:[2,`vertical`,`vertical`,CP],value:`value`,multiple:[2,`multiple`,`multiple`,CP],disabled:[2,`disabled`,`disabled`,CP],disabledInteractive:[2,`disabledInteractive`,`disabledInteractive`,CP],hideSingleSelectionIndicator:[2,`hideSingleSelectionIndicator`,`hideSingleSelectionIndicator`,CP],hideMultipleSelectionIndicator:[2,`hideMultipleSelectionIndicator`,`hideMultipleSelectionIndicator`,CP]},outputs:{valueChange:`valueChange`,change:`change`},exportAs:[`matButtonToggleGroup`],features:[BE([ft,{provide:ot,useExisting:a}])]})}return a})();var at=(()=>{class a{_changeDetectorRef=T(TP);_elementRef=T(pr);_focusMonitor=T(At);_idGenerator=T(Ct);_animationDisabled=U();_checked=!1;ariaLabel;ariaLabelledby=null;_buttonElement;buttonToggleGroup;get buttonId(){return`${this.id}-button`}id;name;value;get tabIndex(){return this._tabIndex()}set tabIndex(t){this._tabIndex.set(t)}_tabIndex;disableRipple=!1;get appearance(){return this.buttonToggleGroup?this.buttonToggleGroup.appearance:this._appearance}set appearance(t){this._appearance=t}_appearance;get checked(){return this.buttonToggleGroup?this.buttonToggleGroup._isSelected(this):this._checked}set checked(t){t!==this._checked&&(this._checked=t,this.buttonToggleGroup&&this.buttonToggleGroup._syncButtonToggle(this,this._checked),this._changeDetectorRef.markForCheck())}get disabled(){return this._disabled||this.buttonToggleGroup&&this.buttonToggleGroup.disabled}set disabled(t){this._disabled=t}_disabled=!1;get disabledInteractive(){return this._disabledInteractive||this.buttonToggleGroup!==null&&this.buttonToggleGroup.disabledInteractive}set disabledInteractive(t){this._disabledInteractive=t}_disabledInteractive;change=new Fe;constructor(){T(O).load(We);let t=T(ot,{optional:!0}),e=T(new xp(`tabindex`),{optional:!0})||``,n=T(nt,{optional:!0});this._tabIndex=Ao(parseInt(e)||0),this.buttonToggleGroup=t,this._appearance=n&&n.appearance?n.appearance:`standard`,this._disabledInteractive=n?.disabledInteractive??!1}ngOnInit(){let t=this.buttonToggleGroup;this.id=this.id||this._idGenerator.getId(`mat-button-toggle-`),t&&(t._isPrechecked(this)?this.checked=!0:t._isSelected(this)!==this._checked&&t._syncButtonToggle(this,this._checked))}ngAfterViewInit(){this._animationDisabled||this._elementRef.nativeElement.classList.add(`mat-button-toggle-animations-enabled`),this._focusMonitor.monitor(this._elementRef,!0)}ngOnDestroy(){let t=this.buttonToggleGroup;this._focusMonitor.stopMonitoring(this._elementRef),t&&t._isSelected(this)&&t._syncButtonToggle(this,!1,!1,!0)}focus(t){this._buttonElement.nativeElement.focus(t)}_onButtonClick(){if(this.disabled)return;let t=this.isSingleSelector()?!0:!this._checked;if(t!==this._checked&&(this._checked=t,this.buttonToggleGroup&&(this.buttonToggleGroup._syncButtonToggle(this,this._checked,!0),this.buttonToggleGroup._onTouched())),this.isSingleSelector()){let e=this.buttonToggleGroup._buttonToggles.find(n=>n.tabIndex===0);e&&(e.tabIndex=-1),this.tabIndex=0}this.change.emit(new m(this,this.value))}_markForCheck(){this._changeDetectorRef.markForCheck()}_getButtonName(){return this.isSingleSelector()?this.buttonToggleGroup.name:this.name||null}isSingleSelector(){return this.buttonToggleGroup&&!this.buttonToggleGroup.multiple}static ɵfac=function(e){return new(e||a)};static ɵcmp=EI({type:a,selectors:[[`mat-button-toggle`]],viewQuery:function(e,n){if(e&1&&cp(ht,5),e&2){let i;lE(i=uE())&&(n._buttonElement=i.first)}},hostAttrs:[`role`,`presentation`,1,`mat-button-toggle`],hostVars:14,hostBindings:function(e,n){e&1&&sp(`focus`,function(){return n.focus()}),e&2&&(Xf(`aria-label`,null)(`aria-labelledby`,null)(`id`,n.id)(`name`,null),hp(`mat-button-toggle-standalone`,!n.buttonToggleGroup)(`mat-button-toggle-checked`,n.checked)(`mat-button-toggle-disabled`,n.disabled)(`mat-button-toggle-disabled-interactive`,n.disabledInteractive)(`mat-button-toggle-appearance-standard`,n.appearance===`standard`))},inputs:{ariaLabel:[0,`aria-label`,`ariaLabel`],ariaLabelledby:[0,`aria-labelledby`,`ariaLabelledby`],id:`id`,name:`name`,value:`value`,tabIndex:`tabIndex`,disableRipple:[2,`disableRipple`,`disableRipple`,CP],appearance:`appearance`,checked:[2,`checked`,`checked`,CP],disabled:[2,`disabled`,`disabled`,CP],disabledInteractive:[2,`disabledInteractive`,`disabledInteractive`,CP]},outputs:{change:`change`},exportAs:[`matButtonToggle`],ngContentSelectors:mt,decls:7,vars:13,consts:[[`button`,``],[`type`,`button`,1,`mat-button-toggle-button`,`mat-focus-indicator`,3,`click`,`id`,`disabled`],[1,`mat-button-toggle-checkbox-wrapper`],[1,`mat-button-toggle-label-content`],[1,`mat-button-toggle-focus-overlay`],[`matRipple`,``,1,`mat-button-toggle-ripple`,3,`matRippleTrigger`,`matRippleDisabled`],[`state`,`checked`,`aria-hidden`,`true`,`appearance`,`minimal`,3,`disabled`]],template:function(e,n){if(e&1&&(sE(),ii(0,`button`,1,0),sp(`click`,function(){return n._onButtonClick()}),WI(2,vt,2,1,`div`,2),ii(3,`span`,3),aE(4),dc()(),tp(5,`span`,4)(6,`span`,5)),e&2){let i=fE(1);ep(`id`,n.buttonId)(`disabled`,n.disabled&&!n.disabledInteractive||null),Xf(`role`,n.isSingleSelector()?`radio`:`button`)(`tabindex`,n.disabled&&!n.disabledInteractive?-1:n.tabIndex)(`aria-pressed`,n.isSingleSelector()?null:n.checked)(`aria-checked`,n.isSingleSelector()?n.checked:null)(`name`,n._getButtonName())(`aria-label`,n.ariaLabel)(`aria-labelledby`,n.ariaLabelledby)(`aria-disabled`,n.disabled&&n.disabledInteractive?`true`:null),$y(2),GI(n.buttonToggleGroup&&(!n.buttonToggleGroup.multiple&&!n.buttonToggleGroup.hideSingleSelectionIndicator||n.buttonToggleGroup.multiple&&!n.buttonToggleGroup.hideMultipleSelectionIndicator)?2:-1),$y(4),ep(`matRippleTrigger`,i)(`matRippleDisabled`,n.disableRipple||n.disabled)}},dependencies:[oi,En],styles:[`.mat-button-toggle-standalone,
.mat-button-toggle-group {
  position: relative;
  display: inline-flex;
  flex-direction: row;
  white-space: nowrap;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  border-radius: var(--%NS%mat-button-toggle-legacy-shape);
  transform: translateZ(0);
}
.mat-button-toggle-standalone:not([class*=mat-elevation-z]),
.mat-button-toggle-group:not([class*=mat-elevation-z]) {
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}
@media (forced-colors: active) {
  .mat-button-toggle-standalone,
  .mat-button-toggle-group {
    outline: solid 1px;
  }
}

.mat-button-toggle-standalone.mat-button-toggle-appearance-standard,
.mat-button-toggle-group-appearance-standard {
  border-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
  border: solid 1px var(--%NS%mat-button-toggle-divider-color, var(--%NS%mat-sys-outline));
}
.mat-button-toggle-standalone.mat-button-toggle-appearance-standard .mat-pseudo-checkbox,
.mat-button-toggle-group-appearance-standard .mat-pseudo-checkbox {
  --%NS%mat-pseudo-checkbox-minimal-selected-checkmark-color: var(--%NS%mat-button-toggle-selected-state-text-color, var(--%NS%mat-sys-on-secondary-container));
}
.mat-button-toggle-standalone.mat-button-toggle-appearance-standard:not([class*=mat-elevation-z]),
.mat-button-toggle-group-appearance-standard:not([class*=mat-elevation-z]) {
  box-shadow: none;
}
@media (forced-colors: active) {
  .mat-button-toggle-standalone.mat-button-toggle-appearance-standard,
  .mat-button-toggle-group-appearance-standard {
    outline: 0;
  }
}

.mat-button-toggle-vertical {
  flex-direction: column;
}
.mat-button-toggle-vertical .mat-button-toggle-label-content {
  display: block;
}

.mat-button-toggle {
  white-space: nowrap;
  position: relative;
  color: var(--%NS%mat-button-toggle-legacy-text-color);
  font-family: var(--%NS%mat-button-toggle-legacy-label-text-font);
  font-size: var(--%NS%mat-button-toggle-legacy-label-text-size);
  line-height: var(--%NS%mat-button-toggle-legacy-label-text-line-height);
  font-weight: var(--%NS%mat-button-toggle-legacy-label-text-weight);
  letter-spacing: var(--%NS%mat-button-toggle-legacy-label-text-tracking);
  --%NS%mat-pseudo-checkbox-minimal-selected-checkmark-color: var(--%NS%mat-button-toggle-legacy-selected-state-text-color);
}
.mat-button-toggle.cdk-keyboard-focused .mat-button-toggle-focus-overlay {
  opacity: var(--%NS%mat-button-toggle-legacy-focus-state-layer-opacity);
}
.mat-button-toggle .mat-icon svg {
  vertical-align: top;
}

.mat-button-toggle-checkbox-wrapper {
  display: inline-block;
  justify-content: flex-start;
  align-items: center;
  width: 0;
  height: 18px;
  line-height: 18px;
  overflow: hidden;
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translate3d(0, -50%, 0);
}
[dir=rtl] .mat-button-toggle-checkbox-wrapper {
  left: auto;
  right: 16px;
}
.mat-button-toggle-appearance-standard .mat-button-toggle-checkbox-wrapper {
  left: 12px;
}
[dir=rtl] .mat-button-toggle-appearance-standard .mat-button-toggle-checkbox-wrapper {
  left: auto;
  right: 12px;
}
.mat-button-toggle-checked .mat-button-toggle-checkbox-wrapper {
  width: 18px;
}
.mat-button-toggle-animations-enabled .mat-button-toggle-checkbox-wrapper {
  transition: width 150ms 45ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-button-toggle-vertical .mat-button-toggle-checkbox-wrapper {
  transition: none;
}

.mat-button-toggle-checked {
  color: var(--%NS%mat-button-toggle-legacy-selected-state-text-color);
  background-color: var(--%NS%mat-button-toggle-legacy-selected-state-background-color);
}

.mat-button-toggle-disabled {
  pointer-events: none;
  color: var(--%NS%mat-button-toggle-legacy-disabled-state-text-color);
  background-color: var(--%NS%mat-button-toggle-legacy-disabled-state-background-color);
  --%NS%mat-pseudo-checkbox-minimal-disabled-selected-checkmark-color: var(--%NS%mat-button-toggle-legacy-disabled-state-text-color);
}
.mat-button-toggle-disabled.mat-button-toggle-checked {
  background-color: var(--%NS%mat-button-toggle-legacy-disabled-selected-state-background-color);
}

.mat-button-toggle-disabled-interactive {
  pointer-events: auto;
}

.mat-button-toggle-appearance-standard {
  color: var(--%NS%mat-button-toggle-text-color, var(--%NS%mat-sys-on-surface));
  background-color: var(--%NS%mat-button-toggle-background-color, transparent);
  font-family: var(--%NS%mat-button-toggle-label-text-font, var(--%NS%mat-sys-label-large-font));
  font-size: var(--%NS%mat-button-toggle-label-text-size, var(--%NS%mat-sys-label-large-size));
  line-height: var(--%NS%mat-button-toggle-label-text-line-height, var(--%NS%mat-sys-label-large-line-height));
  font-weight: var(--%NS%mat-button-toggle-label-text-weight, var(--%NS%mat-sys-label-large-weight));
  letter-spacing: var(--%NS%mat-button-toggle-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));
}
.mat-button-toggle-group-appearance-standard .mat-button-toggle-appearance-standard + .mat-button-toggle-appearance-standard {
  border-left: solid 1px var(--%NS%mat-button-toggle-divider-color, var(--%NS%mat-sys-outline));
}
[dir=rtl] .mat-button-toggle-group-appearance-standard .mat-button-toggle-appearance-standard + .mat-button-toggle-appearance-standard {
  border-left: none;
  border-right: solid 1px var(--%NS%mat-button-toggle-divider-color, var(--%NS%mat-sys-outline));
}
.mat-button-toggle-group-appearance-standard.mat-button-toggle-vertical .mat-button-toggle-appearance-standard + .mat-button-toggle-appearance-standard {
  border-left: none;
  border-right: none;
  border-top: solid 1px var(--%NS%mat-button-toggle-divider-color, var(--%NS%mat-sys-outline));
}
.mat-button-toggle-appearance-standard.mat-button-toggle-checked {
  color: var(--%NS%mat-button-toggle-selected-state-text-color, var(--%NS%mat-sys-on-secondary-container));
  background-color: var(--%NS%mat-button-toggle-selected-state-background-color, var(--%NS%mat-sys-secondary-container));
}
.mat-button-toggle-appearance-standard.mat-button-toggle-disabled {
  color: var(--%NS%mat-button-toggle-disabled-state-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
  background-color: var(--%NS%mat-button-toggle-disabled-state-background-color, transparent);
}
.mat-button-toggle-appearance-standard.mat-button-toggle-disabled .mat-pseudo-checkbox {
  --%NS%mat-pseudo-checkbox-minimal-disabled-selected-checkmark-color: var(--%NS%mat-button-toggle-disabled-selected-state-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-button-toggle-appearance-standard.mat-button-toggle-disabled.mat-button-toggle-checked {
  color: var(--%NS%mat-button-toggle-disabled-selected-state-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
  background-color: var(--%NS%mat-button-toggle-disabled-selected-state-background-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 12%, transparent));
}
.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay {
  background-color: var(--%NS%mat-button-toggle-state-layer-color, var(--%NS%mat-sys-on-surface));
}
.mat-button-toggle-appearance-standard:hover .mat-button-toggle-focus-overlay {
  opacity: var(--%NS%mat-button-toggle-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mat-button-toggle-appearance-standard.cdk-keyboard-focused .mat-button-toggle-focus-overlay {
  opacity: var(--%NS%mat-button-toggle-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
@media (hover: none) {
  .mat-button-toggle-appearance-standard:hover .mat-button-toggle-focus-overlay {
    display: none;
  }
}

.mat-button-toggle-label-content {
  -webkit-user-select: none;
  user-select: none;
  display: inline-block;
  padding: 0 16px;
  line-height: var(--%NS%mat-button-toggle-legacy-height);
  position: relative;
}
.mat-button-toggle-appearance-standard .mat-button-toggle-label-content {
  padding: 0 12px;
  line-height: var(--%NS%mat-button-toggle-height, 40px);
}

.mat-button-toggle-label-content > * {
  vertical-align: middle;
}

.mat-button-toggle-focus-overlay {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0;
  background-color: var(--%NS%mat-button-toggle-legacy-state-layer-color);
}

@media (forced-colors: active) {
  .mat-button-toggle-checked .mat-button-toggle-focus-overlay {
    border-bottom: solid 500px;
    opacity: 0.5;
    height: 0;
  }
  .mat-button-toggle-checked:hover .mat-button-toggle-focus-overlay {
    opacity: 0.6;
  }
  .mat-button-toggle-checked.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay {
    border-bottom: solid 500px;
  }
}
.mat-button-toggle .mat-button-toggle-ripple {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
}

.mat-button-toggle-button {
  border: 0;
  background: none;
  color: inherit;
  padding: 0;
  margin: 0;
  font: inherit;
  outline: none;
  width: 100%;
  cursor: pointer;
}
.mat-button-toggle-animations-enabled .mat-button-toggle-button {
  transition: padding 150ms 45ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-button-toggle-vertical .mat-button-toggle-button {
  transition: none;
}
.mat-button-toggle-disabled .mat-button-toggle-button {
  cursor: default;
}
.mat-button-toggle-button::-moz-focus-inner {
  border: 0;
}
.mat-button-toggle-checked .mat-button-toggle-button:has(.mat-button-toggle-checkbox-wrapper) {
  padding-left: 30px;
}
[dir=rtl] .mat-button-toggle-checked .mat-button-toggle-button:has(.mat-button-toggle-checkbox-wrapper) {
  padding-left: 0;
  padding-right: 30px;
}

.mat-button-toggle-standalone.mat-button-toggle-appearance-standard {
  --%NS%mat-focus-indicator-border-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
}

.mat-button-toggle-group-appearance-standard:not(.mat-button-toggle-vertical) .mat-button-toggle:last-of-type .mat-button-toggle-button::before {
  border-top-right-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
  border-bottom-right-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
}
.mat-button-toggle-group-appearance-standard:not(.mat-button-toggle-vertical) .mat-button-toggle:first-of-type .mat-button-toggle-button::before {
  border-top-left-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
  border-bottom-left-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
}

.mat-button-toggle-group-appearance-standard.mat-button-toggle-vertical .mat-button-toggle:last-of-type .mat-button-toggle-button::before {
  border-bottom-right-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
  border-bottom-left-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
}
.mat-button-toggle-group-appearance-standard.mat-button-toggle-vertical .mat-button-toggle:first-of-type .mat-button-toggle-button::before {
  border-top-right-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
  border-top-left-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
}
`],encapsulation:2})}return a})();var jt=(()=>{class a{static ɵfac=function(e){return new(e||a)};static ɵmod=TI({type:a});static ɵinj=fl({imports:[$e,at,ft$1]})}return a})();var St={а:`а`,б:`бэ`,в:`вэ`,г:`гэ`,д:`дэ`,е:`е`,ё:`ё`,ж:`жэ`,з:`зэ`,и:`и`,й:`и краткое`,к:`ка`,л:`эль`,м:`эм`,н:`эн`,о:`о`,п:`пэ`,р:`эр`,с:`эс`,т:`тэ`,у:`у`,ф:`эф`,х:`ха`,ц:`цэ`,ч:`че`,ш:`ша`,щ:`ща`,ъ:`твёрдый знак`,ы:`ы`,ь:`мягкий знак`,э:`э`,ю:`ю`,я:`я`};function it(a){let o=a.trim().toLowerCase();return o?o.length===1?St[o]??o:o:null}var yt=`assets/sounds/correct.wav`;var kt=`assets/sounds/incorrect.wav`;var Tt=120;var rt=400;var lt=class a{settingsService=T(p);correctAudio=null;incorrectAudio=null;voices=[];speakTimer=null;heldUtterances=new Set;constructor(){this.initSpeech()}playCorrect(){return this.play(this.getAudio(yt,`correct`))}playIncorrect(){return this.play(this.getAudio(kt,`incorrect`))}playCorrectThenSpeak(o){this.playThenSpeak(this.playCorrect(),o)}playCorrectThenSpeakLetter(o){this.playCorrect().then(()=>{this.speakLetter(o,{delayMs:rt})})}playIncorrectThenSpeak(o){this.playThenSpeak(this.playIncorrect(),o)}speakLetter(o,t){let e=it(o);e&&this.speak(e,{rate:.95,interrupt:!0,delayMs:t?.delayMs})}speakWord(o,t){let e=o.trim();e&&this.speak(e,{rate:.85,interrupt:t?.interrupt??!0,delayMs:t?.delayMs})}initSpeech(){if(typeof window>`u`||!window.speechSynthesis)return;let o=()=>{this.voices=window.speechSynthesis.getVoices()};o(),window.speechSynthesis.addEventListener(`voiceschanged`,o)}speak(o,t){if(!this.settingsService.settings().soundEnabled||typeof window>`u`||!window.speechSynthesis)return;let e=()=>this.enqueueUtterance(o,t.rate,t.interrupt!==!1);if(t.delayMs&&t.delayMs>0){this.clearSpeakTimer(),this.speakTimer=setTimeout(e,t.delayMs);return}e()}enqueueUtterance(o,t,e){let n=window.speechSynthesis,i=this.createUtterance(o,t),r=()=>{n.speak(i),n.paused&&n.resume()};if(e&&(n.speaking||n.pending||n.paused)){n.cancel(),this.clearSpeakTimer(),this.speakTimer=setTimeout(r,Tt);return}r()}createUtterance(o,t){let e=new SpeechSynthesisUtterance(o);e.rate=t,e.volume=1,e.pitch=1;let n=this.pickLocalRussianVoice();n&&(e.voice=n,e.lang=n.lang),this.heldUtterances.add(e);let i=()=>this.heldUtterances.delete(e);return e.onend=i,e.onerror=r=>{i(),!(r.error===`interrupted`||r.error===`canceled`)&&this.retryWithDefaultVoice(o,t)},e}retryWithDefaultVoice(o,t){if(!window.speechSynthesis)return;let e=new SpeechSynthesisUtterance(o);e.rate=t,e.volume=1,this.heldUtterances.add(e);let n=()=>this.heldUtterances.delete(e);e.addEventListener(`end`,n),e.addEventListener(`error`,n),window.speechSynthesis.speak(e)}pickLocalRussianVoice(){if(typeof window>`u`||!window.speechSynthesis)return;let o=this.voices.length?this.voices:window.speechSynthesis.getVoices();return this.voices=o,o.find(t=>t.localService&&/^ru\b/i.test(t.lang))}clearSpeakTimer(){this.speakTimer&&(clearTimeout(this.speakTimer),this.speakTimer=null)}getAudio(o,t){return t===`correct`?(this.correctAudio??=new Audio(o),this.correctAudio):(this.incorrectAudio??=new Audio(o),this.incorrectAudio)}playThenSpeak(o,t){o.then(()=>{this.speakWord(t,{delayMs:rt})})}play(o){return this.settingsService.settings().soundEnabled?(o.currentTime=0,new Promise(t=>{let e=()=>{o.removeEventListener(`ended`,e),o.removeEventListener(`error`,e),t()};o.addEventListener(`ended`,e),o.addEventListener(`error`,e),o.play().catch(()=>e())})):Promise.resolve()}static ɵfac=function(t){return new(t||a)};static ɵprov=se({token:a,factory:a.ɵfac,providedIn:`root`})};function Xt(a){let o=[...a];for(let t=o.length-1;t>0;t-=1){let e=Math.floor(Math.random()*(t+1));[o[t],o[e]]=[o[e],o[t]]}return o}export{lt as a,jt as i,_t as n,at as r,Xt as t};