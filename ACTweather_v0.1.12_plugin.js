const __pluginConfig =  {
  "name": "windy-plugin-actweather",
  "version": "0.1.12",
  "icon": "⛅",
  "title": "ACTweather",
  "description": "氣象人員單點預報與模式預報電碼摘要",
  "author": "航空技術學院 陳智羿老師",
  "desktopUI": "rhpane",
  "mobileUI": "fullscreen",
  "routerPath": "/actweather/:lat?/:lon?",
  "private": false,
  "listenToSingleclick": true,
  "addToContextmenu": true,
  "built": 1791904616395,
  "builtReadable": "2026-10-13T15:16:56.395Z"
};

// transformCode: import store from '@windy/store';
const store = W.store;

// transformCode: import bcast from '@windy/broadcast';
const bcast = W.broadcast;

// transformCode: import { singleclick } from '@windy/singleclick';
const { singleclick } = W.singleclick;

// transformCode: import { getElevation, getPointForecastData } from '@windy/fetch';
const { getElevation, getPointForecastData } = W.fetch;

// transformCode: import { map } from '@windy/map';
const { map } = W.map;

// transformCode: import { getDataZoom, createFullRenderingParams } from '@windy/renderUtils';
const { getDataZoom, createFullRenderingParams } = W.renderUtils;

// transformCode: import { fetchImageBlob } from '@windy/tileLayerSource';
const { fetchImageBlob } = W.tileLayerSource;

// transformCode: import { getImageData, rawDataToCanvasImageSource } from '@windy/imageFetch';
const { getImageData, rawDataToCanvasImageSource } = W.imageFetch;

// transformCode: import { decodeImageBytesCompact, processHeader, decodeHeader } from '@windy/TileLayerUtils';
const { decodeImageBytesCompact, processHeader, decodeHeader } = W.TileLayerUtils;

// transformCode: import { airPointProducts } from '@windy/rootScope';
const { airPointProducts } = W.rootScope;

// transformCode: import products from '@windy/products';
const products = W.products;

// transformCode: import overlays from '@windy/overlays';
const overlays = W.overlays;

// transformCode: import { getGradientLegendHTML } from '@windy/renderLegend';
const { getGradientLegendHTML } = W.renderLegend;


/** @returns {void} */
function noop() {}

function run(fn) {
	return fn();
}

function blank_object() {
	return Object.create(null);
}

/**
 * @param {Function[]} fns
 * @returns {void}
 */
function run_all(fns) {
	fns.forEach(run);
}

/**
 * @param {any} thing
 * @returns {thing is Function}
 */
function is_function(thing) {
	return typeof thing === 'function';
}

/** @returns {boolean} */
function safe_not_equal(a, b) {
	return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
}

/** @returns {boolean} */
function is_empty(obj) {
	return Object.keys(obj).length === 0;
}

/**
 * @param {Node} target
 * @param {Node} node
 * @returns {void}
 */
function append(target, node) {
	target.appendChild(node);
}

/**
 * @param {Node} target
 * @param {string} style_sheet_id
 * @param {string} styles
 * @returns {void}
 */
function append_styles(target, style_sheet_id, styles) {
	const append_styles_to = get_root_for_style(target);
	if (!append_styles_to.getElementById(style_sheet_id)) {
		const style = element('style');
		style.id = style_sheet_id;
		style.textContent = styles;
		append_stylesheet(append_styles_to, style);
	}
}

/**
 * @param {Node} node
 * @returns {ShadowRoot | Document}
 */
function get_root_for_style(node) {
	if (!node) return document;
	const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
	if (root && /** @type {ShadowRoot} */ (root).host) {
		return /** @type {ShadowRoot} */ (root);
	}
	return node.ownerDocument;
}

/**
 * @param {ShadowRoot | Document} node
 * @param {HTMLStyleElement} style
 * @returns {CSSStyleSheet}
 */
function append_stylesheet(node, style) {
	append(/** @type {Document} */ (node).head || node, style);
	return style.sheet;
}

/**
 * @param {Node} target
 * @param {Node} node
 * @param {Node} [anchor]
 * @returns {void}
 */
function insert(target, node, anchor) {
	target.insertBefore(node, anchor || null);
}

/**
 * @param {Node} node
 * @returns {void}
 */
function detach(node) {
	if (node.parentNode) {
		node.parentNode.removeChild(node);
	}
}

/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} name
 * @returns {HTMLElementTagNameMap[K]}
 */
function element(name) {
	return document.createElement(name);
}

/**
 * @param {string} data
 * @returns {Text}
 */
function text(data) {
	return document.createTextNode(data);
}

/**
 * @returns {Text} */
function space() {
	return text(' ');
}

/**
 * @param {Element} node
 * @param {string} attribute
 * @param {string} [value]
 * @returns {void}
 */
function attr(node, attribute, value) {
	if (value == null) node.removeAttribute(attribute);
	else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
}

/**
 * @param {Element} element
 * @returns {ChildNode[]}
 */
function children(element) {
	return Array.from(element.childNodes);
}

/**
 * @typedef {Node & {
 * 	claim_order?: number;
 * 	hydrate_init?: true;
 * 	actual_end_child?: NodeEx;
 * 	childNodes: NodeListOf<NodeEx>;
 * }} NodeEx
 */

/** @typedef {ChildNode & NodeEx} ChildNodeEx */

/** @typedef {NodeEx & { claim_order: number }} NodeEx2 */

/**
 * @typedef {ChildNodeEx[] & {
 * 	claim_info?: {
 * 		last_index: number;
 * 		total_claimed: number;
 * 	};
 * }} ChildNodeArray
 */

let current_component;

/** @returns {void} */
function set_current_component(component) {
	current_component = component;
}

function get_current_component() {
	if (!current_component) throw new Error('Function called outside component initialization');
	return current_component;
}

/**
 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
 * it can be called from an external module).
 *
 * If a function is returned _synchronously_ from `onMount`, it will be called when the component is unmounted.
 *
 * `onMount` does not run inside a [server-side component](https://svelte.dev/docs#run-time-server-side-component-api).
 *
 * https://svelte.dev/docs/svelte#onmount
 * @template T
 * @param {() => import('./private.js').NotFunction<T> | Promise<import('./private.js').NotFunction<T>> | (() => any)} fn
 * @returns {void}
 */
function onMount(fn) {
	get_current_component().$$.on_mount.push(fn);
}

/**
 * Schedules a callback to run immediately before the component is unmounted.
 *
 * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
 * only one that runs inside a server-side component.
 *
 * https://svelte.dev/docs/svelte#ondestroy
 * @param {() => any} fn
 * @returns {void}
 */
function onDestroy(fn) {
	get_current_component().$$.on_destroy.push(fn);
}

const dirty_components = [];
const binding_callbacks = [];

let render_callbacks = [];

const flush_callbacks = [];

const resolved_promise = /* @__PURE__ */ Promise.resolve();

let update_scheduled = false;

/** @returns {void} */
function schedule_update() {
	if (!update_scheduled) {
		update_scheduled = true;
		resolved_promise.then(flush);
	}
}

/** @returns {void} */
function add_render_callback(fn) {
	render_callbacks.push(fn);
}

// flush() calls callbacks in this order:
// 1. All beforeUpdate callbacks, in order: parents before children
// 2. All bind:this callbacks, in reverse order: children before parents.
// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
//    for afterUpdates called during the initial onMount, which are called in
//    reverse order: children before parents.
// Since callbacks might update component values, which could trigger another
// call to flush(), the following steps guard against this:
// 1. During beforeUpdate, any updated components will be added to the
//    dirty_components array and will cause a reentrant call to flush(). Because
//    the flush index is kept outside the function, the reentrant call will pick
//    up where the earlier call left off and go through all dirty components. The
//    current_component value is saved and restored so that the reentrant call will
//    not interfere with the "parent" flush() call.
// 2. bind:this callbacks cannot trigger new flush() calls.
// 3. During afterUpdate, any updated components will NOT have their afterUpdate
//    callback called a second time; the seen_callbacks set, outside the flush()
//    function, guarantees this behavior.
const seen_callbacks = new Set();

let flushidx = 0; // Do *not* move this inside the flush() function

/** @returns {void} */
function flush() {
	// Do not reenter flush while dirty components are updated, as this can
	// result in an infinite loop. Instead, let the inner flush handle it.
	// Reentrancy is ok afterwards for bindings etc.
	if (flushidx !== 0) {
		return;
	}
	const saved_component = current_component;
	do {
		// first, call beforeUpdate functions
		// and update components
		try {
			while (flushidx < dirty_components.length) {
				const component = dirty_components[flushidx];
				flushidx++;
				set_current_component(component);
				update(component.$$);
			}
		} catch (e) {
			// reset dirty state to not end up in a deadlocked state and then rethrow
			dirty_components.length = 0;
			flushidx = 0;
			throw e;
		}
		set_current_component(null);
		dirty_components.length = 0;
		flushidx = 0;
		while (binding_callbacks.length) binding_callbacks.pop()();
		// then, once components are updated, call
		// afterUpdate functions. This may cause
		// subsequent updates...
		for (let i = 0; i < render_callbacks.length; i += 1) {
			const callback = render_callbacks[i];
			if (!seen_callbacks.has(callback)) {
				// ...so guard against infinite loops
				seen_callbacks.add(callback);
				callback();
			}
		}
		render_callbacks.length = 0;
	} while (dirty_components.length);
	while (flush_callbacks.length) {
		flush_callbacks.pop()();
	}
	update_scheduled = false;
	seen_callbacks.clear();
	set_current_component(saved_component);
}

/** @returns {void} */
function update($$) {
	if ($$.fragment !== null) {
		$$.update();
		run_all($$.before_update);
		const dirty = $$.dirty;
		$$.dirty = [-1];
		$$.fragment && $$.fragment.p($$.ctx, dirty);
		$$.after_update.forEach(add_render_callback);
	}
}

/**
 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
 * @param {Function[]} fns
 * @returns {void}
 */
function flush_render_callbacks(fns) {
	const filtered = [];
	const targets = [];
	render_callbacks.forEach((c) => (fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c)));
	targets.forEach((c) => c());
	render_callbacks = filtered;
}

const outroing = new Set();

/**
 * @param {import('./private.js').Fragment} block
 * @param {0 | 1} [local]
 * @returns {void}
 */
function transition_in(block, local) {
	if (block && block.i) {
		outroing.delete(block);
		block.i(local);
	}
}

/** @typedef {1} INTRO */
/** @typedef {0} OUTRO */
/** @typedef {{ direction: 'in' | 'out' | 'both' }} TransitionOptions */
/** @typedef {(node: Element, params: any, options: TransitionOptions) => import('../transition/public.js').TransitionConfig} TransitionFn */

/**
 * @typedef {Object} Outro
 * @property {number} r
 * @property {Function[]} c
 * @property {Object} p
 */

/**
 * @typedef {Object} PendingProgram
 * @property {number} start
 * @property {INTRO|OUTRO} b
 * @property {Outro} [group]
 */

/**
 * @typedef {Object} Program
 * @property {number} a
 * @property {INTRO|OUTRO} b
 * @property {1|-1} d
 * @property {number} duration
 * @property {number} start
 * @property {number} end
 * @property {Outro} [group]
 */

/** @returns {void} */
function mount_component(component, target, anchor) {
	const { fragment, after_update } = component.$$;
	fragment && fragment.m(target, anchor);
	// onMount happens before the initial afterUpdate
	add_render_callback(() => {
		const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
		// if the component was destroyed immediately
		// it will update the `$$.on_destroy` reference to `null`.
		// the destructured on_destroy may still reference to the old array
		if (component.$$.on_destroy) {
			component.$$.on_destroy.push(...new_on_destroy);
		} else {
			// Edge case - component was destroyed immediately,
			// most likely as a result of a binding initialising
			run_all(new_on_destroy);
		}
		component.$$.on_mount = [];
	});
	after_update.forEach(add_render_callback);
}

/** @returns {void} */
function destroy_component(component, detaching) {
	const $$ = component.$$;
	if ($$.fragment !== null) {
		flush_render_callbacks($$.after_update);
		run_all($$.on_destroy);
		$$.fragment && $$.fragment.d(detaching);
		// TODO null out other refs, including component.$$ (but need to
		// preserve final state?)
		$$.on_destroy = $$.fragment = null;
		$$.ctx = [];
	}
}

/** @returns {void} */
function make_dirty(component, i) {
	if (component.$$.dirty[0] === -1) {
		dirty_components.push(component);
		schedule_update();
		component.$$.dirty.fill(0);
	}
	component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
}

// TODO: Document the other params
/**
 * @param {SvelteComponent} component
 * @param {import('./public.js').ComponentConstructorOptions} options
 *
 * @param {import('./utils.js')['not_equal']} not_equal Used to compare props and state values.
 * @param {(target: Element | ShadowRoot) => void} [append_styles] Function that appends styles to the DOM when the component is first initialised.
 * This will be the `add_css` function from the compiled component.
 *
 * @returns {void}
 */
function init(
	component,
	options,
	instance,
	create_fragment,
	not_equal,
	props,
	append_styles = null,
	dirty = [-1]
) {
	const parent_component = current_component;
	set_current_component(component);
	/** @type {import('./private.js').T$$} */
	const $$ = (component.$$ = {
		fragment: null,
		ctx: [],
		// state
		props,
		update: noop,
		not_equal,
		bound: blank_object(),
		// lifecycle
		on_mount: [],
		on_destroy: [],
		on_disconnect: [],
		before_update: [],
		after_update: [],
		context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
		// everything else
		callbacks: blank_object(),
		dirty,
		skip_bound: false,
		root: options.target || parent_component.$$.root
	});
	append_styles && append_styles($$.root);
	let ready = false;
	$$.ctx = instance
		? instance(component, options.props || {}, (i, ret, ...rest) => {
				const value = rest.length ? rest[0] : ret;
				if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
					if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
					if (ready) make_dirty(component, i);
				}
				return ret;
		  })
		: [];
	$$.update();
	ready = true;
	run_all($$.before_update);
	// `false` as a special case of no DOM component
	$$.fragment = create_fragment ? create_fragment($$.ctx) : false;
	if (options.target) {
		if (options.hydrate) {
			// TODO: what is the correct type here?
			// @ts-expect-error
			const nodes = children(options.target);
			$$.fragment && $$.fragment.l(nodes);
			nodes.forEach(detach);
		} else {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			$$.fragment && $$.fragment.c();
		}
		if (options.intro) transition_in(component.$$.fragment);
		mount_component(component, options.target, options.anchor);
		flush();
	}
	set_current_component(parent_component);
}

/**
 * Base class for Svelte components. Used when dev=false.
 *
 * @template {Record<string, any>} [Props=any]
 * @template {Record<string, any>} [Events=any]
 */
class SvelteComponent {
	/**
	 * ### PRIVATE API
	 *
	 * Do not use, may change at any time
	 *
	 * @type {any}
	 */
	$$ = undefined;
	/**
	 * ### PRIVATE API
	 *
	 * Do not use, may change at any time
	 *
	 * @type {any}
	 */
	$$set = undefined;

	/** @returns {void} */
	$destroy() {
		destroy_component(this, 1);
		this.$destroy = noop;
	}

	/**
	 * @template {Extract<keyof Events, string>} K
	 * @param {K} type
	 * @param {((e: Events[K]) => void) | null | undefined} callback
	 * @returns {() => void}
	 */
	$on(type, callback) {
		if (!is_function(callback)) {
			return noop;
		}
		const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
		callbacks.push(callback);
		return () => {
			const index = callbacks.indexOf(callback);
			if (index !== -1) callbacks.splice(index, 1);
		};
	}

	/**
	 * @param {Partial<Props>} props
	 * @returns {void}
	 */
	$set(props) {
		if (this.$$set && !is_empty(props)) {
			this.$$.skip_bound = true;
			this.$$set(props);
			this.$$.skip_bound = false;
		}
	}
}

/**
 * @typedef {Object} CustomElementPropDefinition
 * @property {string} [attribute]
 * @property {boolean} [reflect]
 * @property {'String'|'Boolean'|'Number'|'Array'|'Object'} [type]
 */

// generated during release, do not modify

const PUBLIC_VERSION = '4';

if (typeof window !== 'undefined')
	// @ts-ignore
	(window.__svelte || (window.__svelte = { v: new Set() })).v.add(PUBLIC_VERSION);

const defaultCardStyle={border:'none',borderColor:'#23445e',borderWidth:6,background:'#ffffff',background2:'#dcecff',gradient:false,backgroundOpacity:100,imageOpacity:30,actFont:27,marineFont:27,metarFont:27,boldTitles:true,textColor:'#17212b',note:'',noteSize:32,notePosition:'bottom',noteStyle:'normal',noteColor:'#a51f2d'};
function cardStyle(value={}){const s={...defaultCardStyle,...value};for(const k of ['borderColor','background','background2','textColor','noteColor'])if(!/^#[0-9a-f]{6}$/i.test(s[k]))s[k]=defaultCardStyle[k];for(const [k,min,max] of [['borderWidth',1,16],['backgroundOpacity',0,100],['imageOpacity',0,100],['actFont',18,44],['marineFont',18,44],['metarFont',18,44],['noteSize',18,64]])s[k]=Math.max(min,Math.min(max,Number(s[k])|| (min===0?0:defaultCardStyle[k])));for(const [k,values] of [['border',['none','solid','dashed','dotted','double']],['notePosition',['top','bottom','right']],['noteStyle',['normal','bold','italic','bold italic']]])if(!values.includes(s[k]))s[k]=defaultCardStyle[k];s.note=String(s.note??'').slice(0,500);s.gradient=!!s.gradient;s.boldTitles=!!s.boldTitles;return s;}
function screenshotRange(value=2){const n=Number(value);if(!Number.isFinite(n)||n<0.1||n>20)throw Error('截圖範圍請輸入0.1至20度');return n;}
async function loadBackground(file,win){if(!file)return null;if(!['image/png','image/jpeg','image/webp'].includes(file.type))throw Error('底圖請使用PNG、JPEG或WebP');if(file.size>8*1024*1024)throw Error('底圖請使用8MB以內的圖片');const url=win.URL.createObjectURL(file);try{const image=new win.Image();await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(Error('底圖無法解碼'));image.src=url;});const scale=Math.min(1,2400/Math.max(image.naturalWidth,image.naturalHeight));const canvas=win.document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);return {canvas,name:file.name};}finally{win.URL.revokeObjectURL(url);}}
async function restoreBackground(background,win){if(!background)return null;const image=new win.Image();await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(Error('喜愛風格底圖無法解碼'));image.src=background.data;});const canvas=win.document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;canvas.getContext('2d').drawImage(image,0,0);return {canvas,name:background.name};}

// Use Windy's own overlay, selected legend, colors and legend renderer.
// Asking for kt here does not mutate the user's unit preference.
function windyLegend(overlay,{overlays,getGradientLegendHTML,document:doc=globalThis.document}){
 const o=overlays?.[overlay],legend=o?.alternativeLegend??o?.overlayMetric?.legend;
 const color=o?.overlayColor;
 if(!legend||legend.isDiscrete||!color?.getColor||!getGradientLegendHTML)throw Error(`Windy ${overlay} 色階介面不可用，未生成圖卡`);
 const metric=overlay==='wind'?'kt':o.overlayMetric?.metric;
 if(!legend.description?.includes(metric))throw Error(`Windy ${overlay} 色階單位不可用`);
 const rendered=getGradientLegendHTML(color.getColor(),legend,metric);
 const colors=rendered.background.match(/rgba?\([^)]*\)/g);
 const el=doc.createElement('div');el.innerHTML=rendered.content;
 const labels=[...el.querySelectorAll('span')].map(e=>e.textContent);
 if(!colors?.length||labels.length!==legend.lines.length+1)throw Error(`Windy ${overlay} 色階格式已變更`);
 return {colors,labels,unit:metric};
}

