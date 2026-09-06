import { Server as SocketIOServer } from "socket.io";
import type { Server as HttpServer } from "http";

let io: SocketIOServer | null = null;

export const initSocket = (server: HttpServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PATCH", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    // Join a specific Board room
    socket.on("join:board", (boardId: string) => {
      if (boardId) {
        socket.join(`board:${boardId}`);
      }
    });

    // Leave a specific Board room
    socket.on("leave:board", (boardId: string) => {
      if (boardId) {
        socket.leave(`board:${boardId}`);
      }
    });

    // Client-side peer-to-peer board actions
    socket.on("board:action", ({ boardId, event, payload }: any) => {
      if (boardId && event) {
        // Broadcast to other clients inside this board's room
        socket.to(`board:${boardId}`).emit(event, payload);
      }
    });

    socket.on("disconnect", () => {});
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error("Socket.io is not initialized yet!");
  }
  return io;
};

export const broadcastToBoard = (boardId: string, event: string, payload: any) => {
  if (io && boardId) {
    io.to(`board:${boardId}`).emit(event, payload);
  }
};
