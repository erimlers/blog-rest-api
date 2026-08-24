"use client";

import { Provider, useDispatch } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";
import { checkAuth } from "./slices/authSlice";
import { addNotificationSocket } from "./slices/notificationSlice";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

let socket;

// Uygulama yüklendiğinde (veya sayfa yenilendiğinde) oturumu kontrol eden sarmalayıcı
function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Tarayıcıdaki httpOnly cookie'yi arka planda doğrula
    dispatch(checkAuth());
  }, [dispatch]);

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "http://localhost:8080");
      }
      socket.emit("join_room", user._id);

      socket.on("new_notification", (notification) => {
        dispatch(addNotificationSocket(notification));
      });

      return () => {
        socket.off("new_notification");
      };
    }
  }, [isAuthenticated, user, dispatch]);

  return children;
}

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}