// Real Windy canvas capture; never substitute a synthetic map on failure.
const cardProducts=[
 {overlay:'rain',label:'降雨、雷暴',candidates:m=>[m,'ecmwf','gfs']},
 {overlay:'wind',label:'風速',candidates:m=>[m,'ecmwf','gfs']},
 {overlay:'clouds',label:'雲',candidates:m=>[m,'ecmwf','gfs']},
 {overlay:'visibility',label:'能見度',candidates:m=>[m,'ecmwf','gfs']},
 {overlay:'sst',label:'海溫',candidates:()=>['ecmwfAnalysis']},
 {overlay:'waves',label:'波浪',candidates:()=>['ecmwfWaves','gfsWaves']},
 {overlay:'currents',label:'洋流',candidates:()=>['cmems']},
 {overlay:'swell1',label:'湧浪',candidates:()=>['ecmwfWaves','gfsWaves']}
];
const clone=x=>x==null?x:JSON.parse(JSON.stringify(x));
function cardBounds(point,range=2){range=screenshotRange(range);if(!Number.isFinite(point.lat)||!Number.isFinite(point.lon)||Math.abs(point.lat)>90||Math.abs(point.lon)>180)throw Error('圖卡地點無效');if(Math.abs(point.lat)+range>85.05112878)throw Error('此極區無法完整擷取所設定範圍的Mercator地圖');return [[point.lon-range,point.lat-range],[point.lon+range,point.lat+range]];}
function cropRectangle(gl,canvas,bounds){const [nw,se]=[gl.project([bounds[0][0],bounds[1][1]]),gl.project([bounds[1][0],bounds[0][1]])];const size=gl.getContainer().getBoundingClientRect(),sx=canvas.width/size.width,sy=canvas.height/size.height;const r={x:nw.x*sx,y:nw.y*sy,width:(se.x-nw.x)*sx,height:(se.y-nw.y)*sy};if(!Object.values(r).every(Number.isFinite)||r.width<2||r.height<2||r.x<-0.5||r.y<-0.5||r.x+r.width>canvas.width+.5||r.y+r.height>canvas.height+.5)throw Error('指定範圍未完整呈現在地圖中');return r;}
// Windy 51.x public MapLibre style layers expose their custom implementation.
// Its switchable cache must have switched AND every renderable tile must be valid.
// redrawFinished alone also fires when renderer parameters change, before tiles load.
function weatherCanvasReady(gl,overlay,product){
 const implementation=(gl.getLayersOrder?.()??[]).map(id=>gl.getLayer(id)?.implementation).find(layer=>layer?.switchableCache);
 if(!implementation)throw Error('Windy氣象圖層截圖介面不可用，請更新Windy後重試');
 const cache=implementation.switchableCache;
 if(implementation._currentOverlay!==overlay||implementation._latestParams?.product!==product||cache._nextCache)return false;
 const coords=cache.getRenderableCoords();return coords.length>0&&coords.every(c=>cache.hasTile(c)&&cache.getTile(c)?.valid===true);
}
function createWindyCapture({store,bcast,map,products,legendAPI,document:doc=globalThis.document},{timeoutMs=25000}={}){
 let busy=false,closed=false,active=null;
 const status=()=>busy;
 async function capture(snapshot,{signal,onProgress=()=>{}}={}){
  if(closed)throw Error('ACTweather 已關閉');if(busy)throw Error('圖卡正在產生');
  const gl=map?.maplibreMap;if(!gl?.getCanvas||!gl?.fitBounds||!gl?.project)throw Error('目前Windy未提供可截圖的MapLibre地圖');
  const bounds=cardBounds(snapshot.point,snapshot.range);
  const controller=new AbortController();active=controller;const abort=()=>controller.abort();signal?.addEventListener('abort',abort,{once:true});if(signal?.aborted)abort();
  const keys=['product','overlay','level','timestamp','animation','acRange','isolinesOn'];
  const saved=Object.fromEntries(keys.map(k=>[k,clone(store.get(k))]));
  const camera={center:clone(gl.getCenter()),zoom:gl.getZoom(),bearing:gl.getBearing(),pitch:gl.getPitch(),...(gl.getPadding?{padding:clone(gl.getPadding())}:{})},projection=gl.getProjection?.();
  const images=[];let completed=false;busy=true;
  async function set(key,value){if(value!==undefined)await store.set(key,value);}
  function check(){if(controller.signal.aborted)throw Error('已取消圖卡下載');}
  function renderCrop(item,sourceModel){return new Promise((resolve,reject)=>{
   let timer;const done=(error,value)=>{clearTimeout(timer);gl.off('render',render);controller.signal.removeEventListener('abort',cancel);error?reject(error):resolve(value);};
   const cancel=()=>done(Error('已取消圖卡下載'));
   const render=()=>{try{check();if(gl.areTilesLoaded?.()===false||gl.isStyleLoaded?.()===false||!weatherCanvasReady(gl,item.overlay,sourceModel))return;
    const original=gl.getCanvas(),r=cropRectangle(gl,original,bounds),canvas=doc.createElement('canvas');
    // Bound memory on mobile; no change to the geographic crop.
    const scale=Math.min(1,900/Math.max(r.width,r.height));canvas.width=Math.max(1,Math.round(r.width*scale));canvas.height=Math.max(1,Math.round(r.height*scale));
    const ctx=canvas.getContext('2d',{willReadFrequently:true});if(!ctx)throw Error('瀏覽器無法建立圖卡畫布');
    ctx.drawImage(original,r.x,r.y,r.width,r.height,0,0,canvas.width,canvas.height);
    const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;let visible=0,variation=0;const first=pixels.slice(0,4);for(let i=0;i<pixels.length;i+=Math.max(4,Math.floor(pixels.length/4000/4)*4)){if(pixels[i+3]>0)visible++;if(Math.abs(pixels[i]-first[0])+Math.abs(pixels[i+1]-first[1])+Math.abs(pixels[i+2]-first[2])>8)variation++;}
    if(visible<10||variation<10)throw Error('Windy截圖是空白，請確認WebGL及圖層已載入');
    done(null,canvas);
   }catch(e){done(Error('無法擷取Windy圖片：'+e.message));}};
   gl.on('render',render);controller.signal.addEventListener('abort',cancel,{once:true});timer=setTimeout(()=>done(Error('Windy地圖截圖逾時')),timeoutMs);if(controller.signal.aborted)cancel();else gl.triggerRepaint();
  });}
  async function selectLayer(item,sourceModel){
   // Preload calendar before entering Windy's asynchronous store setter.
   let timer,cancel;
   const calendar=await Promise.race([Promise.resolve().then(()=>products[sourceModel].getCalendar?.()),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error(item.label+'模式時間載入逾時')),timeoutMs);cancel=()=>reject(Error('已取消圖卡下載'));controller.signal.addEventListener('abort',cancel,{once:true});if(controller.signal.aborted)cancel();})]).finally(()=>{clearTimeout(timer);controller.signal.removeEventListener('abort',cancel);});
   if(item.overlay!=='sst'&&calendar?.timestamps?.length&&(snapshot.timestamp<calendar.timestamps[0]||snapshot.timestamp>calendar.timestamps.at(-1)))throw Error(item.label+'不支援所選預報時間，請更換時間後重試');
   let cleanup;const ready=new Promise((resolve,reject)=>{
    let timer;const finish=error=>{clearTimeout(timer);bcast.off('redrawFinished',loaded);controller.signal.removeEventListener('abort',cancel);error?reject(error):resolve();};
    const loaded=params=>{if(params?.overlay===item.overlay&&params?.product===sourceModel&&params?.level==='surface'&&store.get('overlay')===item.overlay&&store.get('product')===sourceModel)finish();};
    const cancel=()=>finish(Error('已取消圖卡下載'));cleanup=()=>finish(Error('圖層切換失敗'));
    bcast.on('redrawFinished',loaded);controller.signal.addEventListener('abort',cancel,{once:true});timer=setTimeout(()=>finish(Error(item.label+'圖層載入逾時')),timeoutMs);
    if(controller.signal.aborted)cancel();
   });ready.catch(()=>{});
   try{check();await set('overlay',item.overlay);await set('product',sourceModel);await set('level','surface');await set('timestamp',snapshot.timestamp);if(item.overlay!=='sst'&&store.get('timestamp')!==snapshot.timestamp)throw Error(item.label+'預報時間被Windy調整，請更換時間後重試');await set('acRange',3);await set('isolinesOn',false);bcast.emit('redrawLayers',{noCache:false});await ready;check();return await renderCrop(item,sourceModel);}catch(error){cleanup?.();throw error;}
  }
  try{
   check();await set('animation',false);if(projection?.type&&projection.type!=='mercator')gl.setProjection({type:'mercator'});
   gl.fitBounds(bounds,{padding:16,duration:0,bearing:0,pitch:0});
   for(let i=0;i<cardProducts.length;i++){
    check();const item=cardProducts[i],sourceModel=item.candidates(snapshot.model).find(m=>products?.[m]?.overlays?.includes(item.overlay));
    if(!sourceModel)throw Error('Windy未提供'+item.label+'圖層');
    onProgress({index:i,total:8,label:item.label});const canvas=await selectLayer(item,sourceModel);const layer=gl.getLayersOrder?.().map(id=>gl.getLayer(id)?.implementation).find(x=>x?.switchableCache),path=String(layer?._latestParams?.path??'');const ts=/^\d{10}$/.test(path)?Date.UTC(+path.slice(0,4),+path.slice(4,6)-1,+path.slice(6,8),+path.slice(8,10)):store.get('timestamp');let legend;try{legend=windyLegend(item.overlay,{...legendAPI,document:doc});}catch(e){canvas.width=canvas.height=1;throw e;}images.push({canvas,legend,label:item.label,overlay:item.overlay,sourceModel,timestamp:ts});
   }
   completed=true;return {images,bounds,attribution:doc.querySelector('.maplibregl-ctrl-attrib-inner,.leaflet-control-attribution')?.textContent?.trim()||'Windy.com'};
  }finally{
   let restoreError;
   // Always restore, including cancellation, unsupported products and canvas errors.
   for(const key of ['overlay','product','level','acRange','isolinesOn','timestamp'])try{await set(key,saved[key]);}catch(e){restoreError=e;}
   try{if(projection?.type&&projection.type!=='mercator')gl.setProjection(projection);gl.jumpTo(camera);}catch(e){restoreError=e;}
   try{await set('animation',saved.animation);}catch(e){restoreError=e;}
   if(!completed)for(const item of images)item.canvas.width=item.canvas.height=1;
   signal?.removeEventListener('abort',abort);busy=false;active=null;
   if(restoreError)throw Error('地圖恢復失敗，請重新選取原圖層：'+restoreError.message);
  }
 }
 return {capture,busy:status,destroy(){closed=true;active?.abort();}};
}

const gmailComposeURL='https://mail.google.com/mail/?view=cm&fs=1&to=aedy48212tw%40gmail.com';
function developerFooter(){return `<aside data-developer-note><h2>備註</h2><p>此擴充套件由航空技術學院 陳智羿老師開發，歡迎大家多加使用！預報內容以 Windy 預報為主，本人僅負責使用介面開發。如有任何建議，或想要擴充的功能，歡迎寄信至 <a href="${gmailComposeURL}" target="_blank" rel="noopener noreferrer">aedy48212tw@gmail.com</a>，一起為氣象預報盡一份力！</p></aside>`;}

const key='ACTweather.cardStyleFavorites';
function cleanFavorite(value){
 if(!value||typeof value.id!=='string'||!value.id||typeof value.name!=='string'||!value.name.trim())throw Error('喜愛風格資料無效');
 const style=cardStyle(value.style);const background=value.background;
 if(background&&(!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(background.data??'')||background.data.length>32*1024*1024))throw Error('喜愛風格底圖資料無效或過大');
 return {id:value.id.slice(0,100),name:value.name.trim().slice(0,60),range:screenshotRange(value.range),style:Object.fromEntries(Object.keys(defaultCardStyle).map(k=>[k,style[k]])),background:background?{name:String(background.name??'喜愛底圖').slice(0,150),data:background.data}:null};
}
function createStyleFavorites({storage,indexedDB}={}){
 async function transact(mode,operation){const db=await new Promise((resolve,reject)=>{let settled=false;const request=indexedDB.open('ACTweather-card-styles',1);const timer=setTimeout(()=>{settled=true;reject(Error('喜愛風格儲存空間開啟逾時'));},5000);request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains('styles'))request.result.createObjectStore('styles',{keyPath:'id'});};request.onsuccess=()=>{clearTimeout(timer);if(settled){request.result.close();return;}resolve(request.result);};request.onerror=()=>{clearTimeout(timer);reject(request.error??Error('無法開啟喜愛風格'));};request.onblocked=()=>{clearTimeout(timer);settled=true;reject(Error('喜愛風格儲存空間被其他視窗占用'));};});
  return new Promise((resolve,reject)=>{let result;try{const tx=db.transaction('styles',mode);tx.oncomplete=()=>{db.close();resolve(result);};tx.onabort=tx.onerror=()=>{db.close();reject(tx.error??Error('喜愛風格未儲存，請檢查瀏覽器儲存空間'));};const req=operation(tx.objectStore('styles'));req.onsuccess=()=>{result=req.result;};}catch(e){db.close();reject(e);}});
 }
 function localList(){if(!storage?.getItem)return [];const rows=JSON.parse(storage.getItem(key)??'[]');if(!Array.isArray(rows))throw Error('喜愛風格清單無效');return rows.map(cleanFavorite);}
 return {async list(){return (indexedDB?await transact('readonly',s=>s.getAll()):localList()).map(cleanFavorite);},async put(value){const record=cleanFavorite(value);if(indexedDB)await transact('readwrite',s=>s.put(record));else {if(!storage?.setItem)throw Error('瀏覽器未允許儲存喜愛風格');const rows=localList().filter(r=>r.id!==record.id);rows.push(record);storage.setItem(key,JSON.stringify(rows));}return record;},async remove(id){if(indexedDB)await transact('readwrite',s=>s.delete(id));else {if(!storage?.setItem)throw Error('瀏覽器未允許刪除喜愛風格');storage.setItem(key,JSON.stringify(localList().filter(r=>r.id!==id)));}}};
}

const finite$2=x=>typeof x==='number'&&Number.isFinite(x);
// Matches Windy's normal timeline formatter: new Date(timestamp).getHours().
const browserOffsetSeconds=timestamp=>-new Date(timestamp).getTimezoneOffset()*60;
function normaliseUtcOffset(value){
 const x=typeof value==='string'&&value.trim()!==''?Number(value):value;
 if(!finite$2(x))return undefined;
 if(Math.abs(x)<=14)return x*3600;
 if(Math.abs(x)<=840)return x*60;
 return Math.abs(x)<=50400?x:undefined;
}
function forecastOffset(payload,t,localOffset){
 if(finite$2(localOffset)&&Math.abs(localOffset)<=50400)return localOffset;
 return normaliseUtcOffset(payload.header?.utcOffset)??browserOffsetSeconds(t);
}

// 使用者 RH 圖示規則；0.1.3 依 RH90→BKN020 範例調整門檻。
const finite$1=x=>typeof x==='number'&&Number.isFinite(x);
const cloudReference=[
 {level:'925h',pressure:925,levelFt:2500,bases:[2000,2500,3000]},
 {level:'850h',pressure:850,levelFt:5000,bases:[4000,5000,6000]},
 {level:'700h',pressure:700,levelFt:10000,bases:[8000,10000,12000]},
 {level:'500h',pressure:500,levelFt:18000,bases:[15000,18000,20000]}
];
function cloudGuidance(w){
 const rows=cloudReference.map(ref=>{
  const input=w.cloudLayers?.find(x=>x.level===ref.level)??w.levels?.find(x=>x.level===ref.level);
  const rh=input?.rh,terrain=w.header?.elevation;
  const height=finite$1(input?.height)?input.height:ref.levelFt/3.28084;
  if(finite$1(terrain)&&height<terrain)return {...ref,rh,status:'below',text:'低於地面，排除判讀'};
  if(!finite$1(rh)||rh<0||rh>100)return {...ref,status:'missing',text:'RH 未提供，無法判讀'};
  if(rh<70)return {...ref,rh,status:'dry',text:'未達雲量判讀門檻'};
  const category=rh>=90?0:rh>=80?1:2,amount=['BKN','BKN–SCT','SCT'][category],baseFt=ref.bases[category];
  return {...ref,rh,status:'estimated',amount,baseFt,code:amount+String(baseFt/100).padStart(3,'0'),metarCode:(amount.includes('BKN')?'BKN':'SCT')+String(baseFt/100).padStart(3,'0')};
 });
 const estimates=rows.filter(x=>x.status==='estimated');
 const lowest=estimates.filter(x=>x.amount.includes('BKN')).sort((a,b)=>a.baseFt-b.baseFt)[0];
 const groups=[...new Set(estimates.sort((a,b)=>a.baseFt-b.baseFt).map(x=>x.metarCode))];
 return {rows,ceiling:lowest?`${lowest.baseFt}呎（${lowest.pressure} hPa）`:'未推定雲幕',ceilingFt:lowest?.baseFt,groups:groups.join(' '),estimated:estimates.length>0};
}
function cloudLines(w){const g=cloudGuidance(w);return {lines:g.rows.map(r=>`${r.pressure} hPa：RH ${finite$1(r.rh)?r.rh.toFixed(0):'未提供'}% → ${r.status==='estimated'?r.code:r.text}`),ceiling:g.ceiling};}

// shortcuts for easier to read formulas
const {PI, sin, cos, tan, asin, atan2: atan, acos, sqrt, abs, round, floor} = Math;
const rad = PI / 180;

// date/time constants and conversions

const dayMs = 1000 * 60 * 60 * 24;
const J1970 = 2440588;
const J2000 = 2451545;
const earthRadius = 6378.14; // equatorial radius in km, for the Moon's topocentric parallax

function fromJulian(j) {
    return new Date((j + 0.5 - J1970) * dayMs);
}
function toDays(date) {
    return date.valueOf() / dayMs - 0.5 + J1970 - J2000;
}

// ΔT = TT − UT in seconds (Espenak & Meeus polynomial fits, good ~1900–2150). The Meeus position
// series are defined in Terrestrial Time, but SunCalc's input Dates are UT — so the position math
// runs on days-since-J2000 shifted by deltaT, while sidereal time stays on UT. ~69 s today;
// negligible for the Sun (<0.001°), real for the Moon. d only needs ~month accuracy here (ΔT
// changes <1 s/yr), so the decimal year is derived arithmetically from d rather than from the Date.
function deltaT(d) {
    const y = 2000 + d / 365.2425;
    let t;
    if (y < 1920) { t = y - 1900; return -2.79 + t * (1.494119 + t * (-0.0598939 + t * (0.0061966 - t * 0.000197))); }
    if (y < 1941) { t = y - 1920; return 21.20 + t * (0.84493 + t * (-0.0761 + t * 0.0020936)); }
    if (y < 1961) { t = y - 1950; return 29.07 + t * (0.407 + t * (-1 / 233 + t / 2547)); }
    if (y < 1986) { t = y - 1975; return 45.45 + t * (1.067 + t * (-1 / 260 - t / 718)); }
    if (y < 2005) { t = y - 2000; return 63.86 + t * (0.3345 + t * (-0.060374 + t * (0.0017275 + t * (0.000651814 + t * 0.00002373599)))); }
    if (y < 2050) { t = y - 2000; return 62.92 + t * (0.32217 + t * 0.005589); }
    t = (y - 1820) / 100; return -20 + 32 * t * t - 0.5628 * (2150 - y);
}
function toDaysTT(d) {
    return d + deltaT(d) / 86400;
}

