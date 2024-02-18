import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { _fetchQuizById } from "../api/requests";
import QuizEditor from "@/ui/quiz/quiz-editor";



const Page = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <QuizEditor id={id}/>
  );
};

export default Page;
