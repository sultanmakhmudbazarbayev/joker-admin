import { Result } from "antd";
import Link from "next/link";

export default function Page() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Данная страница не существует"
      extra={<Link href="/">Вернуться на главную</Link>}
    />
  );
}