// general calculations for position

// north-based clockwise azimuth in degrees (0 = N, 90 = E, 180 = S, 270 = W)
function azimuth(H, phi, dec) {
    return (atan(sin(H), cos(H) * sin(phi) - tan(dec) * cos(phi)) / rad + 540) % 360;
}
function altitude(H, phi, dec) {
    return asin(sin(phi) * sin(dec) + cos(phi) * cos(dec) * cos(H));
}

// Greenwich mean sidereal time, formula 12.4 of Meeus (linear term; sub-arcsec T^2/T^3 dropped)
function siderealTime(d, lw) {
    return rad * (280.46061837 + 360.98564736629 * d) - lw;
}

function astroRefraction(h) {
    if (h < 0) h = 0; // formula valid for positive altitudes only

    // Meeus 16.4: 1.02 / tan(h + 10.26 / (h + 5.10)), h in degrees, arcmin result — folded into rad
    return 0.0002967 / tan(h + 0.00312536 / (h + 0.08901179));
}

// general sun calculations

// Sun's apparent equatorial coordinates, Meeus ch. 25. d = days since J2000 (TT); t = Julian centuries.
function sunCoords(d) {
    const t = d / 36525;
    const L0 = rad * (280.46646 + t * (36000.76983 + t * 0.0003032)); // 25.2 geometric mean longitude
    const M = rad * (357.52911 + t * (35999.05029 - t * 0.0001537)); // 25.3 mean anomaly
    const sinM = sin(M);
    const cosM = cos(M);
    const C = rad * ((1.914602 - t * (0.004817 + t * 0.000014)) * sinM + // equation of center
        (0.019993 - 0.000101 * t) * 2 * sinM * cosM + 0.000289 * sinM * (3 - 4 * sinM * sinM));
    const Om = rad * (125.04 - 1934.136 * t); // longitude of the ascending node
    const L = L0 + C - rad * (0.00569 + 0.00478 * sin(Om)); // apparent longitude (nutation + aberration)
    // 22.2 mean obliquity + 25.8 correction for apparent position
    const e = rad * (23.439291 - t * (0.0130042 + t * (0.00000016 - t * 0.000000504))) + rad * 0.00256 * cos(Om);

    return {
        ra: atan(cos(e) * sin(L), cos(L)), // 25.6
        dec: asin(sin(e) * sin(L)),        // 25.7
        lon: L
    };
}

// sun times configuration (angle, morning name, evening name)
const times = [
    [-0.833, 'sunrise', 'sunset'],
    [-0.3, 'sunriseEnd', 'sunsetStart'],
    [-6, 'dawn', 'dusk'],
    [-12, 'nauticalDawn', 'nauticalDusk'],
    [-18, 'nightEnd', 'night'],
    [6, 'goldenHourEnd', 'goldenHour']
];

// calculations for sun times — Meeus ch.15 (rising, transit, setting), solving the Sun's
// local hour angle directly off the same apparent coordinates (sunCoords) and sidereal time
// used by getPosition. Day offsets d are in UT days since J2000; the position series run on TT.

const J0 = 0.0009;

function observerAngle(height) {
    return -2.076 * sqrt(height) / 60;
}

// wrap an angle to (-PI, PI]
function wrapPi(a) {
    return a - 2 * PI * round(a / (2 * PI));
}

// refines a transit time so the Sun's local hour angle is zero (Meeus 15.2; dH/dd ~= 2*PI/day,
// the sidereal excess and the Sun's own motion cancelling to one solar day).
function solarTransit(dt, lw) {
    for (let i = 0; i < 3; i++) {
        const H = wrapPi(siderealTime(dt, lw) - sunCoords(toDaysTT(dt)).ra);
        dt -= H / (2 * PI);
    }
    return dt;
}

// time the Sun reaches altitude h0 on the given side of transit (sign -1 = rise, +1 = set);
// starts from the hour angle at transit and converges with Meeus' altitude correction (15.2).
function getSetJ(h0, dt, sign, lw, phi, decT) {
    const cosH0 = (sin(h0) - sin(phi) * sin(decT)) / (cos(phi) * cos(decT));
    if (cosH0 < -1 || cosH0 > 1) return NaN; // sun stays above / below this altitude all day

    let d = dt + sign * acos(cosH0) / (2 * PI);
    for (let i = 0; i < 2; i++) {
        const c = sunCoords(toDaysTT(d));
        const H = wrapPi(siderealTime(d, lw) - c.ra);
        const h = altitude(H, phi, c.dec);
        const sinH = cos(phi) * cos(c.dec) * sin(H);
        if (abs(sinH) < 1e-6) break; // grazing the horizon — correction is ill-conditioned
        d += (h - h0) / (2 * PI * sinH);
    }
    return d;
}

// solar transit (days since J2000) anchoring the day shared by getTimes and getMoonTimes: the one
// nearest the instant (the solar day containing it), or nearest civil noon when an offset is given
function solarDayTransit(date, lw, utcOffset) {
    const anchor = date.valueOf() ;
    const lon = J0 + lw / (2 * PI);
    return solarTransit(round(toDays(anchor) - lon) + lon, lw);
}

// calculates sun times for a given date, latitude/longitude, and, optionally, the observer height
// (in meters) relative to the horizon and the UTC offset (in minutes) of the observer's time zone

function getTimes(date, lat, lng, height = 0, utcOffset) {

    const lw = rad * -lng;
    const phi = rad * lat;
    const dh = observerAngle(height);
    const dt = solarDayTransit(date, lw);
    const dec = sunCoords(toDaysTT(dt)).dec; // declination at transit, shared by every rise/set solve

    const result = {
        solarNoon: fromJulian(dt + J2000),
        nadir: fromJulian(dt + J2000 - 0.5)
    };

    for (const [angle, riseName, setName] of times) {
        const h0 = (angle + dh) * rad;
        const jrise = getSetJ(h0, dt, -1, lw, phi, dec);
        const jset = getSetJ(h0, dt, 1, lw, phi, dec);

        // a NaN means the Sun never reaches this altitude on this day — report null, not Invalid Date
        result[riseName] = Number.isNaN(jrise) ? null : fromJulian(jrise + J2000);
        result[setName] = Number.isNaN(jset) ? null : fromJulian(jset + J2000);
    }

    // polar day/night: when the Sun never crosses the standard rise/set altitude, flag which side it
    // stays on by comparing its altitude at solar noon (its daily maximum) against that threshold.
    if (result.sunrise === null) {
        const noonAlt = altitude(0, phi, dec);
        const riseSetAlt = (times[0][0] + dh) * rad;
        result.alwaysUp = noonAlt > riseSetAlt;
        result.alwaysDown = noonAlt <= riseSetAlt;
    }

    return result;
}

// moon calculations, based on Meeus ch. 47 (truncated ELP-2000/82 series)

// Nutation in longitude (Δψ) and true obliquity of the ecliptic, both in degrees,
// from the abridged series of Meeus ch. 22 (sub-arcsecond, ample for our needs).
function nutationObliquity(t) {
    const om = rad * (125.04452 - 1934.136261 * t); // longitude of the Moon's ascending node
    const ls = rad * (280.4665 + 36000.7698 * t);   // mean longitude of the Sun
    const lm = rad * (218.3165 + 481267.8813 * t);  // mean longitude of the Moon
    const dpsi = (-17.2 * sin(om) - 1.32 * sin(2 * ls) - 0.23 * sin(2 * lm) + 0.21 * sin(2 * om)) / 3600;
    const deps = (9.20 * cos(om) + 0.57 * cos(2 * ls) + 0.10 * cos(2 * lm) - 0.09 * cos(2 * om)) / 3600;
    const eps0 = 23.439291 - t * (0.0130042 + t * (0.00000016 - t * 0.000000504)); // 22.2 mean obliquity
    return {dpsi, eps: rad * (eps0 + deps)};
}

// Meeus table 47.A — periodic terms for the Moon's longitude (Σl, ×1e-6 deg) and
// distance (Σr, ×1e-3 km). Flat rows of 6: D, M, M', F, Σl, Σr.
const moonLon = new Int32Array([
    0, 0, 1, 0, 6288774, -20905355,
    2, 0, -1, 0, 1274027, -3699111,
    2, 0, 0, 0, 658314, -2955968,
    0, 0, 2, 0, 213618, -569925,
    0, 1, 0, 0, -185116, 48888,
    0, 0, 0, 2, -114332, -3149,
    2, 0, -2, 0, 58793, 246158,
    2, -1, -1, 0, 57066, -152138,
    2, 0, 1, 0, 53322, -170733,
    2, -1, 0, 0, 45758, -204586,
    0, 1, -1, 0, -40923, -129620,
    1, 0, 0, 0, -34720, 108743,
    0, 1, 1, 0, -30383, 104755,
    2, 0, 0, -2, 15327, 10321,
    0, 0, 1, 2, -12528, 0,
    0, 0, 1, -2, 10980, 79661,
    4, 0, -1, 0, 10675, -34782,
    0, 0, 3, 0, 10034, -23210,
    4, 0, -2, 0, 8548, -21636,
    2, 1, -1, 0, -7888, 24208,
    2, 1, 0, 0, -6766, 30824,
    1, 0, -1, 0, -5163, -8379,
    1, 1, 0, 0, 4987, -16675,
    2, -1, 1, 0, 4036, -12831,
    2, 0, 2, 0, 3994, -10445,
    4, 0, 0, 0, 3861, -11650,
    2, 0, -3, 0, 3665, 14403,
    0, 1, -2, 0, -2689, -7003,
    2, 0, -1, 2, -2602, 0,
    2, -1, -2, 0, 2390, 10056,
    1, 0, 1, 0, -2348, 6322,
    2, -2, 0, 0, 2236, -9884,
    0, 1, 2, 0, -2120, 5751,
    0, 2, 0, 0, -2069, 0,
    2, -2, -1, 0, 2048, -4950,
    2, 0, 1, -2, -1773, 4130,
    2, 0, 0, 2, -1595, 0,
    4, -1, -1, 0, 1215, -3958,
    0, 0, 2, 2, -1110, 0,
    3, 0, -1, 0, -892, 3258,
    2, 1, 1, 0, -810, 2616,
    4, -1, -2, 0, 759, -1897,
    0, 2, -1, 0, -713, -2117,
    2, 2, -1, 0, -700, 2354,
    2, 1, -2, 0, 691, 0,
    2, -1, 0, -2, 596, 0,
    4, 0, 1, 0, 549, -1423,
    0, 0, 4, 0, 537, -1117,
    4, -1, 0, 0, 520, -1571,
    1, 0, -2, 0, -487, -1739,
    2, 1, 0, -2, -399, 0,
    0, 0, 2, -2, -381, -4421,
    1, 1, 1, 0, 351, 0,
    3, 0, -2, 0, -340, 0,
    4, 0, -3, 0, 330, 0,
    2, -1, 2, 0, 327, 0,
    0, 2, 1, 0, -323, 1165,
    1, 1, -1, 0, 299, 0,
    2, 0, 3, 0, 294, 0,
    2, 0, -1, -2, 0, 8752
]);

// Meeus table 47.B — periodic terms for the Moon's latitude (Σb, ×1e-6 deg).
// Flat rows of 5: D, M, M', F, Σb.
const moonLat = new Int32Array([
    0, 0, 0, 1, 5128122,
    0, 0, 1, 1, 280602,
    0, 0, 1, -1, 277693,
    2, 0, 0, -1, 173237,
    2, 0, -1, 1, 55413,
    2, 0, -1, -1, 46271,
    2, 0, 0, 1, 32573,
    0, 0, 2, 1, 17198,
    2, 0, 1, -1, 9266,
    0, 0, 2, -1, 8822,
    2, -1, 0, -1, 8216,
    2, 0, -2, -1, 4324,
    2, 0, 1, 1, 4200,
    2, 1, 0, -1, -3359,
    2, -1, -1, 1, 2463,
    2, -1, 0, 1, 2211,
    2, -1, -1, -1, 2065,
    0, 1, -1, -1, -1870,
    4, 0, -1, -1, 1828,
    0, 1, 0, 1, -1794,
    0, 0, 0, 3, -1749,
    0, 1, -1, 1, -1565,
    1, 0, 0, 1, -1491,
    0, 1, 1, 1, -1475,
    0, 1, 1, -1, -1410,
    0, 1, 0, -1, -1344,
    1, 0, 0, -1, -1335,
    0, 0, 3, 1, 1107,
    4, 0, 0, -1, 1021,
    4, 0, -1, 1, 833,
    0, 0, 1, -3, 777,
    4, 0, -2, 1, 671,
    2, 0, 0, -3, 607,
    2, 0, 2, -1, 596,
    2, -1, 1, -1, 491,
    2, 0, -2, 1, -451,
    0, 0, 3, -1, 439,
    2, 0, 2, 1, 422,
    2, 0, -3, -1, 421,
    2, 1, -1, 1, -366,
    2, 1, 0, 1, -351,
    4, 0, 0, 1, 331,
    2, -1, 1, 1, 315,
    2, -2, 0, -1, 302,
    0, 0, 1, 3, -283,
    2, 1, 1, -1, -229,
    1, 1, 0, -1, 223,
    1, 1, 0, 1, 223,
    0, 1, -2, -1, -220,
    2, 1, -1, -1, -220,
    1, 0, 1, 1, -185,
    2, -1, -2, -1, 181,
    0, 1, 2, 1, -177,
    4, 0, -2, -1, 176,
    4, -1, -1, -1, 166,
    1, 0, 1, -1, -164,
    4, 0, 1, -1, 132,
    1, 0, -1, -1, -119,
    4, -1, 0, -1, 115,
    2, -2, 0, 1, 107
]);

// geocentric apparent equatorial coordinates of the Moon, Meeus ch. 47. d = days since J2000 (TT).
function moonCoords(d) {
    const t = d / 36525;

    // fundamental arguments (degrees), 47.1–47.6
    const Lp = 218.3164477 + t * (481267.88123421 + t * (-15786e-7 + t * (1 / 538841 - t / 65194000)));
    const D = 297.8501921 + t * (445267.1114034 + t * (-18819e-7 + t * (1 / 545868 - t / 113065000)));
    const M = 357.5291092 + t * (35999.0502909 + t * (-1536e-7 + t / 24490000));
    const Mp = 134.9633964 + t * (477198.8675055 + t * (0.0087414 + t * (1 / 69699 - t / 14712000)));
    const F = 93.2720950 + t * (483202.0175233 + t * (-36539e-7 + t * (-1 / 3526000 + t / 863310000)));
    const A1 = 119.75 + 131.849 * t;
    const A2 = 53.09 + 479264.290 * t;
    const A3 = 313.45 + 481266.484 * t;
    const E = 1 - t * (0.002516 + t * 0.0000074); // eccentricity factor for solar-anomaly terms

    const Dr = rad * D, Mr = rad * M, Mpr = rad * Mp, Fr = rad * F;
    let sl = 0, sr = 0, sb = 0;
    for (let i = 0; i < moonLon.length; i += 6) {
        const m = moonLon[i + 1];
        const arg = moonLon[i] * Dr + m * Mr + moonLon[i + 2] * Mpr + moonLon[i + 3] * Fr;
        const f = m === 1 || m === -1 ? E : m === 2 || m === -2 ? E * E : 1;
        sl += moonLon[i + 4] * f * sin(arg);
        sr += moonLon[i + 5] * f * cos(arg);
    }
    for (let i = 0; i < moonLat.length; i += 5) {
        const m = moonLat[i + 1];
        const arg = moonLat[i] * Dr + m * Mr + moonLat[i + 2] * Mpr + moonLat[i + 3] * Fr;
        const f = m === 1 || m === -1 ? E : m === 2 || m === -2 ? E * E : 1;
        sb += moonLat[i + 4] * f * sin(arg);
    }

    // additive terms (Venus, Jupiter and flattening of the Earth), 47 p.342
    const A1r = rad * A1, Lpr = rad * Lp;
    sl += 3958 * sin(A1r) + 1962 * sin(Lpr - Fr) + 318 * sin(rad * A2);
    sb += -2235 * sin(Lpr) + 382 * sin(rad * A3) + 175 * sin(A1r - Fr) + 175 * sin(A1r + Fr) +
        127 * sin(Lpr - Mpr) - 115 * sin(Lpr + Mpr);

    const {dpsi, eps} = nutationObliquity(t);
    const l = rad * (Lp + sl / 1e6 + dpsi); // apparent ecliptic longitude
    const b = rad * (sb / 1e6);             // ecliptic latitude

    return {
        ra: atan(sin(l) * cos(eps) - tan(b) * sin(eps), cos(l)),  // 13.3
        dec: asin(sin(b) * cos(eps) + cos(b) * sin(eps) * sin(l)), // 13.4
        dist: 385000.56 + sr / 1000, // distance to the Moon in km
        lon: l
    };
}

function getMoonPosition(date, lat, lng) {
    const lw = rad * -lng;
    const phi = rad * lat;
    const d = toDays(date);
    const c = moonCoords(toDaysTT(d));    // position series run on Terrestrial Time
    const H = siderealTime(d, lw) - c.ra; // sidereal time stays on UT

    // geocentric parallax (Meeus ch.40) lowers the moon along its vertical circle, leaving
    // azimuth unchanged; sin(parallax) = (Earth radius / distance) * cos(geocentric altitude).
    const hGeo = altitude(H, phi, c.dec);
    const h = hGeo - asin(earthRadius / c.dist * cos(hGeo));

    // parallactic angle, Meeus 14.1
    const pa = atan(sin(H), tan(phi) * cos(c.dec) - sin(c.dec) * cos(H));

    return {
        azimuth: azimuth(H, phi, c.dec),
        // apparent (refraction-corrected) altitude in degrees
        altitude: (h + astroRefraction(h)) / rad,
        distance: c.dist,
        parallacticAngle: pa / rad
    };
}

// moon illumination parameters, Meeus ch. 48 (and idlastro's mphase.pro)
function getMoonIllumination(date = new Date()) {
    const d = toDaysTT(toDays(date));
    const s = sunCoords(d);
    const m = moonCoords(d);
    const sdist = 149598000; // distance from Earth to Sun in km
    const phi = acos(sin(s.dec) * sin(m.dec) + cos(s.dec) * cos(m.dec) * cos(s.ra - m.ra));
    const inc = atan(sdist * sin(phi), m.dist - sdist * cos(phi));
    const angle = atan(cos(s.dec) * sin(s.ra - m.ra), sin(s.dec) * cos(m.dec) -
        cos(s.dec) * sin(m.dec) * cos(s.ra - m.ra));

    // elongation in ecliptic longitude, which defines the named phases (Meeus ch. 49, USNO); the RA
    // difference behind `angle` crosses 0/180° hours off conjunction/opposition near the nodes
    const phase = (((m.lon - s.lon) / (2 * PI)) % 1 + 1) % 1;
    const waxing = phase < 0.5;

    return {
        // illuminated fraction, 0 (new) → 1 (full); reaches the exact extrema only at perfect
        // syzygy (eclipses), so a "full" moon typically peaks a hair under 1 — this is correct
        fraction: (1 + cos(inc)) / 2,
        // phase, 0 → 1: 0 new, 0.25 first quarter, 0.5 full, 0.75 last quarter (waxing for phase < 0.5)
        phase,
        // position angle of the bright limb, degrees (v2: all angles emitted in degrees) — subtract
        // getMoonPosition().parallacticAngle, also degrees, to get the zenith-relative tilt
        angle: angle / rad,
        waxing // true while the Moon is waxing (new → full), false while waning (full → new)
    };
}

