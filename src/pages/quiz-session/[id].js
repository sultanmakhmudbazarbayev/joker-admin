import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { initSocket, disconnectSocket, emitEvent } from "@/socket";
import QuizSession from "@/ui/quiz-session";
import { clearSocket, setSocket } from "@/application/store/reducers/socketClientSlice";
import { useDispatch } from "react-redux";
import useSocket from "@/hooks/useSocket";

const Page = () => {
  const router = useRouter();
  const { id } = router.query;
  const [socket, setSocket] = useState(useSocket())

  useEffect(() => {
    if (socket && id) {

      console.log('admin sent', socket)
      console.log('id', socket)

      socket.emit('connect-admin', id);
      socket.emit('connect-tablets', id);
    }
  }, [socket, id]);

  return (
    <QuizSession id={id}/>
  );
};

export default Page;
