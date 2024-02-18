import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
const Page = () => {

  const router = useRouter();
  const { id } = router.query;

  return (
    <>
    {id && <div>QUIZ SESSION {id}</div>}
    </>
  );
};

export default Page;