function hoursLater(date, h) {
    return new Date(date.valueOf() + h * dayMs / 24);
}

// height of the moon's upper limb above the rise/set horizon (deg): topocentric centre altitude plus
// the moon's semidiameter (0.2725 * equatorial horizontal parallax, so it tracks distance: ~0.25° at
// apogee, ~0.28° at perigee) plus the residual horizon refraction our model under-bends (~0.09°,
// tuned vs USNO). Crossing zero == upper-limb rise/set, the USNO convention.
function moonHeight(date, lat, lng) {
    const p = getMoonPosition(date, lat, lng);
    return p.altitude + 0.2725 * asin(earthRadius / p.distance) / rad + 0.09;
}

// polish a crossing time (ms): the quadratic sampler's parabola root sits up to ~0.2° off the true
// altitude curve, so Newton-refine against the real moonHeight. Two central-difference steps drop the
// mean error from ~0.65 to ~0.28 min; more don't help (near grazing dh/dt is small either way).
function refineMoonCross(tMs, lat, lng) {
    for (let i = 0; i < 2; i++) {
        const h = moonHeight(new Date(tMs), lat, lng);
        const dh = (moonHeight(new Date(tMs + 30000), lat, lng) - moonHeight(new Date(tMs - 30000), lat, lng)) / 60000;
        tMs -= h / dh; // dh is degrees per ms, so h/dh is ms
    }
    return tMs;
}

// the moon's local hour angle (radians, unwrapped) at a ms timestamp
function moonHourAngle(t, lw) {
    const d = toDays(t);
    return siderealTime(d, lw) - moonCoords(toDaysTT(d)).ra;
}

// time (ms) in [t0, t0 + 1 day) when the moon's hour angle reaches H0 (0 = upper transit, PI = lower),
// or undefined when the window misses it, about once a month since the lunar day lasts ~24.8 hours
function moonTransit(t0, lw, H0) {
    const rate = 2 * PI * 0.96614 / dayMs; // mean hour angle rate (347.8° per day) in radians per ms
    const a = H0 - moonHourAngle(t0, lw);
    let t = t0 + (a - 2 * PI * floor(a / (2 * PI))) / rate; // first crossing after t0 at the mean rate
    for (let i = 0; i < 2; i++) t -= wrapPi(moonHourAngle(t, lw) - H0) / rate;
    return t < t0 + dayMs ? t : undefined;
}

function getMoonTimes(date, lat, lng, utcOffset) {
    // scan the same day getTimes resolves: the 24 hours from the solar nadir, or from civil midnight
    // when the observer's UTC offset is given
    const t = fromJulian(solarDayTransit(date, rad * -lng) + J2000 - 0.5) ;

    let h0 = moonHeight(t, lat, lng);
    let rise, set, hMax = h0;

    // go in 2-hour chunks, each time seeing if a 3-point quadratic curve crosses zero (which means rise or set)
    for (let i = 1; i <= 24; i += 2) {
        const h1 = moonHeight(hoursLater(t, i), lat, lng);
        const h2 = moonHeight(hoursLater(t, i + 1), lat, lng);
        hMax = Math.max(hMax, h1, h2);
        const a = (h0 + h2) / 2 - h1;
        const b = (h2 - h0) / 2;
        const xe = -b / (2 * a);
        const d = b * b - 4 * a * h1;
        let roots = 0, x1 = 0, x2 = 0;
        const ye = (a * xe + b) * xe + h1;

        if (d >= 0) {
            const dx = sqrt(d) / (abs(a) * 2);
            x1 = xe - dx;
            x2 = xe + dx;
            if (abs(x1) <= 1) roots++;
            if (abs(x2) <= 1) roots++;
            if (x1 < -1) x1 = x2;
        }

        if (roots === 1) {
            if (h0 < 0) rise = i + x1;
            else set = i + x1;

        } else if (roots === 2) {
            rise = i + (ye < 0 ? x2 : x1);
            set = i + (ye < 0 ? x1 : x2);
        }

        if (rise !== undefined && set !== undefined) break;

        h0 = h2;
    }

    const result = {};

    // compare against undefined, not truthiness: a crossing at exactly hour 0 (midnight) is a real
    // event whose numeric value is 0, which a truthy check would wrongly treat as "no event".
    if (rise !== undefined) result.rise = new Date(refineMoonCross(hoursLater(t, rise).valueOf(), lat, lng));
    if (set !== undefined) result.set = new Date(refineMoonCross(hoursLater(t, set).valueOf(), lat, lng));

    // meridian crossings, reported whether or not the moon is above the horizon at the time
    const lw = rad * -lng;
    const transit = moonTransit(t.valueOf(), lw, 0);
    const lowerTransit = moonTransit(t.valueOf(), lw, PI);
    if (transit !== undefined) result.transit = new Date(transit);
    if (lowerTransit !== undefined) result.lowerTransit = new Date(lowerTransit);

    // no crossing all day: flag which side the moon stays on by testing its highest sampled height
    // against the rise/set threshold (already baked into moonHeight), setting both like getTimes does
    if (rise === undefined && set === undefined) {
        result.alwaysUp = hMax > 0;
        result.alwaysDown = hMax <= 0;
    }

    return result;
}

const valid = x => typeof x === 'number' && Number.isFinite(x);
const fmt = (x, n=1) => valid(x) ? x.toFixed(n) : '未提供';
function nearest(ts, t) { if (!ts?.length) throw Error('預報時間序列為空'); return ts.reduce((b,x,i)=>Math.abs(x-t)<Math.abs(ts[b]-t)?i:b,0); }
function normalise(payload, t, localOffset) {
 const d=payload.data, ts=d?.ts;
 if(!Array.isArray(ts)||!ts.length||!ts.every(valid)) throw Error('Windy 回傳格式不符：缺少有效的 data.ts');
 if(t<ts[0]||t>ts.at(-1)) throw Error('所選時間超出此模式可用的預報範圍，請調整 Windy 時間軸');
 const i=nearest(ts,t), m=payload.meteogram, s=payload.sounding;
 const read=(o,k)=>o?.ts?.length ? o[k]?.[nearest(o.ts,ts[i])] : undefined;
 const kelvin=x=>valid(x)?x-273.15:undefined;
 const offset=forecastOffset(payload,t,localOffset);
 const day=x=>new Date(x+offset*1000).toISOString().slice(0,10);
 const ids=ts.map((x,j)=>day(x)===day(t)?j:-1).filter(j=>j>=0);
 const temps=ids.map(j=>kelvin(d.temperature?.[j])).filter(valid);
 const daily=Array.isArray(payload.summary)?payload.summary.find(x=>day(x.timestamp)===day(t)):undefined;
 const stepHours=j=>{const hours=((j>0?ts[j]-ts[j-1]:ts[1]-ts[0])/3600000);return valid(hours)&&hours>0?hours:undefined;};
 const rows=ids.map(j=>({hours:stepHours(j),ts:ts[j],temp:kelvin(d.temperature?.[j]),wind:d.wind?.[j],dir:d.windDir?.[j],rain:d.precipAmount?.[j],icon:d.icon?.[j]}));
 const rh=read(s,'rh-surface');
 const dew=kelvin(read(m,'dewPoint')??read(s,'dewPoint-surface'));
 const temp=kelvin(d.temperature?.[i]);
 const humidity=valid(rh)?rh:valid(temp)&&valid(dew)?Math.min(100,100*Math.exp(17.625*dew/(243.04+dew)-17.625*temp/(243.04+temp))):undefined;
 return {requestedTs:t,ts:ts[i],offset,day:day(t),temp,dew,humidity,wind:d.wind?.[i],dir:d.windDir?.[i],gust:d.windGust?.[i],pressure:valid(d.pressure?.[i])?d.pressure[i]/100:undefined,cloudBase:read(m,'cloudBase'),icon:d.icon?.[i],rain:d.precipAmount?.[i],rainHours:stepHours(i),rainRate:valid(d.precipAmount?.[i])&&valid(stepHours(i))?d.precipAmount[i]/stepHours(i):undefined,visibility:valid(d.visibility?.[i])?d.visibility[i]:read(m,'visibility'),rainDaily:rows.every(x=>valid(x.rain))?rows.reduce((a,x)=>a+x.rain,0):undefined,max:valid(daily?.tempMax)?kelvin(daily.tempMax):temps.length?Math.max(...temps):undefined,min:valid(daily?.tempMin)?kelvin(daily.tempMin):temps.length?Math.min(...temps):undefined,hasSummary:!!daily,rows,header:payload.header??{},cloudLayers:['925h','850h','700h','500h'].map(level=>({level,rh:read(s,'rh-'+level),height:read(s,'gh-'+level)??read(m,'gh-'+level)})),levels:Object.keys(s??{}).filter(k=>/^rh-\d+h$/.test(k)).map(k=>({level:k.slice(3),rh:read(s,k),height:read(s,k.replace('rh-','gh-')),wind:read(s,k.replace('rh-','wind-')),dir:read(s,k.replace('rh-','windDir-'))})).filter(x=>valid(x.height)&&valid(x.rh)&&x.height>=(payload.header?.elevation??0))};
}
function clock(t, offset=0, date=false) { if(!valid(t))return '當日無事件／未提供'; return new Date(t+offset*1000).toISOString().slice(date?0:11,date?16:16).replace('T',' '); }
function astronomy(day,offset,lat,lon,timestamp) {
 const noon=new Date(Date.parse(day+'T12:00:00Z')-offset*1000);
 const sun=getTimes(noon,lat,lon);
 const start=Date.parse(day+'T00:00:00Z')-offset*1000,end=start+86400000;
 const moons=[-1,0,1,2].map(n=>getMoonTimes(new Date(start+n*86400000),lat,lon));
 const event=k=>moons.map(m=>m[k]?.getTime()).find(t=>valid(t)&&t>=start&&t<end);
 let lunar='未提供';try {lunar=new Intl.DateTimeFormat('zh-TW-u-ca-chinese',{timeZone:'UTC',month:'long',day:'numeric'}).format(new Date(noon.getTime()+offset*1000));}catch{}
 return {sun:`${clock(sun.sunrise?.getTime(),offset)} – ${clock(sun.sunset?.getTime(),offset)}`,moon:`月出 ${clock(event('rise'),offset)}；月沒 ${clock(event('set'),offset)}；農曆 ${lunar}；月照 ${fmt(getMoonIllumination(new Date(valid(timestamp)?timestamp:noon.getTime())).fraction*100)}%`};
}
function windCode(speed,dir,gust) {
 if(!valid(speed))return '/////KT'; const kt=Math.round(speed*1.943844); if(kt===0)return '00000KT';
 const direction=valid(dir)?String(Math.round(((dir%360)+360)%360/10)*10||360).padStart(3,'0'):'///';
 return `${direction}${String(kt).padStart(2,'0')}${valid(gust)&&gust-speed>=5.14444?'G'+String(Math.round(gust*1.943844)).padStart(2,'0'):''}KT`;
}
const tc=x=>valid(x)?(Math.round(x)<0?'M':'')+String(Math.abs(Math.round(x))).padStart(2,'0'):'//';
function metar(w,manual={}) {
 const stamp=new Date(w.ts).toISOString().slice(8,16).replace(/[-T:]/g,'')+'Z';
 const manualQ=valid(manual.qnh)&&manual.qnh>=800&&manual.qnh<=1100;
 const q=manualQ?manual.qnh:valid(w.pressure)&&w.pressure>0?w.pressure:undefined;
 const manualVisibility=valid(manual.visibility)&&manual.visibility>=0&&manual.visibility<=9999;
 const visibilityValue=manualVisibility?manual.visibility:w.visibility;
 const vis=valid(visibilityValue)&&visibilityValue>=0?String(Math.floor(visibilityValue/ (visibilityValue<800?50:visibilityValue<5000?100:1000))*(visibilityValue<800?50:visibilityValue<5000?100:1000)).padStart(4,'0'): '////';
 const visibility=(manualVisibility&&visibilityValue===9999)||visibilityValue>=10000?'9999':vis;
 const manualClouds=/^(?:(?:FEW|SCT|BKN|OVC)\d{3}|VV\d{3})(?: (?:FEW|SCT|BKN|OVC)\d{3})*$/.test(manual.clouds??'');
 const clouds=manualClouds?manual.clouds:cloudGuidance(w).groups||'//////';
 const rain=rainDescription(w.rainRate,w.icon);
 const station=/^[A-Z]{4}$/.test(manual.station??'')?manual.station:'////';
 return `FORECAST METAR ${station} ${stamp} ${windCode(w.wind,w.dir,w.gust)} ${visibility}${rain.code?' '+rain.code:''} ${clouds} ${tc(w.temp)}/${tc(w.dew)} ${valid(q)?'Q'+String(Math.floor(q)).padStart(4,'0'):'Q////'} RMK MODEL FORECAST NOT OBSERVATION${valid(q)&&!manualQ?' Q_FROM_MODEL_PRESSURE':''}${!manualClouds&&cloudGuidance(w).estimated?' CLOUD_FROM_RH':''}${!manualVisibility&&valid(w.visibility)?' VIS_FROM_WINDY'+(w.visibilitySource&&/^[a-zA-Z0-9]+$/.test(w.visibilitySource)?' VIS_MODEL_'+w.visibilitySource.toUpperCase():''):''}${valid(w.rainRate)?' RAIN_RATE_'+w.rainRate.toFixed(1)+'MMH':''}${valid(q)?' A'+String(Math.round(q/33.863886666667*100)).padStart(4,'0'):''}`;
}
const sky=icon=>({1:'晴朗',2:'晴時多雲',3:'多雲',4:'陰天',5:'晴時多雲有雨',6:'多雲有雨',7:'陰天有雨',8:'晴時多雲有雪',9:'多雲有雪',10:'陰天有雪',11:'晴時多雲有雨雪',12:'多雲有雨雪',13:'陰天有雨雪',14:'陰天有雷雨',15:'陰天有雷雪',16:'雷雨雪',17:'霧',18:'晴時多雲有陣雨',19:'多雲有陣雨',20:'陰天有陣雨',21:'多雲有雷雨',22:'晴、有霧',23:'陰天有雷暴',24:'多雲有雷暴'}[icon]??'未提供');

function rainDescription(rate,icon){
 if(!valid(rate)||rate<0)return {text:'未提供雨勢',code:''};
 if(rate===0)return {text:'無降雨',code:''};
 const thunder=[14,16,21,23,24].includes(icon);
 const rain=thunder?'雷雨':'雨',code=thunder?'TSRA':'RA';
 if(rate<=1)return {text:'偶小'+rain,code:'-'+code};
 if(rate<3)return {text:'小'+rain,code:'-'+code};
 if(rate<40)return {text:'中'+rain,code};
 return {text:'大'+rain,code:'+'+code};
}

