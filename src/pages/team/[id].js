import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import TeamEditor from "@/ui/team/";



const Page = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <TeamEditor id={id}/>
  );
};

export default Page;
