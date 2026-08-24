const { Server } = require("socket.io");
const corsOptions = require("./config/corsOptions");

let io;

module.exports = {
  init: (httpServer) => {
    io = new Server(httpServer, {
      cors: corsOptions,
    });

    io.on("connection", (socket) => {
      console.log("Bir kullanıcı bağlandı: " + socket.id);

      socket.on("join_room", (userId) => {
        if (userId) {
          socket.join(userId);
          console.log(`Kullanıcı ${userId} odaya katıldı.`);
        }
      });

      socket.on("disconnect", () => {
        console.log("Bir kullanıcı ayrıldı: " + socket.id);
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io henüz başlatılmadı!");
    }
    return io;
  },
};
