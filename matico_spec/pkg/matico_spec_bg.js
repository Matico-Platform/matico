import * as wasm from './matico_spec_bg.wasm';

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let WASM_VECTOR_LEN = 0;

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
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

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
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

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

let stack_pointer = 32;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}

let cachegetFloat32Memory0 = null;
function getFloat32Memory0() {
    if (cachegetFloat32Memory0 === null || cachegetFloat32Memory0.buffer !== wasm.memory.buffer) {
        cachegetFloat32Memory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachegetFloat32Memory0;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}
/**
*/
export const ScreenUnits = Object.freeze({ Pixels:0,"0":"Pixels",Percent:1,"1":"Percent", });
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
export class ChartPane {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_chartpane_free(ptr);
    }
    /**
    */
    get position() {
        const ret = wasm.__wbg_get_chartpane_position(this.ptr);
        return PanePosition.__wrap(ret);
    }
    /**
    * @param {PanePosition} arg0
    */
    set position(arg0) {
        _assertClass(arg0, PanePosition);
        var ptr0 = arg0.ptr;
        arg0.ptr = 0;
        wasm.__wbg_set_chartpane_position(this.ptr, ptr0);
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
    /**
    */
    get position() {
        const ret = wasm.__wbg_get_containerpane_position(this.ptr);
        return PanePosition.__wrap(ret);
    }
    /**
    * @param {PanePosition} arg0
    */
    set position(arg0) {
        _assertClass(arg0, PanePosition);
        var ptr0 = arg0.ptr;
        arg0.ptr = 0;
        wasm.__wbg_set_containerpane_position(this.ptr, ptr0);
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
    /**
    */
    get position() {
        const ret = wasm.__wbg_get_controlspane_position(this.ptr);
        return PanePosition.__wrap(ret);
    }
    /**
    * @param {PanePosition} arg0
    */
    set position(arg0) {
        _assertClass(arg0, PanePosition);
        var ptr0 = arg0.ptr;
        arg0.ptr = 0;
        wasm.__wbg_set_controlspane_position(this.ptr, ptr0);
    }
}
/**
*/
export class Dashboard {

    static __wrap(ptr) {
        const obj = Object.create(Dashboard.prototype);
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
        wasm.__wbg_dashboard_free(ptr);
    }
    /**
    */
    constructor() {
        const ret = wasm.dashboard_new_dash();
        return Dashboard.__wrap(ret);
    }
    /**
    * @returns {any}
    */
    get pages() {
        const ret = wasm.dashboard_get_pages(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {any} pages
    */
    set pages(pages) {
        wasm.dashboard_set_pages(this.ptr, addHeapObject(pages));
    }
    /**
    * @returns {any}
    */
    get theme() {
        const ret = wasm.dashboard_get_theme(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {any} pages
    */
    set theme(pages) {
        wasm.dashboard_set_theme(this.ptr, addHeapObject(pages));
    }
    /**
    * @returns {any}
    */
    get datasets() {
        const ret = wasm.dashboard_get_datasets(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {any} datasets
    */
    set datasets(datasets) {
        wasm.dashboard_set_datasets(this.ptr, addHeapObject(datasets));
    }
    /**
    * @returns {string}
    */
    get name() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.dashboard_get_name(retptr, this.ptr);
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
        wasm.dashboard_set_name(this.ptr, ptr0, len0);
    }
    /**
    * @returns {any}
    */
    get created_at() {
        const ret = wasm.dashboard_get_created_at(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {any} created_at
    */
    set created_at(created_at) {
        wasm.dashboard_set_created_at(this.ptr, addHeapObject(created_at));
    }
    /**
    * @param {any} val
    * @returns {Dashboard}
    */
    static from_js(val) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.dashboard_from_js(retptr, addBorrowedObject(val));
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return Dashboard.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {string} val
    * @returns {Dashboard}
    */
    static from_json(val) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(val, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.dashboard_from_json(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return Dashboard.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {any}
    */
    is_valid() {
        const ret = wasm.dashboard_is_valid(this.ptr);
        return takeObject(ret);
    }
    /**
    * @returns {any}
    */
    to_js() {
        const ret = wasm.dashboard_to_js(this.ptr);
        return takeObject(ret);
    }
    /**
    * @returns {string}
    */
    to_toml() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.dashboard_to_toml(retptr, this.ptr);
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
            wasm.dashboard_to_yaml(retptr, this.ptr);
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
    */
    get position() {
        const ret = wasm.__wbg_get_histogrampane_position(this.ptr);
        return PanePosition.__wrap(ret);
    }
    /**
    * @param {PanePosition} arg0
    */
    set position(arg0) {
        _assertClass(arg0, PanePosition);
        var ptr0 = arg0.ptr;
        arg0.ptr = 0;
        wasm.__wbg_set_histogrampane_position(this.ptr, ptr0);
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
    */
    get position() {
        const ret = wasm.__wbg_get_mappane_position(this.ptr);
        return PanePosition.__wrap(ret);
    }
    /**
    * @param {PanePosition} arg0
    */
    set position(arg0) {
        _assertClass(arg0, PanePosition);
        var ptr0 = arg0.ptr;
        arg0.ptr = 0;
        wasm.__wbg_set_mappane_position(this.ptr, ptr0);
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
    */
    get order() {
        const ret = wasm.__wbg_get_page_order(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set order(arg0) {
        wasm.__wbg_set_page_order(this.ptr, arg0);
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
    * @returns {string | undefined}
    */
    get content() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.page_get_content(retptr, this.ptr);
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
    * @param {string} content
    */
    set content(content) {
        const ptr0 = passStringToWasm0(content, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.page_set_content(this.ptr, ptr0, len0);
    }
    /**
    * @returns {any}
    */
    get sections() {
        const ret = wasm.page_get_sections(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {any} sections
    */
    set sections(sections) {
        wasm.page_set_sections(this.ptr, addHeapObject(sections));
    }
}
/**
*/
export class PanePosition {

    static __wrap(ptr) {
        const obj = Object.create(PanePosition.prototype);
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
    */
    get position() {
        const ret = wasm.__wbg_get_piechartpane_position(this.ptr);
        return PanePosition.__wrap(ret);
    }
    /**
    * @param {PanePosition} arg0
    */
    set position(arg0) {
        _assertClass(arg0, PanePosition);
        var ptr0 = arg0.ptr;
        arg0.ptr = 0;
        wasm.__wbg_set_piechartpane_position(this.ptr, ptr0);
    }
    /**
    * @returns {string}
    */
    get name() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.piechartpane_get_name(retptr, this.ptr);
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
        wasm.piechartpane_set_name(this.ptr, ptr0, len0);
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
    */
    get position() {
        const ret = wasm.__wbg_get_piechartpane_position(this.ptr);
        return PanePosition.__wrap(ret);
    }
    /**
    * @param {PanePosition} arg0
    */
    set position(arg0) {
        _assertClass(arg0, PanePosition);
        var ptr0 = arg0.ptr;
        arg0.ptr = 0;
        wasm.__wbg_set_piechartpane_position(this.ptr, ptr0);
    }
    /**
    * @returns {string}
    */
    get name() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.piechartpane_get_name(retptr, this.ptr);
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
        wasm.piechartpane_set_name(this.ptr, ptr0, len0);
    }
}
/**
*/
export class Section {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_section_free(ptr);
    }
    /**
    */
    get order() {
        const ret = wasm.__wbg_get_section_order(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set order(arg0) {
        wasm.__wbg_set_section_order(this.ptr, arg0);
    }
    /**
    * @returns {any}
    */
    get panes() {
        const ret = wasm.section_get_panes(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {any} panes
    */
    set panes(panes) {
        wasm.section_set_panes(this.ptr, addHeapObject(panes));
    }
    /**
    * @returns {string}
    */
    get layout() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.section_get_layout(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {string} layout
    */
    set layout(layout) {
        const ptr0 = passStringToWasm0(layout, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.section_set_layout(this.ptr, ptr0, len0);
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
    */
    get position() {
        const ret = wasm.__wbg_get_containerpane_position(this.ptr);
        return PanePosition.__wrap(ret);
    }
    /**
    * @param {PanePosition} arg0
    */
    set position(arg0) {
        _assertClass(arg0, PanePosition);
        var ptr0 = arg0.ptr;
        arg0.ptr = 0;
        wasm.__wbg_set_containerpane_position(this.ptr, ptr0);
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

export function __wbg_getTime_bffb1c09df09618b(arg0) {
    const ret = getObject(arg0).getTime();
    return ret;
};

export function __wbg_new0_0ff7eb5c1486f3ec() {
    const ret = new Date();
    return addHeapObject(ret);
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};
