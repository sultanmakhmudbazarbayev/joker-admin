import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { initSocket, disconnectSocket, emitEvent } from "@/socket";
import QuizSession from "@/ui/quiz-session";
import { clearSocket, setSocket } from "@/application/store/reducers/socketClientSlice";
import { useDispatch } from "react-redux";

const Page = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const [socketClient, setSocketClient] = useState(null);

  useEffect(() => {
    if (id && !socketClient) {
      const newSocketClient = initSocket();
      console.log('Socket initialized:', newSocketClient);
      setSocketClient(newSocketClient);
      dispatch(setSocket(newSocketClient));
    }

    return () => {
      if (socketClient) {
        disconnectSocket(socketClient);
        dispatch(clearSocket());
      }
    };
  }, [id, socketClient, dispatch]);

  useEffect(() => {
    if (socketClient && id) {
      emitEvent(socketClient, 'connect-admin', id);
      emitEvent(socketClient, 'connect-tablets', id);
    }
  }, [socketClient, id]);

  return (
    <QuizSession id={id}/>
  );
};

export default Page;
