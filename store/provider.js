"use client";

import { Provider, useDispatch } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";
import { checkAuth } from "./slices/authSlice";

// Uygulama yüklendiğinde (veya sayfa yenilendiğinde) oturumu kontrol eden sarmalayıcı
function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Tarayıcıdaki httpOnly cookie'yi arka planda doğrula
    dispatch(checkAuth());
  }, [dispatch]);

  return children;
}

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}