const safeName=name=>String(name||'指定地點').replace(/[\\/:*?"<>|\x00-\x1f]/g,'_').slice(0,60);
const cardFileNames=(name,ts)=>{const base='ACTweather_'+safeName(name)+'_'+new Date(ts).toISOString().slice(0,16).replace(/[-:T]/g,'')+'UTC';return {images:[base+'_01_氣象.png',base+'_02_海象電碼.png'],zip:base+'_兩張預報圖卡.zip'};};
function wrapLines(ctx,text,width){const result=[];for(const row of String(text).split('\n')){let line='';for(const char of Array.from(row)){if(line&&ctx.measureText(line+char).width>width){result.push(line);line=char;}else line+=char;}result.push(line);}return result;}
function blobOf(canvas){return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(Error('圖卡PNG編碼失敗')),'image/png'));}
const coordinateLabel=(value,lat=false)=>`${Math.abs(lat?value:((value+180)%360+360)%360-180).toFixed(2)}°${(lat?value:((value+180)%360+360)%360-180)<0?(lat?'S':'W'):(lat?'N':'E')}`;
function textLayout(ctx,rows,width,style,initial='act'){
 let section=initial;const out=[];
 for(const row of rows){if(row==='海象預報')section='marine';if(row==='METAR預報電碼')section='metar';const size=style[section+'Font'];const title=['ACT預報','海象預報','METAR預報電碼'].includes(row);const label=String(row).match(/^\d+\.[^：\n]+：/)?.[0]??'';const text=String(row);let current=[],lineWidth=0;
  for(const [index,char] of Array.from(text).entries()){
   if(char==='\n'){out.push({runs:current,size});current=[];lineWidth=0;continue;}
   const bold=style.boldTitles&&(title||index<label.length);ctx.font=`${bold?'bold ':''}${size}px sans-serif`;const w=ctx.measureText(char).width;
   if(lineWidth+w>width&&current.length){let cut=current.length;if(/[A-Za-z0-9]/.test(char)){while(cut>0&&/[A-Za-z0-9]/.test(current[cut-1].char))cut--;if(cut===0)cut=current.length;}const rest=current.slice(cut);out.push({runs:current.slice(0,cut),size});current=rest;lineWidth=rest.reduce((a,r)=>{ctx.font=`${r.bold?'bold ':''}${size}px sans-serif`;return a+ctx.measureText(r.char).width;},0);}
   current.push({char,bold});lineWidth+=w;
  }out.push({runs:current,size});
 }return out;
}
function drawTextRows(ctx,rows,x,y,color){ctx.fillStyle=color;for(const row of rows){y+=row.size;let dx=x;for(const run of row.runs){ctx.font=`${run.bold?'bold ':''}${row.size}px sans-serif`;ctx.fillText(run.char,dx,y);dx+=ctx.measureText(run.char).width;}y+=Math.ceil(row.size*.32);}return y;}
function drawLegend(ctx,legend,x,y,w){
 if(!legend?.colors?.length||!legend?.labels?.length)throw Error('截圖缺少Windy產品色階');
 ctx.fillStyle='#fff';ctx.fillRect(x,y,w,30);const gradient=ctx.createLinearGradient(x,y,x+w,y);legend.colors.forEach((c,i)=>gradient.addColorStop(i/(legend.colors.length-1),c));ctx.fillStyle=gradient;ctx.fillRect(x,y,w,30);ctx.strokeStyle='#ffffff';ctx.lineWidth=1;ctx.strokeRect(x,y,w,30);
 ctx.textAlign='center';ctx.font='18px sans-serif';const segment=w/legend.labels.length;
 legend.labels.forEach((label,i)=>{const cx=x+segment*(i+.5);ctx.fillStyle='#fff';ctx.strokeStyle='#17212b';ctx.lineWidth=3;ctx.strokeText(label,cx,y+23,segment-2);ctx.fillText(label,cx,y+23,segment-2);});ctx.textAlign='left';
}
async function composeCards(snapshot,capture,{document:doc=globalThis.document}={}){
 if(capture.images?.length!==8)throw Error('需完整取得八張Windy圖層截圖');await doc.fonts?.ready;
 const style=cardStyle(snapshot.style),width=2400,pad=52+style.borderWidth*2,rightX=1260,rightW=width-rightX-pad;
 const measure=doc.createElement('canvas').getContext('2d');if(!measure)throw Error('瀏覽器無法建立圖卡');
 const groups=[snapshot.act,snapshot.second],rows=groups.map(r=>textLayout(measure,r,rightW,style));
 measure.font=`${style.noteStyle==='normal'?'':style.noteStyle+' '}${style.noteSize}px sans-serif`;
 const note=style.note?wrapLines(measure,style.note,style.notePosition==='right'?rightW:width-pad*2):[];
 const noteH=note.length*Math.ceil(style.noteSize*1.35)+(note.length?20:0),headerY=Math.max(64,style.border==='none'?64:style.borderWidth*4+62),top=headerY+90+(style.notePosition==='top'?noteH:0),footerSpace=100+(style.notePosition==='bottom'?noteH:0)+pad;
 const textH=r=>r.reduce((a,b)=>a+Math.ceil(b.size*1.32),0);
 const height=Math.ceil(Math.max(1700,top+Math.max(...rows.map(textH))+(style.notePosition==='right'?noteH:0)+footerSpace));if(height>4800)throw Error('文字與字級超出圖卡限制，請減少文字或縮小字級');
 const result=[],names=cardFileNames(snapshot.point.name,snapshot.timestamp);
 try{for(let page=0;page<2;page++){
  const canvas=doc.createElement('canvas');canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d');if(!ctx)throw Error('瀏覽器無法建立圖卡');
  ctx.globalAlpha=style.backgroundOpacity/100;let fill=style.background;if(style.gradient){fill=ctx.createLinearGradient(0,0,width,height);fill.addColorStop(0,style.background);fill.addColorStop(1,style.background2);}ctx.fillStyle=fill;ctx.fillRect(0,0,width,height);ctx.globalAlpha=1;
  if(snapshot.backgroundImage){const image=snapshot.backgroundImage;ctx.save();ctx.globalAlpha=style.imageOpacity/100;ctx.drawImage(image,0,0,width,height);ctx.restore();}
  ctx.fillStyle=style.textColor;ctx.font=`${style.boldTitles?'bold ':''}42px sans-serif`;ctx.fillText(`ACTweather ${page===0?'氣象預報':'海象與航空預報'} ${page+1}/2`,pad,headerY);
  ctx.font='26px sans-serif';ctx.fillText(`${snapshot.point.name}　預報時間：${clock(snapshot.timestamp,snapshot.offset,true)} LST ／ ${clock(snapshot.timestamp,0,true)} UTC`,pad,headerY+46,width-pad*2);
  const leftW=1160-(pad-44),gap=30,tileW=(leftW-gap)/2,bottom=height-footerSpace,tileH=(bottom-top-gap)/2;
  for(let i=0;i<4;i++){
   const item=capture.images[page*4+i],x=pad+(i%2)*(tileW+gap),y=top+Math.floor(i/2)*(tileH+gap),mapAreaH=tileH-160;
   // Inner plot leaves margins for all four geographic frame labels.
   const scale=Math.min((tileW-90)/item.canvas.width,(mapAreaH-54)/item.canvas.height),w=item.canvas.width*scale,h=item.canvas.height*scale,ix=x+(tileW-w)/2,iy=y+28+(mapAreaH-54-h)/2;
   ctx.drawImage(item.canvas,ix,iy,w,h);ctx.strokeStyle=style.textColor;ctx.lineWidth=1;ctx.strokeRect(ix,iy,w,h);
   const [[west,south],[east,north]]=capture.bounds,merc=lat=>Math.log(Math.tan(Math.PI/4+lat*Math.PI/360));
   ctx.fillStyle=style.textColor;ctx.font='17px sans-serif';ctx.textAlign='center';
   for(const [lon,p] of [[west,0],[(west+east)/2,.5],[east,1]]){ctx.textAlign=p===0?'left':p===1?'right':'center';ctx.fillText(coordinateLabel(lon),ix+p*w,iy-8);ctx.fillText(coordinateLabel(lon),ix+p*w,iy+h+23);}
   for(const lat of [north,(north+south)/2,south]){ctx.textAlign=lat===north?'right':lat===south?'left':'center';const py=iy+(merc(north)-merc(lat))/(merc(north)-merc(south))*h;ctx.save();ctx.translate(ix-16,py);ctx.rotate(-Math.PI/2);ctx.fillText(coordinateLabel(lat,true),0,0);ctx.restore();ctx.save();ctx.translate(ix+w+29,py);ctx.rotate(-Math.PI/2);ctx.fillText(coordinateLabel(lat,true),0,0);ctx.restore();}
   const px=ix+(snapshot.point.lon-west)/(east-west)*w,py=iy+(merc(north)-merc(snapshot.point.lat))/(merc(north)-merc(south))*h;
   ctx.beginPath();ctx.arc(px,py,9,0,Math.PI*2);ctx.fillStyle='#ff334f';ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.stroke();
   ctx.textAlign='center';ctx.fillStyle=style.textColor;ctx.font=`${style.boldTitles?'bold ':''}29px sans-serif`;ctx.fillText(item.label,x+tileW/2,y+mapAreaH+30);
   ctx.font='19px sans-serif';ctx.fillText(item.sourceModel+' · '+clock(item.timestamp,0,true)+' UTC',x+tileW/2,y+mapAreaH+59);ctx.textAlign='left';drawLegend(ctx,item.legend,x,y+mapAreaH+77,tileW);
  }
  const textEnd=drawTextRows(ctx,rows[page],rightX,top,style.textColor);
  if(note.length){ctx.font=`${style.noteStyle==='normal'?'':style.noteStyle+' '}${style.noteSize}px sans-serif`;ctx.fillStyle=style.noteColor;let ny=style.notePosition==='top'?headerY+81:style.notePosition==='right'?textEnd+30:height-footerSpace+25;const nx=style.notePosition==='right'?rightX:pad;for(const row of note){ctx.fillText(row,nx,ny+style.noteSize);ny+=Math.ceil(style.noteSize*1.35);}}
  ctx.font='20px sans-serif';ctx.fillStyle=style.textColor;ctx.fillText(`Windy.com　© OpenStreetMap contributors　|　${capture.attribution||'Windy.com'}`.slice(0,160),pad,height-pad-40,width-pad*2);
  ctx.fillText(`經度 ${capture.bounds[0][0].toFixed(3)}°～${capture.bounds[1][0].toFixed(3)}°　緯度 ${capture.bounds[0][1].toFixed(3)}°～${capture.bounds[1][1].toFixed(3)}°　|　FORECAST 模式預報`,pad,height-pad-10,width-pad*2);
  if(style.border!=='none'){ctx.strokeStyle=style.borderColor;ctx.lineWidth=style.borderWidth;ctx.setLineDash(style.border==='dashed'?[24,14]:style.border==='dotted'?[style.borderWidth,style.borderWidth*2]:[]);const inset=style.borderWidth*2;ctx.strokeRect(inset,inset,width-inset*2,height-inset*2);if(style.border==='double'){ctx.lineWidth=Math.max(1,style.borderWidth/3);ctx.strokeRect(inset+style.borderWidth*2,inset+style.borderWidth*2,width-inset*2-style.borderWidth*4,height-inset*2-style.borderWidth*4);}ctx.setLineDash([]);}
  const blob=await blobOf(canvas);result.push({blob,name:names.images[page],width,height});canvas.width=canvas.height=1;
 }}finally{for(const item of capture.images)item.canvas.width=item.canvas.height=1;}
 return {files:result,zipName:names.zip};
}
const crcTable=Array.from({length:256},(_,i)=>{for(let j=0;j<8;j++)i=(i&1)?0xedb88320^(i>>>1):i>>>1;return i>>>0;});
function crc32(bytes){let crc=0xffffffff;for(const byte of bytes)crc=crcTable[(crc^byte)&255]^(crc>>>8);return (crc^0xffffffff)>>>0;}
async function zipCards(files){
 const chunks=[],central=[];let offset=0,size=0;const encoder=new TextEncoder();
 const set=(view,pos,value,bytes)=>bytes===2?view.setUint16(pos,value,true):view.setUint32(pos,value,true);
 for(const file of files){const bytes=new Uint8Array(await file.blob.arrayBuffer()),name=encoder.encode(file.name),crc=crc32(bytes);const header=new Uint8Array(30+name.length),v=new DataView(header.buffer);set(v,0,0x04034b50,4);set(v,4,20,2);set(v,6,0x800,2);set(v,12,0x21,2);set(v,14,crc,4);set(v,18,bytes.length,4);set(v,22,bytes.length,4);set(v,26,name.length,2);header.set(name,30);chunks.push(header,bytes);
  const c=new Uint8Array(46+name.length),cv=new DataView(c.buffer);set(cv,0,0x02014b50,4);set(cv,4,20,2);set(cv,6,20,2);set(cv,8,0x800,2);set(cv,14,0x21,2);set(cv,16,crc,4);set(cv,20,bytes.length,4);set(cv,24,bytes.length,4);set(cv,28,name.length,2);set(cv,42,offset,4);c.set(name,46);central.push(c);offset+=header.length+bytes.length;size+=c.length;
 }
 const end=new Uint8Array(22),v=new DataView(end.buffer);set(v,0,0x06054b50,4);set(v,8,files.length,2);set(v,10,files.length,2);set(v,12,size,4);set(v,16,offset,4);return new Blob([...chunks,...central,end],{type:'application/zip'});
}
function downloadFile(doc,url,name){const a=doc.createElement('a');a.href=url;a.download=name;a.rel='noopener';doc.body.appendChild(a);a.click();a.remove();}

const defaultPoint={lat:25.038,lon:121.514,name:'中央氣象署 臺北測站'};
const validPoint=p=>p&&typeof p.lat==='number'&&Number.isFinite(p.lat)&&Math.abs(p.lat)<=90&&typeof p.lon==='number'&&Number.isFinite(p.lon)&&Math.abs(p.lon)<=180;
function coordinates(text){const m=String(text).trim().match(/^([+-]?\d+(?:\.\d+)?)\s*[,，\s]\s*([+-]?\d+(?:\.\d+)?)$/);if(!m)return null;const p={lat:Number(m[1]),lon:Number(m[2]),name:String(text).trim()};if(!validPoint(p))throw Error('請按緯度、經度輸入；緯度 −90～90，經度 −180～180');return p;}
async function searchPlaces(query,request=globalThis.fetch){
 const coord=coordinates(query);if(coord)return [coord];
 const input=String(query).trim();if(input.length<2)throw Error('請輸入至少兩個字的地名，或緯度、經度');
 const taipei=defaultPoint.name.includes(input.replace('台北','臺北'))||['台北測站','臺北測站','中央氣象署'].includes(input);
 const url=new URL('https://geocoding-api.open-meteo.com/v1/search');url.search=new URLSearchParams({name:input,count:'8',language:'zh',format:'json'});
 let timer;const controller=new AbortController();
 try{timer=setTimeout(()=>controller.abort(),10000);const response=await request(url.toString(),{signal:controller.signal});if(!response.ok)throw Error('地名服務 HTTP '+response.status);const data=await response.json();const found=(data.results??[]).map(x=>({lat:x.latitude,lon:x.longitude,name:[x.name,x.admin1,x.country].filter(Boolean).join('／')})).filter(validPoint);return taipei?[defaultPoint,...found]:found;}
 catch(error){if(taipei)return [defaultPoint];throw Error('地名搜尋失敗，可改用經緯度：'+error.message);}
 finally{clearTimeout(timer);}
}
function readFavorites(storage){try{const data=JSON.parse(storage?.getItem('ACTweather.favorites')??'[]');return Array.isArray(data)?data.filter(p=>validPoint(p)&&typeof p.name==='string').slice(0,100):[];}catch{return [];}}
function writeFavorites(storage,favorites){try{storage?.setItem('ACTweather.favorites',JSON.stringify(favorites));return true;}catch{return false;}}

const hpaToInHg=q=>valid(q)&&q>0?q/33.863886666667:undefined;
function pressureValues(w,manual={}) {
 const artificial=valid(manual.qnh)&&manual.qnh>=800&&manual.qnh<=1100;
 const q=artificial?manual.qnh:w.pressure;
 const a=hpaToInHg(q);
 return {q,a,manual:artificial,qCode:valid(a)?'Q'+String(Math.floor(q)).padStart(4,'0'):'Q////',aCode:valid(a)?'A'+String(Math.round(a*100)).padStart(4,'0'):'A////'};
}
const effectiveTime=w=>`${clock(w.requestedTs??w.ts,w.offset,true)}(LST地方時)；${clock(w.requestedTs??w.ts,0,true)} (UTC)`;
const modelName=model=>({gfs:'GFS',ecmwf:'ECMWF',icon:'ICON',mblue:'METEOBLUE'}[model]??String(model??'未提供').toUpperCase());
function rainLine(w){return `${rainDescription(w.rainRate,w.icon).text}；${fmt(w.rain)}mm/${valid(w.rainHours)?w.rainHours+'小時預報':'預報時段未提供'}；當日預報合計${fmt(w.rainDaily)}mm`;}

const compassNames=['北','北北東','東北','東北東','東','東南東','東南','南南東','南','南南西','西南','西南西','西','西北西','西北','北北西'];
const compass=deg=>valid(deg)?compassNames[Math.floor((((deg%360)+360)%360+11.25)/22.5)%16]:'未提供';
const windDirection=(deg,speed)=>valid(speed)&&speed<0.257222?'靜風':valid(deg)?`${compass(deg)}風（${fmt(((deg%360)+360)%360,0)}°）`:'風向未提供';
function beaufort(speed){if(!valid(speed)||speed<0)return undefined;return [0.3,1.6,3.4,5.5,8,10.8,13.9,17.2,20.8,24.5,28.5,32.7].filter(x=>speed>=x).length;}
const speedText=(value,unit)=>valid(value)&&value>=0?`${fmt(value*({kt:1.943844,'m/s':1,'km/h':3.6}[unit]??1),unit==='m/s'?2:1)} ${unit}`:'未提供';
const upperWind=x=>windCode(x.wind,x.dir);
const catText=value=>!valid(value)||value<0?'未提供':`${value>=79?'極強':value>=44?'強':value>=20?'中度':value>=15?'輕度':'未達輕度門檻'}`;
function sampleChannels({pixels,width=257,height=257,header},position,params,channels=['R']){
 if(width!==257||height!==257||pixels?.length!==257*257*4)throw Error('Windy 資料圖磚格式無效');
 const x=Math.min(256,Math.max(0,position.x)),y=Math.min(256,Math.max(0,position.y)),x0=Math.floor(x),y0=Math.floor(y),dx=x-x0,dy=y-y0;
 return channels.map(channel=>{
  const min=header?.['decoder'+channel+'min'],step=header?.['decoder'+channel+'step'],index={R:0,G:1,B:2}[channel],transform=params['transform'+channel];
  if(!valid(min)||!valid(step)||step<0)throw Error('Windy 圖磚通道無效');
  const value=(px,py)=>{const i=(py*257+px)*4;if((params.JPGtransparency&&pixels[i+2]>=192)||(params.PNGtransparency&&pixels[i+3]<1))throw Error('此地點無可用資料（陸地／海岸遮罩或資料缺值）');const raw=pixels[i+index]*step+min,result=transform?transform(raw):raw;if(!valid(result))throw Error('Windy 數值無效');return result;};
  // Do not reject masked corners with zero weight at exact grid locations.
  let result=0;for(const [px,py,weight] of [[x0,y0,(1-dx)*(1-dy)],[Math.min(256,x0+1),y0,dx*(1-dy)],[x0,Math.min(256,y0+1),(1-dx)*dy],[Math.min(256,x0+1),Math.min(256,y0+1),dx*dy]])if(weight>0)result+=value(px,py)*weight;
  return result;
 });
}
const directionFrom=(u,v)=>((Math.atan2(u,v)*180/Math.PI+180)%360+360)%360;
function decodedLayer(layer,channels){
 if(layer==='waves'){const [u,v,height]=channels;if(!valid(height)||height<0)throw Error('浪高無效');return {height,dir:Math.hypot(u,v)>1e-6?directionFrom(u,v):undefined};}
 if(layer==='currents'||layer==='wind'){const [u,v]=channels;return {speed:Math.hypot(u,v),dir:Math.hypot(u,v)>1e-6?(directionFrom(u,v)+(layer==='currents'?180:0))%360:undefined};}
 const [value]=channels;if(!valid(value)||(layer!=='sst'&&value<0))throw Error('Windy 數值無效');return layer==='sst'?value-273.15:value;
}
function sourceText(record,offset=0){if(!record)return '正在載入…';if(record.error)return '未提供：'+record.error;return `${record.sourceModel}；資料時間 ${record.path?/^\d{10}$/.test(record.path)?record.path.slice(0,4)+'-'+record.path.slice(4,6)+'-'+record.path.slice(6,8)+' '+record.path.slice(8,10)+':00 UTC':record.path+' UTC':'未提供'}；起報 ${record.refTime??'未提供'}`;}
function marineLines(state,timestamp,offset=0){
 const records=state.marine??{},r=key=>records[key],v=key=>r(key)?.value,withSource=(key,text)=>text,wind=v('wind'),waves=v('waves'),current=v('currents');
 return [['🚩','地點',state.name],['🧭','經緯度',`${state.lat.toFixed(7)}, ${state.lon.toFixed(7)}`],['🕒','預報時間',`${clock(timestamp,offset,true)}(LST地方時)；${clock(timestamp,0,true)} (UTC)`],['➤','風向／風速及浦福風級',withSource('wind',wind?`${windDirection(wind.dir,wind.speed)}；${speedText(wind.speed,state.seaWind)}；${beaufort(wind.speed)} 級`:'未提供')],['🌡','海溫',withSource('sst',valid(v('sst'))?`${fmt(v('sst'))} °C`:'未提供')],['🌊','波浪浪向／浪高',withSource('waves',waves?`${valid(waves.dir)?compass(waves.dir)+'方來浪（'+fmt(waves.dir,0)+'°）':'浪向未提供'}；有效波高 ${fmt(waves.height)} m`:'未提供')],['🌊','海流流向／流速',withSource('currents',current?`${valid(current.dir)?'流向'+compass(current.dir)+'方（'+fmt(current.dir,0)+'°）':'靜流／流向未提供'}；${speedText(current.speed,state.seaCurrent)}`:'未提供')]];
}

// Nominal pressure-altitude labels, independent of forecast geopotential height.
const levelReferences={1000:'400ft',975:'1100ft',950:'1800ft',925:'2500ft',900:'3200ft',850:'5000ft',800:'6500ft',750:'8100ft',700:'10000ft',650:'11800ft',600:'14000ft',550:'16000ft',500:'FL180',450:'FL210',400:'FL240',350:'FL270',300:'FL300',250:'FL340',200:'FL390',150:'FL450'};
function sortedLevels(levels=[]){return [...levels].filter(x=>/^\d+h$/.test(x.level)&&parseInt(x.level)>=150&&parseInt(x.level)<=1000).sort((a,b)=>parseInt(a.level)-parseInt(b.level));}
function pressureLevelLine(x){const pressure=parseInt(x.level),alt=levelReferences[pressure];return `${pressure}hPa${alt?'('+alt+')':''}：RH ${valid(x.rh)?fmt(x.rh,0)+'%':'未提供'}；高空風 ${upperWind(x)}`;}

