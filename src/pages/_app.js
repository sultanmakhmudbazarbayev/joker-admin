import "antd/dist/reset.css";
import "@/application/theme/main.less";

import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import { ConfigProvider } from "antd";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/application/store'; // Adjust the import path as necessary
import ruRU from "antd/lib/locale/ru_RU";
import NextProgress from "nextjs-progressbar";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import React from "react";
import Sidebar from "@/application/layout"; // Ensure this path is correct

dayjs.locale("ru");

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();

  // Determine if the sidebar should be displayed
  const showSidebar = router.pathname !== '/login';

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ConfigProvider locale={ruRU}>
          <SessionProvider session={session}>
              <NextProgress color="#1677ff" />
              <div style={{ display: 'flex' }}>
                {showSidebar && <Sidebar />}
                <div style={{ flex: 1, paddingLeft: showSidebar ? "70px" : "0" }}> {/* Adjust based on your Sidebar width */}
                  <Component {...pageProps} />
                </div>
              </div>
          </SessionProvider>
        </ConfigProvider>
        </PersistGate>
    </Provider>
  );
}
