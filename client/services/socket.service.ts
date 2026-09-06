import { io, Socket } from "socket.io-client";
import eventBus from "./eventBus";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000";
const SOCKET_URL = API_URL.replace(/\/api\/?$/, "");

class SocketService {
  private socket: Socket | null = null;
  private currentBoardId: string | null = null;
  private isBridged = false;

  public init() {
    if (this.socket) return this.socket;

    try {
      this.socket = io(SOCKET_URL, {
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      this.socket.on("connect", () => {
        // Re-join current board room if reconnecting
        if (this.currentBoardId) {
          this.socket?.emit("join:board", this.currentBoardId);
        }
      });

      this.setupEventBridge();
    } catch (err) {
      console.error("[SocketService] Failed to connect socket:", err);
    }

    return this.socket;
  }

  public getSocket(): Socket | null {
    if (!this.socket) {
      return this.init();
    }
    return this.socket;
  }

  public joinBoard(boardId: string) {
    if (!boardId) return;
    this.currentBoardId = boardId;
    const socket = this.getSocket();
    socket?.emit("join:board", boardId);
  }

  public leaveBoard(boardId: string) {
    if (!boardId) return;
    if (this.currentBoardId === boardId) {
      this.currentBoardId = null;
    }
    const socket = this.getSocket();
    socket?.emit("leave:board", boardId);
  }

  public broadcast(event: string, payload: any) {
    if (!this.currentBoardId) return;
    const socket = this.getSocket();
    socket?.emit("board:action", {
      boardId: this.currentBoardId,
      event,
      payload,
    });
  }

  /**
   * Two-way Event Bridge:
   * 1. Listens to remote socket events -> emits to local eventBus
   * 2. Listens to local eventBus events -> broadcasts to remote socket room
   */
  private setupEventBridge() {
    if (this.isBridged || !this.socket) return;
    this.isBridged = true;

    // Incoming remote events from other peers
    const remoteEvents = [
      "card:updated",
      "card:deleted",
      "list:created",
      "list:creating",
      "list:reordered",
      "board:updated",
      "board:deleting",
    ];

    remoteEvents.forEach((eventName) => {
      this.socket?.on(eventName, (payload: any) => {
        // Forward incoming remote action to local eventBus with a flag to prevent echo loops
        eventBus.emit(eventName, { ...payload, _fromRemote: true });
      });
    });

    // Outgoing local events to broadcast to peers in the same board room
    remoteEvents.forEach((eventName) => {
      eventBus.on(eventName, (payload: any) => {
        // If this event came from a remote peer, do NOT re-broadcast it back!
        if (payload?._fromRemote) return;
        if (this.currentBoardId) {
          this.broadcast(eventName, payload);
        }
      });
    });
  }
}

export default new SocketService();
