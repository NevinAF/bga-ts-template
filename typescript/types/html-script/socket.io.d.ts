/** Defined by the Socket.IO library. */
declare var io: socket.IO.SocketIO;
declare namespace socket.IO {
    interface SocketIO {
        (uri: string, options: any): Socket;
        connect(uri: string, options: any): Socket;
        io: SocketIO;
        Socket: SocketConstructor;
        Manager: {
            new (...args: any[]): any;
        };
    }
    /** Defined by the Socket.IO library. */
    interface SocketConstructor {
        new: (...args: any[]) => Socket;
    }
    /** Defined by the Socket.IO library. */
    interface Socket {
        io: Socket;
        on(event: string, callback: (...args: any[]) => void): void;
        off(event: string, callback: (...args: any[]) => void): void;
        emit(event: string, ...args: any[]): void;
        close(): void;
    }
}
//# sourceMappingURL=socket.io.d.ts.map