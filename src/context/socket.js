import { createContext, useEffect, useState } from "react";
import io from "socket.io-client";

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!socket) {

        console.log('reinitiated')

      const instance = io(process.env.NEXT_PUBLIC_BASE_URL);
      setSocket(instance);
    }

    console.log('initiated')

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
