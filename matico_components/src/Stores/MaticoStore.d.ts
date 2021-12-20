export declare const store: import("@reduxjs/toolkit").EnhancedStore<{
    variables: import("./MaticoVariableSlice").VariableState;
    spec: unknown;
}, import("redux").AnyAction, [import("redux-thunk").ThunkMiddleware<{
    variables: import("./MaticoVariableSlice").VariableState;
    spec: unknown;
}, import("redux").AnyAction, null> | import("redux-thunk").ThunkMiddleware<{
    variables: import("./MaticoVariableSlice").VariableState;
    spec: unknown;
}, import("redux").AnyAction, undefined>]>;
export declare type MaticoState = ReturnType<typeof store.getState>;
export declare type MaticoDispatch = typeof store.dispatch;