const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function mountACT(root, api) {
 const state={...defaultPoint,copyIcons:false,sourcesOpen:false,cardRange:2,cardStyle:cardStyle(),cardDesignOpen:false,cardBackground:null,styleFavorites:[],styleFavoriteName:'',styleFavoriteBusy:true,exportBusy:false,exportProgress:'',exportResult:null,favorites:readFavorites(api.storage),searchResults:[],searchBusy:false,searchQuery:'',visibilityRecord:null,extras:{},marine:{},marineBusy:false,seaWind:'kt',seaCurrent:'kt',model:'auto',tab:0,theme:'dark',icons:true,wind:'kt',temp:'C',height:'ft',manual:{},payload:null,busy:false,error:'',notice:''};
 try {Object.assign(state,JSON.parse(api.storage?.getItem('ACTweather.settings')??'{}'));}catch{}
 state.cardStyle=cardStyle(state.cardStyle);try{state.cardRange=screenshotRange(state.cardRange);}catch{state.cardRange=2;}
 let generation=0, visibilityGeneration=0, searchGeneration=0, extrasGeneration=0, marineGeneration=0, timer, stopped=false, lastLoad=0, exportAbort=null, exportModel, exportDialog=null; 
 const styleRepository=createStyleFavorites({storage:api.storage,indexedDB:root.ownerDocument.defaultView.indexedDB});
 const exportURLs=new Set();
 const releaseExport=()=>{for(const url of exportURLs)root.ownerDocument.defaultView.URL.revokeObjectURL(url);exportURLs.clear();state.exportResult=null;};
 const save=()=>{try{api.storage?.setItem('ACTweather.settings',JSON.stringify(Object.fromEntries(['theme','icons','wind','temp','height','model','copyIcons','seaWind','seaCurrent','cardRange','cardStyle'].map(k=>[k,state[k]]))));}catch{}};
 const model=()=>state.exportBusy?exportModel:state.model==='auto'?api.model():state.model;
 const units={temp:x=>fmt(valid(x)?state.temp==='F'?x*1.8+32:x:x)+' °'+state.temp,wind:x=>fmt(valid(x)?x*({kt:1.943844,'m/s':1,'km/h':3.6}[state.wind]??1):x)+' '+state.wind,height:x=>fmt(valid(x)?state.height==='ft'?x*3.28084:x:x,0)+' '+state.height};
 function weather(){if(!state.payload)return null;const w=normalise(state.payload,api.time(),api.timeOffset?.(api.time()));const r=state.visibilityRecord;if(r&&r.ts===w.requestedTs&&r.lat===state.lat&&r.lon===state.lon&&r.model===model()){w.visibility=r.value;w.visibilitySource=r.sourceModel;w.visibilityNotice=r.error;}return w;}
 function lines(w) {
 const a=astronomy(w.day,w.offset,state.lat,state.lon,w.requestedTs), p=pressureValues(w,state.manual), clouds=cloudLines(w,state.height);
 return [['🚩','地點',state.name],['🧭','經緯度',`${state.lat.toFixed(7)}, ${state.lon.toFixed(7)}`],['🕒','預報時間',effectiveTime(w)],['◈','參考模式',modelName(w.header.model??model())],['⛰','海拔',`${units.height(w.header.elevation)} AMSL`],['◉','氣壓',`${p.qCode}（${fmt(p.q)} hPa）／${p.aCode}（${fmt(p.a,2)} inHg）`],['🌡','氣溫',`${units.temp(w.temp)}；露點 ${units.temp(w.dew)}；當日最高 ${units.temp(w.max)}／最低 ${units.temp(w.min)}`],['☀','日出／日沒',a.sun],['☾','月出／月沒',a.moon],['☁','雲量分布',clouds.lines.join('\n')],['☁','雲幕',clouds.ceiling.replace(/（\d+ hPa）$/,'')],['🌤','天空狀況',sky(w.icon)],['➤','風向／風速',`${windDirection(w.dir,w.wind)}；${units.wind(w.wind)}；陣風 ${units.wind(w.gust)}`],['👁','能見度',valid(state.manual.visibility)?fmt(state.manual.visibility/1000)+'公里':valid(w.visibility)?fmt(w.visibility/1000)+'公里':'未提供'],['☂','降雨',rainLine(w)],['❄','結冰高度',valid(state.extras.deg0?.value)?`${fmt(state.extras.deg0.value*3.28084,0)} ft AMSL`:'未提供'],['✈','晴空亂流',catText(state.extras.turbulence?.value)],['↻','資料更新',clock(lastLoad,w.offset,true)+'(LST地方時)']];
 }
 const conciseMetar=w=>metar(w,state.manual).split(' RMK ')[0];
 function sources(w){
  const out=['氣象預報、能見度、結冰高度、亂流與海象：Windy。單點資料以背景讀取；下載圖卡時暫時切換圖層，完成後復原。','日出／日沒、月出／月沒與月照：SunCalc 天文估算；地名搜尋：Open-Meteo／GeoNames。'];
  if(w){
   const p=pressureValues(w,state.manual);
   out.push(`氣象模式：${modelName(w.header.model??model())}；模式起報 ${w.header.refTime??'未提供'}；實際模式資料預報時間 ${clock(w.ts,0,true)} UTC。模式地形：${units.height(w.header.modelElevation)} AMSL。`);
   out.push(`氣壓：${p.manual?'人工 QNH':'模式氣壓換算，QNH 需核對'}；Q／A 以 1 inHg＝33.863886666667 hPa 換算。${w.hasSummary?'':'當日高低溫僅取可用時段。'}`);
   out.push('雲幕判讀層：'+cloudLines(w).ceiling+'。');
   out.push('天空狀況：模式天氣圖示。雲層依925、850、700、500 hPa的RH规则推估，最低含BKN層作為雲幕；BKN–SCT組入電碼時採BKN。'.replace('规则','規則'));
   out.push(`能見度：${valid(state.manual.visibility)?'人工補充':valid(w.visibility)?'Windy visibility；來源模式 '+modelName(w.visibilitySource??w.header.model??model()):w.visibilityNotice||'此模式未提供能見度'}。降雨：依累積雨量及時段長度計算雨勢，當日合計僅含可用時段。`);
   out.push('壓力層、RH、高空風：模式探空；依hPa數值升序排列。括號為近似標準高度，非當時模式位勢高度；950 hPa約1800ft、925 hPa約2500ft、500 hPa約FL180。標準高度參考：https://www.weather.gov/source/zhu/ZHU_Training_Page/winds/pressure_winds/Pressure.htm 及 https://www.weather.gov/media/zhu/ZHU_Training_Page/Met_Tutorials/Meteorological_Techniques.pdf 。高空風以來向與節表示，地面以下層排除。');
   out.push('FORECAST METAR：模式預報摘要，非正式METAR／TAF；斜線代表缺漏，未自動產生NOSIG或CAVOK。來源註記：'+(metar(w,state.manual).split(' RMK ')[1]??'未提供'));
  }
  out.push('結冰高度：0°C高度；固定以ft AMSL顯示。'+sourceText(state.extras.deg0));
  out.push(`晴空亂流：${catText(state.extras.turbulence?.value)}；${valid(state.extras.turbulence?.value)?'Windy EDR '+fmt(state.extras.turbulence.value,0)+'（Windy 指標刻度）；':''}850–300 hPa 範圍最大值；${sourceText(state.extras.turbulence)}。15、20、44、79對應輕度、中度、強、極強；缺值不表示沒有亂流。`);
  if(state.tab===1||Object.keys(state.marine).length){
   out.push('海象：風向與浪向為來向，海流為去向；浦福風級由原始m/s值計算。陸地或海岸遮罩缺值時，請選擇外海地點。');
   for(const [key,label,note] of [['wind','海象風場','地面風'],['sst','海溫','最新分析值，非逐時海溫預報'],['waves','海浪','有效波高'],['currents','海流','表層海流，不含獨立潮流產品']])out.push(`${label}：${note}（${sourceText(state.marine[key])}）`);
  }
  return out;
 }
 function draw(){
 const design=root.querySelector('[data-card-design]');if(design)state.cardDesignOpen=design.open;
 const previous=root.querySelector('[data-sources]');if(previous)state.sourcesOpen=previous.open;
 let w=null;try{w=weather();}catch(e){state.error=e.message;}
 const opts=(arr,val)=>arr.map(([v,t])=>`<option value="${esc(v)}" ${v===val?'selected':''}>${esc(t)}</option>`).join('');
 root.className='actweather '+state.theme;
 root.innerHTML=`<header><small>POINT FORECAST · 單點預報</small><h1>ACTweather</h1><small>v0.1.12</small><p>點選 Windy 地圖，即可更新預報</p></header><nav><button data-tab="0" aria-pressed="${state.tab===0}">ACT 預報</button><button data-tab="1" aria-pressed="${state.tab===1}">海象預報</button><button data-tab="2" aria-pressed="${state.tab===2}">METAR 電碼</button></nav>
 <div class="controls"><label>氣象模式<select data-setting="model">${opts([['auto','跟隨 Windy'],['ecmwf','ECMWF'],['gfs','GFS'],['icon','ICON']],state.model)}</select></label><label>風速<select data-setting="wind">${opts([['kt','KT'],['m/s','m/s'],['km/h','km/h']],state.wind)}</select></label><label>氣溫<select data-setting="temp">${opts([['C','°C'],['F','°F']],state.temp)}</select></label><label>高度<select data-setting="height">${opts([['ft','呎'],['m','公尺']],state.height)}</select></label><label>主題<select data-setting="theme">${opts([['dark','灰底白字'],['light','白底黑字']],state.theme)}</select></label><label><input type="checkbox" data-setting="icons" ${state.icons?'checked':''}>段落圖示</label></div>
 <details><summary>喜愛地點／搜尋地名或經緯度</summary><form data-form="search"><label>地名或緯度、經度<input name="query" placeholder="臺北、25.038, 121.514" value="${esc(state.searchQuery)}" required></label><button type="submit" ${state.searchBusy?'disabled':''}>${state.searchBusy?'搜尋中…':'搜尋地點'}</button></form><div>${state.searchResults.map((p,i)=>`<p><button data-search-result="${i}">${esc(p.name)}（${p.lat.toFixed(3)}, ${p.lon.toFixed(3)}）</button></p>`).join('')}</div><button data-action="favorite-add">將目前地點加入喜愛</button>${state.favorites.length?state.favorites.map((p,i)=>`<p><button data-favorite="${i}">★ ${esc(p.name)}</button> <button data-favorite-delete="${i}">刪除</button></p>`).join(''):'<p>尚無喜愛地點</p>'}</details>
 <details><summary>指定地點／人工補充電碼資料</summary><form data-form="point"><label>地點名稱<input name="name" value="${esc(state.name)}"></label><label>緯度<input name="lat" type="number" min="-90" max="90" step="any" required value="${state.lat}"></label><label>經度<input name="lon" type="number" min="-180" max="180" step="any" required value="${state.lon}"></label><button type="submit">更新地點</button></form><div class="controls"><label>QNH（人工 hPa）<input data-manual="qnh" type="number" min="800" max="1100" step="0.1" value="${state.manual.qnh??''}"></label><label>能見度（人工 m；9999=10 km以上）<input data-manual="visibility" type="number" min="0" max="9999" value="${state.manual.visibility??''}"></label><label>雲層（人工 AGL 百呎）<input data-manual="clouds" placeholder="FEW016 BKN100" value="${esc(state.manual.clouds??'')}"></label></div><p>補充值僅用於目前地點、模式與預報時間，切換後自動清除。</p></details>
 <div role="status">${state.busy?'正在載入 Windy 預報…':esc(state.notice)}</div>${state.error?`<p role="alert">${esc(state.error)}</p>`:''}
 ${state.tab===1?`<article><h2>海象預報</h2><div class="controls"><label>海象風速<select data-setting="seaWind">${opts([['kt','節 kt'],['m/s','公尺/秒 m/s'],['km/h','公里/時 km/h']],state.seaWind)}</select></label><label>海流流速<select data-setting="seaCurrent">${opts([['kt','節 kt'],['m/s','公尺/秒 m/s'],['km/h','公里/時 km/h']],state.seaCurrent)}</select></label></div><p role="status">${state.marineBusy?'正在載入海象資料…':''}</p>${marineLines(state,api.time(),w?.offset??api.timeOffset?.(api.time())??0).map(([icon,label,value])=>`<section><h2>${state.icons?icon+' ':''}${label}</h2><p>${esc(value)}</p></section>`).join('')}</article>`:w&&!state.error&&!state.busy?state.tab===0?`<article>${lines(w).map(([icon,label,value])=>`<section><h2>${state.icons?icon+' ':''}${label}</h2><p>${esc(value)}</p></section>`).join('')}</article><details><summary>當日逐時預報／降雨時段</summary><table><thead><tr><th>時間</th><th>天氣</th><th>溫度</th><th>風速</th><th>雨量 mm/段</th></tr></thead><tbody>${w.rows.map(r=>`<tr><td>${clock(r.ts,w.offset)}</td><td>${sky(r.icon)}</td><td>${units.temp(r.temp)}</td><td>${units.wind(r.wind)}</td><td>${fmt(r.rain)}</td></tr>`).join('')}</tbody></table></details><details><summary>壓力層、RH、高空風</summary>${sortedLevels(w.levels).length?sortedLevels(w.levels).map(x=>`<p>${esc(pressureLevelLine(x))}</p>`).join(''):'此模式未提供剖面資料'}</details>`:`<article><h2>FORECAST METAR</h2><pre>${esc(conciseMetar(w))}</pre><p>${esc(effectiveTime(w))}；參考模式：${esc(modelName(w.header.model??model()))}</p></article>`:''}
 <details data-sources ${state.sourcesOpen?'open':''}><summary>資料來源</summary>${sources(w).map(t=>`<p>${esc(t)}</p>`).join('')}</details>
 <footer><label><input type="checkbox" data-setting="copyIcons" ${state.copyIcons?'checked':''}>一併複製圖例</label><button data-action="refresh" ${state.tab===1?state.marineBusy?'disabled':'':state.busy?'disabled':''}>重新讀取</button><button data-action="copy" ${state.tab===1?state.marineBusy?'disabled':'':!w||state.error||state.busy?'disabled':''}>複製內容</button></footer>
 <details data-card-design ${state.cardDesignOpen?'open':''}><summary>圖卡風格設計</summary><p>設定套用於下次製作的兩張圖卡。底圖拉伸滿版，保留全部圖案；可與風格一起儲存到我的最愛。</p> <div class="controls"><label>截圖範圍 度數（上下左右各）<input data-card-range type="number" min="0.1" max="20" step="0.1" value="${state.cardRange}"></label></div>
<div class="controls">
 <label>邊框線條<select data-card-style="border">${opts([['none','無'],['solid','實線'],['dashed','虛線'],['dotted','點線'],['double','雙線']],state.cardStyle.border)}</select></label>
 <label>邊框顏色<input type="color" data-card-style="borderColor" value="${state.cardStyle.borderColor}"></label><label>邊框粗細<input type="number" data-card-style="borderWidth" min="1" max="16" value="${state.cardStyle.borderWidth}"></label>
 <label>底圖顏色<input type="color" data-card-style="background" value="${state.cardStyle.background}"></label><label><input type="checkbox" data-card-style="gradient" ${state.cardStyle.gradient?'checked':''}>雙色漸層</label><label>漸層第二色<input type="color" data-card-style="background2" value="${state.cardStyle.background2}"></label>
 <label>底色透明度 %<input type="number" data-card-opacity="backgroundOpacity" min="0" max="100" value="${100-state.cardStyle.backgroundOpacity}"></label><label>上傳底圖（PNG/JPEG/WebP，8MB以內）<input type="file" data-card-background accept="image/png,image/jpeg,image/webp"></label><label>圖片透明度 %<input type="number" data-card-opacity="imageOpacity" min="0" max="100" value="${100-state.cardStyle.imageOpacity}"></label><p>${state.cardBackground?esc(state.cardBackground.name):'尚未選擇底圖'} <button data-action="card-background-clear">移除底圖</button></p>
 <label>ACT預報字級<input data-card-style="actFont" type="number" min="18" max="44" value="${state.cardStyle.actFont}"></label><label>海象預報字級<input data-card-style="marineFont" type="number" min="18" max="44" value="${state.cardStyle.marineFont}"></label><label>METAR預報電碼字級<input data-card-style="metarFont" type="number" min="18" max="44" value="${state.cardStyle.metarFont}"></label><label><input data-card-style="boldTitles" type="checkbox" ${state.cardStyle.boldTitles?'checked':''}>標題粗體（含段落欄位名稱）</label><label>預報文字顏色<input type="color" data-card-style="textColor" value="${state.cardStyle.textColor}"></label>
 </div><label>插入文字<textarea data-card-style="note" maxlength="500" placeholder="注意天雨路滑小心開車">${esc(state.cardStyle.note)}</textarea></label><div class="controls"><label>插入文字字級<input data-card-style="noteSize" type="number" min="18" max="64" value="${state.cardStyle.noteSize}"></label><label>插入文字位置<select data-card-style="notePosition">${opts([['top','頂部（預報時間下方）'],['bottom','底部（來源說明上方）'],['right','右側預報文字下方']],state.cardStyle.notePosition)}</select></label><label>插入文字風格<select data-card-style="noteStyle">${opts([['normal','一般'],['bold','粗體'],['italic','斜體'],['bold italic','粗斜體']],state.cardStyle.noteStyle)}</select></label><label>插入文字顏色<input type="color" data-card-style="noteColor" value="${state.cardStyle.noteColor}"></label></div><div class="controls"><label>喜愛風格名稱<input data-style-favorite-name maxlength="60" value="${esc(state.styleFavoriteName)}" placeholder="例如：海象簡報"></label><button data-action="style-favorite-add" ${state.styleFavoriteBusy?'disabled':''}>將此風格儲存為我的最愛</button></div><p>喜愛風格包含截圖範圍、樣式、文字與底圖。套用後按製作按鈕即可預覽。</p>${state.styleFavorites.map((f,i)=>`<p>${esc(f.name)} <button data-style-favorite-apply="${i}" ${state.styleFavoriteBusy?'disabled':''}>套用此風格</button> <button data-style-favorite-delete="${i}" ${state.styleFavoriteBusy?'disabled':''}>刪除此風格</button></p>`).join('')}<button data-action="card-style-reset">恢復預設圖卡風格</button></details>
 <div class="controls"><button data-action="cards" ${!w||state.busy||state.exportBusy||state.styleFavoriteBusy?'disabled':''}>製作/預覽/下載圖卡</button></div>${state.exportResult?`<details data-card-results open><summary>兩張預報圖卡</summary><p>請先確認兩張預覽；確認沒問題後，再逐張下載PNG，或下載包含兩張PNG的ZIP。手機可使用分享儲存到照片或檔案；圖卡不會自動傳送。</p>${state.exportResult.files.map((file,i)=>`<section><h2>圖卡 ${i+1}</h2><img class="act-card-preview" src="${esc(file.url)}" alt="ACTweather預報圖卡 ${i+1}"><button data-card-save="${i}">下載圖卡 ${i+1} PNG</button><a href="${esc(file.url)}" target="_blank" rel="noopener">開啟大圖／長按儲存</a></section>`).join('')}<button data-action="cards-zip">下載兩張圖卡 ZIP</button>${state.exportResult.canShare?'<button data-action="cards-share">分享／儲存兩張圖卡</button>':''}<button data-action="cards-close">關閉圖卡預覽</button></details>`:''}${developerFooter()}`;
 if(state.exportBusy){
  if(!exportDialog){exportDialog=root.ownerDocument.createElement('dialog');exportDialog.className='actweather '+state.theme;exportDialog.setAttribute('aria-label','正在產生預報圖卡');root.ownerDocument.body.appendChild(exportDialog);exportDialog.addEventListener('cancel',e=>{e.preventDefault();exportAbort?.abort();});if(exportDialog.showModal)exportDialog.showModal();else exportDialog.setAttribute('open','');}
  exportDialog.innerHTML=`<div class="act-export-progress"><p role="status">${esc(state.exportProgress||'正在準備預報圖卡…')}</p><button data-action="cards-cancel">取消</button></div>`;
  exportDialog.querySelector('button').onclick=()=>exportAbort?.abort();
 }else if(exportDialog){exportDialog.close?.();exportDialog.remove();exportDialog=null;}
 root.querySelectorAll('[data-tab]').forEach(el=>el.onclick=()=>{state.tab=Number(el.dataset.tab);draw();if(state.tab===1&&!Object.keys(state.marine).length)refreshMarine();});
 root.querySelectorAll('[data-setting]').forEach(el=>el.onchange=()=>{state[el.dataset.setting]=el.type==='checkbox'?el.checked:el.value;save();if(el.dataset.setting==='model'){state.manual={};schedule(true);}else draw();});
 root.querySelectorAll('[data-manual]').forEach(el=>el.onchange=()=>{const key=el.dataset.manual;const v=key==='clouds'?el.value.trim().toUpperCase():el.value===''?undefined:Number(el.value); if(key==='clouds'&&v&&!/^(?:(?:FEW|SCT|BKN|OVC)\d{3}|VV\d{3})(?: (?:FEW|SCT|BKN|OVC)\d{3})*$/.test(v)){state.notice='雲層格式無效，請使用 FEW016 BKN100 等格式';state.manual[key]=undefined;}else if(el.checkValidity()){state.manual[key]=v;state.notice='人工補充已更新';}else {state.manual[key]=undefined;state.notice='補充值超出允許範圍';}draw();});
 root.querySelector('[data-form="point"]').onsubmit=e=>{e.preventDefault();const f=e.currentTarget;select({lat:Number(f.elements.lat.value),lon:Number(f.elements.lon.value)},f.elements.name.value);};
 root.querySelector('[data-form="search"]').onsubmit=async e=>{e.preventDefault();const query=e.currentTarget.elements.query.value.trim();state.searchQuery=query;const token=++searchGeneration;state.searchBusy=true;state.searchResults=[];state.notice='';draw();try{const coord=coordinates(query);const result=coord?[coord]:await api.search(query);if(stopped||token!==searchGeneration)return;state.searchResults=Array.isArray(result)?result:[];state.notice=state.searchResults.length?'請選擇搜尋結果，再加入喜愛':'找不到地名，可改用經緯度';}catch(error){if(!stopped&&token===searchGeneration)state.notice=error.message;}finally{if(!stopped&&token===searchGeneration){state.searchBusy=false;draw();}}};
 root.querySelectorAll('[data-search-result]').forEach(el=>el.onclick=()=>{const p=state.searchResults[Number(el.dataset.searchResult)];select(p,p.name);});
 root.querySelector('[data-action="favorite-add"]').onclick=()=>{const p={lat:state.lat,lon:state.lon,name:state.name};if(state.favorites.some(x=>x.lat===p.lat&&x.lon===p.lon)){state.notice='此地點已在喜愛清單';}else if(state.favorites.length>=100){state.notice='喜愛清單最多100個地點';}else {state.favorites.push(p);state.notice=writeFavorites(api.storage,state.favorites)?'已加入喜愛地點':'已加入本次清單，但瀏覽器未允許儲存';}draw();};
 root.querySelectorAll('[data-favorite]').forEach(el=>el.onclick=()=>{const p=state.favorites[Number(el.dataset.favorite)];select(p,p.name);});
 root.querySelectorAll('[data-favorite-delete]').forEach(el=>el.onclick=()=>{state.favorites.splice(Number(el.dataset.favoriteDelete),1);state.notice=writeFavorites(api.storage,state.favorites)?'已刪除喜愛地點':'本次已刪除，但瀏覽器未允許儲存';draw();});
 root.querySelector('[data-card-range]').onchange=e=>{try{state.cardRange=screenshotRange(e.target.value);save();}catch(err){state.notice=err.message;}draw();};
 root.querySelectorAll('[data-card-style]').forEach(el=>el.onchange=()=>{state.cardStyle=cardStyle({...state.cardStyle,[el.dataset.cardStyle]:el.type==='checkbox'?el.checked:el.type==='number'?Number(el.value):el.value});save();draw();});
 root.querySelectorAll('[data-card-opacity]').forEach(el=>el.onchange=()=>{state.cardStyle=cardStyle({...state.cardStyle,[el.dataset.cardOpacity]:100-Number(el.value)});save();draw();});
 root.querySelector('[data-card-background]').onchange=async e=>{try{const bg=await loadBackground(e.target.files?.[0],root.ownerDocument.defaultView);if(stopped||!bg)return;if(state.cardBackground)state.cardBackground.canvas.width=state.cardBackground.canvas.height=1;state.cardBackground=bg;state.notice='底圖已載入';}catch(err){state.notice=err.message;}draw();};
 root.querySelector('[data-action="card-background-clear"]').onclick=()=>{if(state.cardBackground)state.cardBackground.canvas.width=state.cardBackground.canvas.height=1;state.cardBackground=null;draw();};
 root.querySelector('[data-action="card-style-reset"]').onclick=()=>{state.cardStyle=cardStyle();state.cardRange=2;if(state.cardBackground)state.cardBackground.canvas.width=state.cardBackground.canvas.height=1;state.cardBackground=null;save();draw();};
 root.querySelector('[data-style-favorite-name]').oninput=e=>{state.styleFavoriteName=e.target.value;};
 root.querySelector('[data-action="style-favorite-add"]').onclick=async()=>{if(state.styleFavoriteBusy)return;const name=state.styleFavoriteName.trim();if(!name){state.notice='請先輸入喜愛風格名稱';draw();return;}if(state.styleFavorites.length>=50){state.notice='喜愛風格最多50組';draw();return;}state.styleFavoriteBusy=true;draw();try{const record={id:root.ownerDocument.defaultView.crypto?.randomUUID?.()??Date.now()+'-'+Math.random(),name,style:cardStyle(state.cardStyle),range:state.cardRange,background:state.cardBackground?{name:state.cardBackground.name,data:state.cardBackground.canvas.toDataURL('image/png')}:null};const saved=await styleRepository.put(record);if(stopped)return;state.styleFavorites.push(saved);state.styleFavoriteName='';state.notice='已儲存喜愛風格（含底圖與截圖範圍）';}catch(e){if(!stopped)state.notice='喜愛風格未儲存：'+e.message;}finally{state.styleFavoriteBusy=false;if(!stopped)draw();}};
 root.querySelectorAll('[data-style-favorite-apply]').forEach(el=>el.onclick=async()=>{if(state.styleFavoriteBusy)return;const record=state.styleFavorites[Number(el.dataset.styleFavoriteApply)];state.styleFavoriteBusy=true;draw();try{const bg=await restoreBackground(record.background,root.ownerDocument.defaultView);if(stopped){if(bg)bg.canvas.width=bg.canvas.height=1;return;}if(state.cardBackground)state.cardBackground.canvas.width=state.cardBackground.canvas.height=1;state.cardBackground=bg;state.cardStyle=cardStyle(record.style);state.cardRange=record.range;save();state.notice='已套用風格：'+record.name+'；請按製作按鈕更新預覽';}catch(e){if(!stopped)state.notice='風格未套用：'+e.message;}finally{state.styleFavoriteBusy=false;if(!stopped)draw();}});
 root.querySelectorAll('[data-style-favorite-delete]').forEach(el=>el.onclick=async()=>{if(state.styleFavoriteBusy)return;const record=state.styleFavorites[Number(el.dataset.styleFavoriteDelete)];state.styleFavoriteBusy=true;draw();try{await styleRepository.remove(record.id);if(stopped)return;state.styleFavorites=state.styleFavorites.filter(f=>f.id!==record.id);state.notice='已刪除喜愛風格：'+record.name;}catch(e){if(!stopped)state.notice='風格未刪除：'+e.message;}finally{state.styleFavoriteBusy=false;if(!stopped)draw();}});
 root.querySelector('[data-action="cards"]').onclick=exportCards;
 root.querySelector('[data-action="cards-cancel"]')?.addEventListener('click',()=>exportAbort?.abort());
 root.querySelectorAll('[data-card-save]').forEach(el=>el.onclick=()=>{const file=state.exportResult.files[Number(el.dataset.cardSave)];downloadFile(root.ownerDocument,file.url,file.name);});
 root.querySelector('[data-action="cards-zip"]')?.addEventListener('click',()=>downloadFile(root.ownerDocument,state.exportResult.zipURL,state.exportResult.zipName));
 root.querySelector('[data-action="cards-close"]')?.addEventListener('click',()=>{releaseExport();draw();});
 root.querySelector('[data-action="cards-share"]')?.addEventListener('click',async()=>{try{await root.ownerDocument.defaultView.navigator.share({files:state.exportResult.shareFiles});}catch(e){if(e.name!=='AbortError'){state.notice='分享未完成，請改用PNG下載或開啟大圖';draw();}}});
 root.querySelector('[data-action="refresh"]').onclick=()=>state.tab===1?refreshMarine():schedule(true);
 root.querySelector('[data-action="copy"]').onclick=async()=>{try{await api.copy(state.tab===1?marineLines(state,api.time(),w?.offset??api.timeOffset?.(api.time())??0).map(([icon,k,v],i)=>`${i+1}.${state.copyIcons?icon:''}${k}： ${v}`).join('\n'):state.tab===0?lines(w).map(([icon,k,v],i)=>`${i+1}.${state.copyIcons?icon:''}${k}： ${v}`).join('\n')+`\n${lines(w).length+1}.${state.copyIcons?'☂':''}當日逐時預報：\n`+w.rows.map(r=>`${clock(r.ts,w.offset)} ${sky(r.icon)} ${units.temp(r.temp)} ${units.wind(r.wind)} ${fmt(r.rain)} mm/段`).join('\n')+`\n${lines(w).length+2}.${state.copyIcons?'✈':''}壓力層、RH、高空風：\n`+sortedLevels(w.levels).map(pressureLevelLine).join('\n'):'1.'+(state.copyIcons?'✈':'')+'電碼： '+conciseMetar(w)+'\n2.'+(state.copyIcons?'🕒':'')+'預報時間： '+effectiveTime(w)+'\n3.'+(state.copyIcons?'◈':'')+'參考模式： '+modelName(w.header.model??model()));state.notice='已複製，可貼到手機訊息';}catch{state.notice='瀏覽器未允許複製；請選取頁面文字手動複製';}draw();};
 }
 async function exportCards(){
  if(state.exportBusy||state.busy||!state.payload)return;
  if(!api.capture?.capture){state.notice='此環境尚未提供Windy截圖介面';draw();return;}
  const selectedTime=api.time(),chosen=model(),point={lat:state.lat,lon:state.lon,name:state.name};
  exportModel=chosen;state.exportBusy=true;state.exportProgress='正在取得完整氣象與海象資料…';exportAbort=new AbortController();draw();
  try{
   await new Promise((resolve,reject)=>{
    const cancel=()=>reject(Error('已取消圖卡下載'));
    exportAbort.signal.addEventListener('abort',cancel,{once:true});
    const signal=exportAbort.signal;
    Promise.all([refreshExtras(),refreshMarine(),refreshVisibility()]).then(resolve,reject).finally(()=>signal.removeEventListener('abort',cancel));
   });
   if(stopped||exportAbort.signal.aborted)throw Error('已取消圖卡下載');
   const w=normalise(state.payload,selectedTime,api.timeOffset?.(selectedTime));
   const record=state.visibilityRecord;if(record?.ts===selectedTime&&record.lat===point.lat&&record.lon===point.lon){w.visibility=record.value;w.visibilitySource=record.sourceModel;w.visibilityNotice=record.error;}
   const snapshot={point,model:chosen,timestamp:selectedTime,offset:w.offset,range:screenshotRange(state.cardRange),style:cardStyle(state.cardStyle),backgroundImage:state.cardBackground?.canvas,
    act:['ACT預報',...lines(w).map(([,key,value],i)=>`${i+1}.${key}：${value}`),'19.當日逐時預報：',...w.rows.map(r=>`${clock(r.ts,w.offset)} ${sky(r.icon)} ${units.temp(r.temp)} ${units.wind(r.wind)} ${fmt(r.rain)} mm/段`)],
    second:['20.壓力層、RH、高空風：',...sortedLevels(w.levels).map(pressureLevelLine),'','海象預報',...marineLines(state,selectedTime,w.offset).map(([,key,value],i)=>`${i+1}.${key}：${value}`),'','METAR預報電碼','1.電碼：'+conciseMetar(w),'2.預報時間：'+effectiveTime(w),'3.參考模式：'+modelName(w.header.model??chosen)]};
   const captured=await api.capture.capture(snapshot,{signal:exportAbort.signal,onProgress:p=>{state.exportProgress=`正在擷取Windy ${p.label}（${p.index+1}/${p.total}）…`;draw();}});
   if(stopped||exportAbort.signal.aborted){for(const item of captured.images)item.canvas.width=item.canvas.height=1;throw Error('已取消圖卡下載');}
   state.exportProgress='正在合成兩張預報圖卡…';draw();
   const result=await composeCards(snapshot,captured,{document:root.ownerDocument});const zip=await zipCards(result.files);
   if(stopped||exportAbort.signal.aborted)throw Error('已取消圖卡下載');
   const win=root.ownerDocument.defaultView,shareFiles=result.files.map(file=>new win.File([file.blob],file.name,{type:'image/png'}));
   releaseExport();const url=blob=>{const value=win.URL.createObjectURL(blob);exportURLs.add(value);return value;};
   state.exportResult={...result,files:result.files.map(file=>({...file,url:url(file.blob)})),zipURL:url(zip),shareFiles,canShare:!!win.navigator.canShare?.({files:shareFiles})};
   state.notice='已製作兩張預報圖卡，請先預覽，確認後再點選下載';state.exportBusy=false;draw();
   root.querySelector('[data-card-results]')?.scrollIntoView?.({block:'nearest'});
  }catch(e){if(!stopped){state.notice='圖卡未產生：'+e.message;draw();}}
  finally{state.exportBusy=false;exportAbort=null;if(!stopped)draw();}
 }
 async function load(){const gen=++generation;state.busy=true;state.error='';state.payload=null;draw();const point={lat:state.lat,lon:state.lon}, chosen=model();refreshExtras();if(state.tab===1)refreshMarine();
 try{const p=await api.forecast(chosen,point);if(stopped||gen!==generation)return;state.payload=p;lastLoad=Date.now();normalise(p,api.time(),api.timeOffset?.(api.time()));state.notice='已更新';refreshVisibility();}catch(e){if(stopped||gen!==generation)return;state.error='無法取得預報：'+e.message;state.payload=null;}finally{if(!stopped&&gen===generation){state.busy=false;draw();}}}
 async function refreshVisibility(){if(api.capture?.busy?.())return;if(!state.payload||!api.visibility)return;const token=++visibilityGeneration;let w;try{w=normalise(state.payload,api.time(),api.timeOffset?.(api.time()));}catch{return;}const point={lat:state.lat,lon:state.lon},chosen=model(),ts=w.requestedTs;state.visibilityRecord={...point,model:chosen,ts,error:'正在自動載入 Windy 能見度…'};draw();try{const result=await api.visibility(chosen,point,ts);const value=result&&typeof result==='object'?result.value:result;const sourceModel=result&&typeof result==='object'?result.sourceModel:chosen;if(stopped||token!==visibilityGeneration)return;state.visibilityRecord={...point,model:chosen,ts,sourceModel,value:valid(value)&&value>=0?value:undefined,error:valid(value)&&value>=0?'':'此模式／地點未取得能見度；請重新讀取'};}catch(error){if(stopped||token!==visibilityGeneration)return;state.visibilityRecord={...point,model:chosen,ts,error:'Windy 能見度未提供：'+error.message+'；請重新讀取'};}draw();}
 async function refreshFields(keys,target,token,isCurrent){
  const point={lat:state.lat,lon:state.lon},chosen=model(),ts=api.time();
  state[target]=Object.fromEntries(keys.map(k=>[k,api.field?null:{error:'Windy 背景資料介面不可用'}]));draw();
  await Promise.all(keys.map(async key=>{try{const record=api.field?await api.field(key,chosen,point,ts):{error:'Windy 背景資料介面不可用'};if(!stopped&&isCurrent(token)){state[target][key]=record;draw();}}catch(e){if(!stopped&&isCurrent(token)){state[target][key]={error:e.message};draw();}}}));
 }
 async function refreshExtras(){const token=++extrasGeneration;await refreshFields(['deg0','turbulence'],'extras',token,t=>t===extrasGeneration);}
 async function refreshMarine(){const token=++marineGeneration;state.marineBusy=true;await refreshFields(['wind','sst','waves','currents'],'marine',token,t=>t===marineGeneration);if(!stopped&&token===marineGeneration){state.marineBusy=false;draw();}}
 function schedule(force=false){if(state.exportBusy)return;clearTimeout(timer);if(force){generation++;visibilityGeneration++;extrasGeneration++;marineGeneration++;state.extras={};state.marine={};state.marineBusy=false;state.visibilityRecord=null;state.payload=null;state.busy=true;draw();timer=setTimeout(load,80);}else {state.error='';state.manual={};state.notice='時間已變更';draw();refreshVisibility();refreshExtras();if(state.tab===1)refreshMarine();else {marineGeneration++;state.marine={};state.marineBusy=false;}if(Date.now()-lastLoad>120000)schedule(true);}}
 function select(point,name){if(state.exportBusy)return;if(!valid(point.lat)||!valid(point.lon)||Math.abs(point.lat)>90||Math.abs(point.lon)>180){state.error='經緯度範圍無效';draw();return;}Object.assign(state,point);state.name=name||'地圖所選地點';state.manual={};state.notice='';api.mark?.(point);schedule(true);}
 const unsub=api.subscribe({point:select,time:()=>schedule(),model:()=>{if(state.exportBusy)return;if(state.model==='auto'){state.manual={};schedule(true);}},visibility:()=>{if(!state.exportBusy)refreshVisibility();},redraw:()=>{if(state.exportBusy)return;refreshVisibility();if(Date.now()-lastLoad>120000)schedule(true);}});
 const interval=setInterval(()=>{if(!state.busy)schedule(true);},300000);
 draw();load();
 styleRepository.list().then(rows=>{if(!stopped)state.styleFavorites=rows;}).catch(e=>{if(!stopped)state.notice='喜愛風格清單無法讀取：'+e.message;}).finally(()=>{state.styleFavoriteBusy=false;if(!stopped)draw();});
 return {select,destroy(){stopped=true;if(state.cardBackground)state.cardBackground.canvas.width=state.cardBackground.canvas.height=1;exportAbort?.abort();exportDialog?.close?.();exportDialog?.remove();exportDialog=null;releaseExport();generation++;visibilityGeneration++;searchGeneration++;extrasGeneration++;marineGeneration++;clearTimeout(timer);clearInterval(interval);unsub?.();root.innerHTML='';},state};
}

