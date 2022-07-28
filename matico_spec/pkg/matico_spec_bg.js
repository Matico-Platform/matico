import * as wasm from './matico_spec_bg.wasm';

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let WASM_VECTOR_LEN = 0;

let cachedUint8Memory0 = new Uint8Array();

function getUint8Memory0() {
    if (cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedInt32Memory0 = new Int32Array();

function getInt32Memory0() {
    if (cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let stack_pointer = 32;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}

let cachedFloat32Memory0 = new Float32Array();

function getFloat32Memory0() {
    if (cachedFloat32Memory0.byteLength === 0) {
        cachedFloat32Memory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachedFloat32Memory0;
}
/**
*/
export const SelectionMode = Object.freeze({ Rectangle:0,"0":"Rectangle",Polygon:1,"1":"Polygon",Lasso:2,"2":"Lasso", });
/**
*/
export const LinearLayoutDirection = Object.freeze({ Row:0,"0":"Row",Column:1,"1":"Column", });
/**
*/
export const Justification = Object.freeze({ FlexStart:0,"0":"FlexStart",FlexEnd:1,"1":"FlexEnd",Center:2,"2":"Center",SpaceBetween:3,"3":"SpaceBetween",SpaceAround:4,"4":"SpaceAround",SpaceEvenly:5,"5":"SpaceEvenly", });
/**
*/
export const Alignment = Object.freeze({ FlexStart:0,"0":"FlexStart",FlexEnd:1,"1":"FlexEnd",Center:2,"2":"Center",Stretch:3,"3":"Stretch",BaseLine:4,"4":"BaseLine", });
/**
*/
export const ScreenUnits = Object.freeze({ Pixels:0,"0":"Pixels",Percent:1,"1":"Percent", });
/**
*/
export class App {

    static __wrap(ptr) {
        const obj = Object.create(App.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_app_free(ptr);
    }
    /**
    */
    constructor() {
        const ret = wasm.app_new_dash();
        return App.__wrap(ret);
    }
    /**
    * @returns {any}
    */
    get pages() {
        const ret = wasm.app_get_pages(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {any} pages
    */
    set pages(pages) {
        wasm.app_set_pages(this.ptr, addHeapObject(pages));
    }
    /**
    * @returns {any}
    */
    get panes() {
        const ret = wasm.app_get_panes(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {any} panes
    */
    set panes(panes) {
        wasm.app_set_panes(this.ptr, addHeapObject(panes));
    }
    /**
    * @returns {any}
    */
    get theme() {
        const ret = wasm.app_get_theme(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {any} pages
    */
    set theme(pages) {
        wasm.app_set_theme(this.ptr, addHeapObject(pages));
    }
    /**
    * @returns {any}
    */
    get datasets() {
        const ret = wasm.app_get_datasets(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {any} datasets
    */
    set datasets(datasets) {
        wasm.app_set_datasets(this.ptr, addHeapObject(datasets));
    }
    /**
    * @returns {string}
    */
    get name() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.app_get_name(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {string} name
    */
    set name(name) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.app_set_name(this.ptr, ptr0, len0);
    }
    /**
    * @returns {string}
    */
    get description() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.app_get_description(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {string} description
    */
    set description(description) {
        const ptr0 = passStringToWasm0(description, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.app_set_description(this.ptr, ptr0, len0);
    }
    /**
    * @returns {any}
    */
    get created_at() {
        const ret = wasm.app_get_created_at(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {any} created_at
    */
    set created_at(created_at) {
        wasm.app_set_created_at(this.ptr, addHeapObject(created_at));
    }
    /**
    * @param {any} val
    * @returns {App}
    */
    static from_js(val) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.app_from_js(retptr, addBorrowedObject(val));
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return App.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {string} val
    * @returns {App}
    */
    static from_json(val) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(val, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.app_from_json(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return App.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {any}
    */
    is_valid() {
        const ret = wasm.app_is_valid(this.ptr);
        return takeObject(ret);
    }
    /**
    * @returns {any}
    */
    to_js() {
        const ret = wasm.app_to_js(this.ptr);
        return takeObject(ret);
    }
    /**
    * @returns {string}
    */
    to_toml() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.app_to_toml(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string}
    */
    to_yaml() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.app_to_yaml(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
/**
*/
export class COGDataset {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_cogdataset_free(ptr);
    }
}
/**
*/
export class CSVDataset {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_csvdataset_free(ptr);
    }
    /**
    * @returns {string}
    */
    get name() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.csvdataset_get_name(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {string} name
    */
    set name(name) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.csvdataset_set_name(this.ptr, ptr0, len0);
    }
}
/**
*/
export class ContainerPane {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_containerpane_free(ptr);
    }
}
/**
*/
export class ControlsPane {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_controlspane_free(ptr);
    }
}
/**
*/
export class FreeLayout {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_freelayout_free(ptr);
    }
    /**
    * @returns {boolean}
    */
    get allow_overflow() {
        const ret = wasm.__wbg_get_freelayout_allow_overflow(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set allow_overflow(arg0) {
        wasm.__wbg_set_freelayout_allow_overflow(this.ptr, arg0);
    }
}
/**
*/
export class GeoJSONDataset {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_geojsondataset_free(ptr);
    }
    /**
    * @returns {string}
    */
    get name() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.csvdataset_get_name(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {string} name
    */
    set name(name) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.csvdataset_set_name(this.ptr, ptr0, len0);
    }
}
/**
*/
export class GridLayout {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_gridlayout_free(ptr);
    }
}
/**
*/
export class HistogramPane {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_histogrampane_free(ptr);
    }
    /**
    * @returns {string}
    */
    get name() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.histogrampane_get_name(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {string} name
    */
    set name(name) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.histogrampane_set_name(this.ptr, ptr0, len0);
    }
}
/**
*/
export class Labels {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_labels_free(ptr);
    }
}
/**
*/
export class LinearLayout {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_linearlayout_free(ptr);
    }
    /**
    * @returns {number}
    */
    get direction() {
        const ret = wasm.__wbg_get_freelayout_allow_overflow(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set direction(arg0) {
        wasm.__wbg_set_linearlayout_direction(this.ptr, arg0);
    }
    /**
    * @returns {boolean}
    */
    get allow_overflow() {
        const ret = wasm.__wbg_get_linearlayout_allow_overflow(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set allow_overflow(arg0) {
        wasm.__wbg_set_linearlayout_allow_overflow(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get justify() {
        const ret = wasm.__wbg_get_linearlayout_justify(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set justify(arg0) {
        wasm.__wbg_set_linearlayout_justify(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get align() {
        const ret = wasm.__wbg_get_linearlayout_align(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set align(arg0) {
        wasm.__wbg_set_linearlayout_align(this.ptr, arg0);
    }
}
/**
*/
export class MapControls {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_mapcontrols_free(ptr);
    }
    /**
    * @returns {boolean | undefined}
    */
    get scale() {
        const ret = wasm.__wbg_get_mapcontrols_scale(this.ptr);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
    * @param {boolean | undefined} arg0
    */
    set scale(arg0) {
        wasm.__wbg_set_mapcontrols_scale(this.ptr, isLikeNone(arg0) ? 0xFFFFFF : arg0 ? 1 : 0);
    }
    /**
    * @returns {boolean | undefined}
    */
    get geolocate() {
        const ret = wasm.__wbg_get_mapcontrols_geolocate(this.ptr);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
    * @param {boolean | undefined} arg0
    */
    set geolocate(arg0) {
        wasm.__wbg_set_mapcontrols_geolocate(this.ptr, isLikeNone(arg0) ? 0xFFFFFF : arg0 ? 1 : 0);
    }
    /**
    * @returns {boolean | undefined}
    */
    get navigation() {
        const ret = wasm.__wbg_get_mapcontrols_navigation(this.ptr);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
    * @param {boolean | undefined} arg0
    */
    set navigation(arg0) {
        wasm.__wbg_set_mapcontrols_navigation(this.ptr, isLikeNone(arg0) ? 0xFFFFFF : arg0 ? 1 : 0);
    }
    /**
    * @returns {boolean | undefined}
    */
    get fullscreen() {
        const ret = wasm.__wbg_get_mapcontrols_fullscreen(this.ptr);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
    * @param {boolean | undefined} arg0
    */
    set fullscreen(arg0) {
        wasm.__wbg_set_mapcontrols_fullscreen(this.ptr, isLikeNone(arg0) ? 0xFFFFFF : arg0 ? 1 : 0);
    }
}
/**
*/
export class MapPane {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_mappane_free(ptr);
    }
    /**
    * @returns {string}
    */
    get name() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.mappane_get_name(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {string} name
    */
    set name(name) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.mappane_set_name(this.ptr, ptr0, len0);
    }
}
/**
*/
export class MaticoApiDataset {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_maticoapidataset_free(ptr);
    }
}
/**
*/
export class MaticoRemoteDataset {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_maticoremotedataset_free(ptr);
    }
    /**
    * @returns {string}
    */
    get name() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.csvdataset_get_name(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {string} name
    */
    set name(name) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.csvdataset_set_name(this.ptr, ptr0, len0);
    }
    /**
    * @returns {string}
    */
    get description() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.maticoremotedataset_get_description(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {string} description
    */
    set description(description) {
        const ptr0 = passStringToWasm0(description, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.maticoremotedataset_set_description(this.ptr, ptr0, len0);
    }
    /**
    * @returns {string}
    */
    get server_url() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.maticoremotedataset_get_server_url(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {string} server_url
    */
    set server_url(server_url) {
        const ptr0 = passStringToWasm0(server_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.maticoremotedataset_set_server_url(this.ptr, ptr0, len0);
    }
    /**
    * @returns {string | undefined}
    */
    get dataset_id() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.maticoremotedataset_get_dataset_id(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            let v0;
            if (r0 !== 0) {
                v0 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_free(r0, r1 * 1);
            }
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {string} dataset_id
    */
    set dataset_id(dataset_id) {
        const ptr0 = passStringToWasm0(dataset_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.maticoremotedataset_set_dataset_id(this.ptr, ptr0, len0);
    }
}
/**
*/
export class Metadata {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_metadata_free(ptr);
    }
}
/**
*/
export class Page {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_page_free(ptr);
    }
    /**
    * @returns {string}
    */
    get name() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.page_get_name(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {string} name
    */
    set name(name) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.page_set_name(this.ptr, ptr0, len0);
    }
    /**
    * @returns {string | undefined}
    */
    get path() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.page_get_path(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            let v0;
            if (r0 !== 0) {
                v0 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_free(r0, r1 * 1);
            }
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {string} path
    */
    set path(path) {
        const ptr0 = passStringToWasm0(path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.page_set_path(this.ptr, ptr0, len0);
    }
    /**
    * @returns {string | undefined}
    */
    get icon() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.page_get_icon(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            let v0;
            if (r0 !== 0) {
                v0 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_free(r0, r1 * 1);
            }
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {string} icon
    */
    set icon(icon) {
        const ptr0 = passStringToWasm0(icon, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.page_set_icon(this.ptr, ptr0, len0);
    }
    /**
    * @param {string} pane_type
    * @param {string} pane_id
    */
    add_pane(pane_type, pane_id) {
        const ptr0 = passStringToWasm0(pane_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(pane_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        wasm.page_add_pane(this.ptr, ptr0, len0, ptr1, len1);
    }
    /**
    * @param {string} before_pane_id
    * @param {string} pane_type
    * @param {string} pane_id
    */
    add_pane_before(before_pane_id, pane_type, pane_id) {
        const ptr0 = passStringToWasm0(before_pane_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(pane_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(pane_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        wasm.page_add_pane_before(this.ptr, ptr0, len0, ptr1, len1, ptr2, len2);
    }
    /**
    * @param {string} after_pane_id
    * @param {string} pane_type
    * @param {string} pane_id
    */
    add_pane_after(after_pane_id, pane_type, pane_id) {
        const ptr0 = passStringToWasm0(after_pane_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(pane_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(pane_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        wasm.page_add_pane_after(this.ptr, ptr0, len0, ptr1, len1, ptr2, len2);
    }
    /**
    * @param {string} pane_id
    * @param {number} new_pos
    */
    move_pane_to_position(pane_id, new_pos) {
        const ptr0 = passStringToWasm0(pane_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.page_move_pane_to_position(this.ptr, ptr0, len0, new_pos);
    }
    /**
    * @param {string} pane_type
    * @param {string} pane_id
    * @param {number} index
    */
    add_pane_at_position(pane_type, pane_id, index) {
        const ptr0 = passStringToWasm0(pane_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(pane_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        wasm.page_add_pane_at_position(this.ptr, ptr0, len0, ptr1, len1, index);
    }
    /**
    * @param {number} index
    */
    remove_pane_at_position(index) {
        wasm.page_remove_pane_at_position(this.ptr, index);
    }
    /**
    * @param {string} pane_id
    */
    remove_pane(pane_id) {
        const ptr0 = passStringToWasm0(pane_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.page_remove_pane(this.ptr, ptr0, len0);
    }
}
/**
*/
export class PanePosition {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_paneposition_free(ptr);
    }
    /**
    * @returns {string}
    */
    get x_units() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.paneposition_get_x_units(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string}
    */
    get y_units() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.paneposition_get_y_units(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string}
    */
    get width_units() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.paneposition_get_width_units(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string}
    */
    get height_units() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.paneposition_get_height_units(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string}
    */
    get pad_units_left() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.paneposition_get_pad_units_left(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string}
    */
    get pad_units_right() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.paneposition_get_pad_units_right(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string}
    */
    get pad_units_top() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.paneposition_get_pad_units_top(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string}
    */
    get pad_units_bottom() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.paneposition_get_pad_units_bottom(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {number}
    */
    get width() {
        const ret = wasm.__wbg_get_paneposition_width(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set width(arg0) {
        wasm.__wbg_set_paneposition_width(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get height() {
        const ret = wasm.__wbg_get_paneposition_height(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set height(arg0) {
        wasm.__wbg_set_paneposition_height(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get layer() {
        const ret = wasm.__wbg_get_paneposition_layer(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set layer(arg0) {
        wasm.__wbg_set_paneposition_layer(this.ptr, arg0);
    }
    /**
    * @returns {boolean}
    */
    get float() {
        const ret = wasm.__wbg_get_paneposition_float(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set float(arg0) {
        wasm.__wbg_set_paneposition_float(this.ptr, arg0);
    }
    /**
    * @returns {number | undefined}
    */
    get x() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_paneposition_x(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getFloat32Memory0()[retptr / 4 + 1];
            return r0 === 0 ? undefined : r1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number | undefined} arg0
    */
    set x(arg0) {
        wasm.__wbg_set_paneposition_x(this.ptr, !isLikeNone(arg0), isLikeNone(arg0) ? 0 : arg0);
    }
    /**
    * @returns {number | undefined}
    */
    get y() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_paneposition_y(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getFloat32Memory0()[retptr / 4 + 1];
            return r0 === 0 ? undefined : r1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number | undefined} arg0
    */
    set y(arg0) {
        wasm.__wbg_set_paneposition_y(this.ptr, !isLikeNone(arg0), isLikeNone(arg0) ? 0 : arg0);
    }
    /**
    * @returns {number | undefined}
    */
    get pad_left() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_paneposition_pad_left(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getFloat32Memory0()[retptr / 4 + 1];
            return r0 === 0 ? undefined : r1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number | undefined} arg0
    */
    set pad_left(arg0) {
        wasm.__wbg_set_paneposition_pad_left(this.ptr, !isLikeNone(arg0), isLikeNone(arg0) ? 0 : arg0);
    }
    /**
    * @returns {number | undefined}
    */
    get pad_right() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_paneposition_pad_right(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getFloat32Memory0()[retptr / 4 + 1];
            return r0 === 0 ? undefined : r1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number | undefined} arg0
    */
    set pad_right(arg0) {
        wasm.__wbg_set_paneposition_pad_right(this.ptr, !isLikeNone(arg0), isLikeNone(arg0) ? 0 : arg0);
    }
    /**
    * @returns {number | undefined}
    */
    get pad_top() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_paneposition_pad_top(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getFloat32Memory0()[retptr / 4 + 1];
            return r0 === 0 ? undefined : r1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number | undefined} arg0
    */
    set pad_top(arg0) {
        wasm.__wbg_set_paneposition_pad_top(this.ptr, !isLikeNone(arg0), isLikeNone(arg0) ? 0 : arg0);
    }
    /**
    * @returns {number | undefined}
    */
    get pad_bottom() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_paneposition_pad_bottom(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getFloat32Memory0()[retptr / 4 + 1];
            return r0 === 0 ? undefined : r1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number | undefined} arg0
    */
    set pad_bottom(arg0) {
        wasm.__wbg_set_paneposition_pad_bottom(this.ptr, !isLikeNone(arg0), isLikeNone(arg0) ? 0 : arg0);
    }
}
/**
*/
export class PieChartPane {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_piechartpane_free(ptr);
    }
    /**
    * @returns {string}
    */
    get name() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.histogrampane_get_name(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {string} name
    */
    set name(name) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.histogrampane_set_name(this.ptr, ptr0, len0);
    }
}
/**
*/
export class RangeControl {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_rangecontrol_free(ptr);
    }
}
/**
*/
export class ScatterplotPane {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_scatterplotpane_free(ptr);
    }
    /**
    * @returns {string}
    */
    get name() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.histogrampane_get_name(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {string} name
    */
    set name(name) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.histogrampane_set_name(this.ptr, ptr0, len0);
    }
}
/**
*/
export class SelectControl {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_selectcontrol_free(ptr);
    }
}
/**
*/
export class SelectionOptions {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_selectionoptions_free(ptr);
    }
    /**
    * @returns {boolean}
    */
    get selection_enabled() {
        const ret = wasm.__wbg_get_selectionoptions_selection_enabled(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set selection_enabled(arg0) {
        wasm.__wbg_set_selectionoptions_selection_enabled(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get selection_mode() {
        const ret = wasm.__wbg_get_selectionoptions_selection_mode(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set selection_mode(arg0) {
        wasm.__wbg_set_selectionoptions_selection_mode(this.ptr, arg0);
    }
}
/**
*/
export class TextPane {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_textpane_free(ptr);
    }
    /**
    * @returns {string}
    */
    get content() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.textpane_get_content(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {string} content
    */
    set content(content) {
        const ptr0 = passStringToWasm0(content, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.textpane_set_content(this.ptr, ptr0, len0);
    }
    /**
    * @returns {string}
    */
    get name() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.textpane_get_name(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {string} name
    */
    set name(name) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.textpane_set_name(this.ptr, ptr0, len0);
    }
    /**
    * @returns {string | undefined}
    */
    get font() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.textpane_get_font(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            let v0;
            if (r0 !== 0) {
                v0 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_free(r0, r1 * 1);
            }
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {string} font
    */
    set font(font) {
        const ptr0 = passStringToWasm0(font, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.textpane_set_font(this.ptr, ptr0, len0);
    }
    /**
    * @returns {string | undefined}
    */
    get background() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.textpane_get_background(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            let v0;
            if (r0 !== 0) {
                v0 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_free(r0, r1 * 1);
            }
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {string} background
    */
    set background(background) {
        const ptr0 = passStringToWasm0(background, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.textpane_set_background(this.ptr, ptr0, len0);
    }
}
/**
*/
export class Theme {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_theme_free(ptr);
    }
    /**
    * @returns {any}
    */
    get primaryColor() {
        const ret = wasm.theme_get_primary_color(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {any} val
    */
    set primaryColor(val) {
        wasm.theme_set_primary_color(this.ptr, addHeapObject(val));
    }
    /**
    * @returns {any}
    */
    get secondaryColor() {
        const ret = wasm.theme_get_secondary_color(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {any} val
    */
    set secondaryColor(val) {
        wasm.theme_set_secondary_color(this.ptr, addHeapObject(val));
    }
    /**
    * @returns {string | undefined}
    */
    get icon() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.theme_get_icon(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            let v0;
            if (r0 !== 0) {
                v0 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_free(r0, r1 * 1);
            }
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {string} logo_url
    */
    set icon(logo_url) {
        const ptr0 = passStringToWasm0(logo_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.theme_set_icon(this.ptr, ptr0, len0);
    }
}
/**
*/
export class ValidationResult {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_validationresult_free(ptr);
    }
    /**
    * @returns {boolean}
    */
    get is_valid() {
        const ret = wasm.__wbg_get_validationresult_is_valid(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set is_valid(arg0) {
        wasm.__wbg_set_validationresult_is_valid(this.ptr, arg0);
    }
}
/**
*/
export class View {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_view_free(ptr);
    }
    /**
    * @returns {number}
    */
    get lat() {
        const ret = wasm.__wbg_get_view_lat(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set lat(arg0) {
        wasm.__wbg_set_view_lat(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get lng() {
        const ret = wasm.__wbg_get_view_lng(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set lng(arg0) {
        wasm.__wbg_set_view_lng(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get zoom() {
        const ret = wasm.__wbg_get_view_zoom(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set zoom(arg0) {
        wasm.__wbg_set_view_zoom(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get bearing() {
        const ret = wasm.__wbg_get_view_bearing(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set bearing(arg0) {
        wasm.__wbg_set_view_bearing(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get pitch() {
        const ret = wasm.__wbg_get_view_pitch(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set pitch(arg0) {
        wasm.__wbg_set_view_pitch(this.ptr, arg0);
    }
}
/**
*/
export class WASMCompute {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmcompute_free(ptr);
    }
}

export function __wbindgen_json_serialize(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = JSON.stringify(obj === undefined ? null : obj);
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export function __wbindgen_object_drop_ref(arg0) {
    takeObject(arg0);
};

export function __wbindgen_json_parse(arg0, arg1) {
    const ret = JSON.parse(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export function __wbg_getTime_58b0bdbebd4ef11d(arg0) {
    const ret = getObject(arg0).getTime();
    return ret;
};

export function __wbg_new0_adda2d4bcb124f0a() {
    const ret = new Date();
    return addHeapObject(ret);
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

