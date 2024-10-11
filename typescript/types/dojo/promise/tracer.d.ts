declare let tracer: {
    on(type: 'resolved' | 'rejected' | 'progress'): DojoJS.Handle;
    emit: null;
};
declare global {
    namespace DojoJS {
    }
}
export = tracer;
//# sourceMappingURL=tracer.d.ts.map