const config = {
    name: 'windy-plugin-actweather',
    version: '0.1.12',
    icon: '⛅',
    title: 'ACTweather',
    description: '氣象人員單點預報與模式預報電碼摘要',
    author: '航空技術學院 陳智羿老師',
    desktopUI: 'rhpane',
    mobileUI: 'fullscreen',
    routerPath: '/actweather/:lat?/:lon?',
    private: false,
    listenToSingleclick: true,
    addToContextmenu: true
};

const finite=x=>typeof x==='number'&&Number.isFinite(x);
// Same Mercator coordinates and 257-point tile grid used by Windy.
function pointTile(point,zoom){
 if(!finite(point.lat)||!finite(point.lon)||Math.abs(point.lat)>85.05112878||Math.abs(point.lon)>180)throw Error('地點超出能見度圖磚涵蓋範圍');
 if(!Number.isInteger(zoom)||zoom<0||zoom>8)throw Error('能見度圖磚解析度無效');
 const n=2**zoom,lon=(point.lon+180)/360,x=((lon%1)+1)%1*n;
 const sin=Math.sin(point.lat*Math.PI/180),y=Math.min(n-Number.EPSILON,Math.max(0,(0.5-Math.log((1+sin)/(1-sin))/(4*Math.PI))*n));
 const tx=Math.floor(x),ty=Math.min(n-1,Math.floor(y));
 return {coords:{x:tx,y:ty,z:zoom},x:(x-tx)*256,y:Math.min(256,(y-ty)*256)};
}
function sampleVisibility({pixels,width=257,height=257,header},position,params){
 if(width!==257||height!==257||pixels?.length!==257*257*4||!finite(header?.decoderRstep)||!finite(header?.decoderRmin)||header.decoderRstep<0)throw Error('Windy 能見度圖磚格式無效');
 const x=Math.min(256,Math.max(0,position.x)),y=Math.min(256,Math.max(0,position.y));
 const x0=Math.floor(x),x1=Math.min(256,x0+1),y0=Math.floor(y),y1=Math.min(256,y0+1),dx=x-x0,dy=y-y0;
 const value=(px,py)=>{
  const i=(py*257+px)*4;
  if((params.JPGtransparency&&pixels[i+2]>=192)||(params.PNGtransparency&&pixels[i+3]<1))throw Error('此點／時間的能見度缺值');
  const raw=pixels[i]*header.decoderRstep+header.decoderRmin;
  const result=params.transformR?params.transformR(raw):raw;
  if(!finite(result)||result<0)throw Error('Windy 能見度數值無效');return result;
 };
 const a=value(x0,y0),b=value(x1,y0),c=value(x0,y1),d=value(x1,y1);
 const top=a+(b-a)*dx,bottom=c+(d-c)*dx;return top+(bottom-top)*dy;
}
// Download weather data, not the colored screen image. No map renderer required.
function createVisibilityTileLoader({fetchImageBlob,rawDataToCanvasImageSource,getImageData,decodeHeader,processHeader,decodeImageBytesCompact}){
 const cache=new Map();
 async function loadTile(url,signal){
  const saved=cache.get(url);if(saved&&Date.now()-saved.loaded<60000){cache.delete(url);cache.set(url,saved);return saved.tile;}
  if(signal?.aborted)throw Error('能見度請求已取消');
  const fetched=await fetchImageBlob(url,signal);
  if(!fetched?.valid)throw Error('能見度圖磚下載失敗：'+(fetched?.message??'未回傳資料'));
  let image;
  try{
   image=await rawDataToCanvasImageSource(fetched.blob);
   if(image.width!==257||image.height!==265)throw Error('Windy 能見度資料圖磚尺寸不符');
   const rgba=await getImageData(image);
   if(signal?.aborted)throw Error('能見度請求已取消');
   const header=processHeader(decodeHeader(rgba,image.width));
   const pixels=decodeImageBytesCompact(rgba);
   const tile={pixels,width:257,height:257,header};
   // Validate decoded metadata before caching it.
   if(!finite(header.decoderRmin)||!finite(header.decoderRstep)||header.decoderRstep<0)throw Error('Windy 資料圖磚標頭無效');
   cache.set(url,{tile,loaded:Date.now()});while(cache.size>12)cache.delete(cache.keys().next().value);
   return tile;
  }finally{image?.close?.();}
 }
 return {loadTile,destroy(){cache.clear();}};
}

async function visibilityFromWindy({createFullRenderingParams,getDataZoom,loadTile,mapZoom,spec},model,point,timestamp,abort=new AbortController()){
 if(typeof createFullRenderingParams!=='function'||typeof loadTile!=='function')throw Error('Windy 背景能見度介面不可用');
 const layer=spec?.layer??'visibility';
 const weather={product:model,overlay:layer,level:'surface',levelsRange:'850h-300h',acRange:3,isolinesOn:false,isolinesType:'pressure'};
 const params=await createFullRenderingParams(layer,weather,timestamp);
 if(abort.signal.aborted)throw Error('能見度請求已取消');
 if(!params||params.product!==model||params.layer!==layer||params.overlay!==layer||params.level!=='surface'||!params.fullPath)throw Error('能見度模式／圖層參數不符');
 const zoom=getDataZoom(params,Math.round(mapZoom?.()??5)+1);
 const location=pointTile(point,zoom);
 const url=params.fullPath.replace(/<z>|\{z\}/g,String(location.coords.z)).replace(/<x>|\{x\}/g,String(location.coords.x)).replace(/<y>|\{y\}/g,String(location.coords.y));
 const tile=await loadTile(url,abort.signal);
 if(abort.signal.aborted)throw Error('能見度請求已取消');
 if(!spec)return sampleVisibility(tile,location,params);
 const channels=sampleChannels(tile,location,{...params,PNGtransparency:params.PNGtransparency||spec.layer==='waves'},spec.channels);
 return {value:decodedLayer(layer,channels),sourceModel:model,refTime:params.refTime,path:params.path};
}
function createVisibilityReader(deps,{timeoutMs=20000,retryMs=500}={}){
 let active=null,closed=false;
 function read(model,point,timestamp){
  if(closed)return Promise.reject(Error('ACTweather 已關閉'));
  const key=JSON.stringify([model,point.lat,point.lon,timestamp]);
  if(active?.key===key)return active.promise;
  active?.abort.abort();
  const abort=new AbortController(),job={key,abort,promise:null};active=job;
  job.promise=Promise.resolve().then(async()=>{
   let timer,wakeTimer,lastError='尚未取得資料',cancel;
   const pause=()=>new Promise(resolve=>{
    const done=()=>{clearTimeout(wakeTimer);abort.signal.removeEventListener('abort',done);resolve();};
    if(abort.signal.aborted)return resolve();abort.signal.addEventListener('abort',done,{once:true});wakeTimer=setTimeout(done,retryMs);
   });
   const work=async()=>{
    while(!abort.signal.aborted){
     try{return await visibilityFromWindy(deps,model,point,timestamp,abort);}catch(error){lastError=error.message;}
     await pause();
    }throw Error('能見度請求已取消');
   };
   const cancelled=new Promise((_,reject)=>{cancel=()=>reject(Error('能見度請求已取消'));abort.signal.addEventListener('abort',cancel,{once:true});if(abort.signal.aborted)cancel();});
   const deadline=new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('能見度載入逾時：'+lastError)),timeoutMs);});
   try{return await Promise.race([work(),cancelled,deadline]);}
   finally{clearTimeout(timer);clearTimeout(wakeTimer);abort.signal.removeEventListener('abort',cancel);abort.abort();}
  }).finally(()=>{if(active===job)active=null;});
  return job.promise;
 }
 return {read,destroy(){closed=true;active?.abort.abort();active=null;}};
}

function createOceanPointChecker(getElevation,{timeoutMs=8000}={}){
 let active=null,closed=false;
 function check(point){
  if(closed)return Promise.reject(Error('ACTweather 已關閉'));
  const key=JSON.stringify([point.lat,point.lon]);
  if(active?.key===key)return active.promise;
  active?.abort.abort();const abort=new AbortController();let timer;
  const job={key,abort,promise:null};active=job;
  job.promise=Promise.resolve().then(async()=>{
   if(closed||abort.signal.aborted)throw Error('地形檢查已取消');
   if(typeof getElevation!=='function')throw Error('Windy 地形檢查介面不可用');
   const cancelled=new Promise((_,reject)=>abort.signal.addEventListener('abort',()=>reject(Error('地形檢查已取消／逾時')),{once:true}));
   timer=setTimeout(()=>abort.abort(),timeoutMs);
   const result=await Promise.race([getElevation(point.lat,point.lon,{abortSignal:abort.signal}),cancelled]);
   if(typeof result?.data!=='number'||!Number.isFinite(result.data))throw Error('未取得地形資料，無法確認此點海象適用性');
   if(result.data!==0)throw Error('此點地形高度非零，海象數值不適用；請選擇外海地點');
   return true;
  }).finally(()=>clearTimeout(timer));
  job.promise.catch(()=>{if(active===job)active=null;});
  return job.promise;
 }
 return {check,destroy(){closed=true;active?.abort.abort();active=null;}};
}
function chooseProduct(products,layer,preferred){
 for(const name of preferred)if(products?.[name]?.overlays?.includes(layer))return name;
 throw Error('Windy 未提供 '+layer+' 產品');
}
function createIndependentDataAPI(deps,products,{metadataTimeoutMs=12000}={}){
 const readers=new Map(),generations=new Map();let closed=false;
 const ocean=createOceanPointChecker(deps.getElevation);
 const specs={deg0:{channels:['R']},turbulence:{channels:['R']},wind:{channels:['R','G']},sst:{channels:['R']},waves:{channels:['R','G','B']},currents:{channels:['R','G']}};
 async function read(layer,preferred,point,timestamp){
  if(closed)throw Error('ACTweather 已關閉');const generation=(generations.get(layer)??0)+1;generations.set(layer,generation);
  const source=chooseProduct(products,layer,preferred),product=products[source];
  if(['sst','waves','currents'].includes(layer))await ocean.check(point);
  let metadataTimer;const calendar=await Promise.race([Promise.resolve().then(()=>product.getCalendar?.()),new Promise((_,reject)=>{metadataTimer=setTimeout(()=>reject(Error('Windy 模式時間資料載入逾時')),metadataTimeoutMs);})]).finally(()=>clearTimeout(metadataTimer));
  if(closed||generation!==generations.get(layer))throw Error('資料請求已取消');
  if(layer!=='sst'&&calendar?.timestamps?.length&&(timestamp<calendar.timestamps[0]||timestamp>calendar.timestamps.at(-1)))throw Error('所選時間超出 '+source+' 的 '+layer+' 資料範圍');
  let reader=readers.get(layer);if(!reader){reader=createVisibilityReader({...deps,spec:{layer,...specs[layer]}},{timeoutMs:12000,retryMs:1000});readers.set(layer,reader);}
  return reader.read(source,point,timestamp).catch(e=>{throw Error(e.message.replaceAll('能見度',layer));});
 }
 return {read,destroy(){closed=true;ocean.destroy();for(const reader of readers.values())reader.destroy();readers.clear();}};
}

// Non-forecast map products (radar, satellite, etc.) do not define the ACT model.
function createForecastModelSelector(store,pointProducts){
 const supported=new Set(Array.isArray(pointProducts)?pointProducts:['ecmwf','gfs','icon']);
 let last='ecmwf';
 return ()=>{const current=store.get('product');if(supported.has(current))last=current;return last;};
}
function visibilityModel(model,products){
 if(products?.[model]?.overlays?.includes('visibility'))return model;
 if(products?.ecmwf?.overlays?.includes('visibility'))return 'ecmwf';
 throw Error('目前未找到可用的 Windy 能見度模式');
}

/* src/plugin.svelte generated by Svelte v4.2.20 */

function add_css(target) {
	append_styles(target, "svelte-1brpt6r", ".actweather{--bg:#373b40;--fg:#f5f7fa;--muted:#c5cbd4;--card:#44494f;--line:#60666e;--accent:#7cdbef;background:var(--bg);color:var(--fg);padding:20px;font:15px/1.6 system-ui, sans-serif;border-radius:12px}.actweather.light{--bg:#fff;--fg:#17212b;--muted:#526070;--card:#f3f5f7;--line:#ccd3db;--accent:#00677a}.actweather *{box-sizing:border-box}.actweather h1{font-size:30px;margin:0;letter-spacing:-1px}.actweather h2{font-size:14px;color:var(--muted);margin:0 0 4px}.actweather p{margin:4px 0 14px;white-space:pre-line}.actweather small{color:var(--accent);letter-spacing:1px}.actweather nav,.actweather .controls,.actweather footer{display:flex;flex-wrap:wrap;gap:10px;margin:15px 0}.actweather button,.actweather select,.actweather input{background:var(--card);color:var(--fg);border:1px solid var(--line);border-radius:7px;padding:8px;font:inherit;max-width:100%}.actweather button{cursor:pointer}.actweather button[aria-pressed=true]{background:var(--accent);color:var(--bg);font-weight:bold}.actweather button:disabled{opacity:0.45;cursor:default}.actweather label{display:block;font-size:12px;color:var(--muted)}.actweather label select,.actweather label input:not([type=checkbox]){display:block;width:100%}.actweather section{padding:12px 0;border-bottom:1px solid var(--line)}.actweather pre{white-space:pre-wrap;overflow-wrap:anywhere;padding:14px;background:var(--card);border-radius:8px}.actweather details{margin:12px 0}.actweather [data-sources]{width:100%}.actweather [data-sources] p{overflow-wrap:anywhere}.actweather summary{cursor:pointer;color:var(--accent)}.actweather table{width:100%;font-size:12px}.actweather td,.actweather th{padding:5px;border-bottom:1px solid var(--line);text-align:left}.actweather .act-card-preview{display:block;width:100%;height:auto;margin:12px 0}.actweather .act-export-progress{position:fixed;inset:0;z-index:100000;background:rgba(20, 27, 36, 0.94);color:#fff;display:flex;align-items:center;justify-content:center;flex-direction:column;padding:24px;text-align:center}.actweather [data-card-results] a{color:var(--accent);display:inline-block;margin:10px}.actweather [role=alert]{color:#fb847c}");
}

function create_fragment(ctx) {
	let div0;
	let t1;
	let section;
	let div1;

	return {
		c() {
			div0 = element("div");
			div0.textContent = "ACTweather";
			t1 = space();
			section = element("section");
			div1 = element("div");
			div1.innerHTML = `<p role="status">ACTweather 正在啟動…</p>`;
			attr(div0, "class", "plugin__mobile-header");
			attr(section, "class", "plugin__content");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			insert(target, t1, anchor);
			insert(target, section, anchor);
			append(section, div1);
			/*div1_binding*/ ctx[2](div1);
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t1);
				detach(section);
			}

			/*div1_binding*/ ctx[2](null);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let root, app, marker, visibilityReader, tileLoader, dataAPI, captureAPI;
	const num = () => Number(store.get('timestamp'));

	const onopen = params => {
		if (app && params?.lat != null && params?.lon != null) app.select({
			lat: Number(params.lat),
			lon: Number(params.lon)
		});
	};

	onMount(() => {
		try {
			if (!store || typeof store.get !== 'function' || typeof store.on !== 'function') throw Error('Windy store 模組無法使用');

			tileLoader = createVisibilityTileLoader({
				fetchImageBlob,
				rawDataToCanvasImageSource,
				getImageData,
				decodeHeader,
				processHeader,
				decodeImageBytesCompact
			});

			visibilityReader = createVisibilityReader({
				createFullRenderingParams,
				getDataZoom,
				loadTile: tileLoader.loadTile,
				mapZoom: () => map.getZoom()
			});

			dataAPI = createIndependentDataAPI(
				{
					getElevation,
					createFullRenderingParams,
					getDataZoom,
					loadTile: tileLoader.loadTile,
					mapZoom: () => map.getZoom()
				},
				products
			);

			const forecastModel = createForecastModelSelector(store, airPointProducts);

			captureAPI = createWindyCapture({
				store,
				bcast,
				map,
				products,
				legendAPI: { overlays, getGradientLegendHTML }
			});

			app = mountACT(root, {
				capture: captureAPI,
				field: (layer, model, point, ts) => dataAPI.read(
					layer,
					layer === 'waves'
					? ['ecmwfWaves', 'gfsWaves']
					: layer === 'currents'
						? ['cmems']
						: layer === 'sst'
							? ['ecmwfAnalysis']
							: [model, 'ecmwf', 'gfs'],
					point,
					ts
				),
				search: searchPlaces,
				visibility: async (model, point, timestamp) => {
					const sourceModel = visibilityModel(model, products);

					return {
						value: await visibilityReader.read(sourceModel, point, timestamp),
						sourceModel
					};
				},
				timeOffset: browserOffsetSeconds,
				time: num,
				model: forecastModel,
				storage: localStorage,
				forecast: async (model, point) => {
					const result = await getPointForecastData(model, { ...point, days: 7, step: 3 }, {
						header: true,
						summary: true,
						celestial: true,
						meteogram: true,
						sounding: true
					});

					if (!result?.data) throw Error('Windy 未回傳資料');
					return result.data;
				},
				copy: async text => {
					if (navigator.clipboard?.writeText) {
						await navigator.clipboard.writeText(text);
						return;
					}

					const t = document.createElement('textarea');
					t.value = text;
					document.body.appendChild(t);
					t.select();
					const ok = document.execCommand('copy');
					t.remove();
					if (!ok) throw Error('copy failed');
				},
				mark: point => {
					if (marker) marker.remove();
					marker = L.marker([point.lat, point.lon]).addTo(map);
				},
				subscribe: handlers => {
					const click = p => handlers.point({
						lat: Number(p.lat),
						lon: Number(p.lon ?? p.lng)
					});

					singleclick.on(config.name, click);
					store.on('timestamp', handlers.time);
					store.on('product', handlers.model);
					store.on('overlay', handlers.visibility);
					bcast.on('redrawFinished', handlers.redraw);

					return () => {
						singleclick.off(config.name, click);
						store.off('timestamp', handlers.time);
						store.off('product', handlers.model);
						store.off('overlay', handlers.visibility);
						bcast.off('redrawFinished', handlers.redraw);
						if (marker) marker.remove();
					};
				}
			});
		} catch(error) {
			console.error('[ACTweather] 啟動失敗', error);
			$$invalidate(0, root.textContent = 'ACTweather 啟動失敗：' + (error?.message ?? String(error)), root);
			root.setAttribute('role', 'alert');
		}
	});

	onDestroy(() => {
		captureAPI?.destroy();
		dataAPI?.destroy();
		visibilityReader?.destroy();
		tileLoader?.destroy();
		app?.destroy();
	});

	function div1_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			root = $$value;
			$$invalidate(0, root);
		});
	}

	return [root, onopen, div1_binding];
}

class Plugin extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { onopen: 1 }, add_css);
	}

	get onopen() {
		return this.$$.ctx[1];
	}
}


// transformCode: Export statement was modified
export { __pluginConfig, Plugin as default };
//# sourceMappingURL=plugin.js.map
