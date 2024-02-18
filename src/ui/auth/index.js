import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Row, Col, Card, Form, Input, Button } from "antd";
import { Typography } from "antd";
import Head from "next/head";
import { createContext, useContext, useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

const Context = createContext();
const { Text, Title } = Typography;

const Auth = () => {
  const [state, setState] = useState("login");

  return (
    <Context.Provider value={{ state, setState }}>
      {state === "login" && <Login />}
    </Context.Provider>
  );
};

const Login = () => {
  const [loading, setLoading] = useState(false);

  const form = useRef();
  const router = useRouter();

  const onSubmit = async () => {
    const values = await form.current.validateFields();
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      ...values,
    });

    if (result?.error) {
      setLoading(false);
    }

    const url = new URL(result.url);
    const pathname = url.searchParams.get("callbackUrl");
    if (!pathname) return router.push("/");

    router.push(pathname);
  };
  return (
    <>
      <Head>
        <title>JOKER</title>
      </Head>
      <Row className="auth-form">
        <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={5}>
          <Card>
            <Title level={3} className="welcome">
              Добро пожаловать
            </Title>
            <Title level={5} className="title">
              Введите данные для входа в систему
            </Title>
            <Form layout="vertical" ref={form} autoComplete="off">
              <Form.Item
                name="login"
                rules={[
                  {
                    required: true,
                    message: "Данное поле обязательно для заполнения",
                  },
                ]}
              >
                <Input
                  disabled={loading}
                  placeholder="Введите логин"
                  prefix={<UserOutlined className={"prefixIcon"} />}
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Данное поле обязательно для заполнения",
                  },
                ]}
              >
                <Input
                  disabled={loading}
                  placeholder="Введите пароль"
                  prefix={<LockOutlined className={"prefixIcon"} />}
                  size="large"
                  type="password"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onSubmit();
                    }
                  }}
                />
              </Form.Item>
            </Form>
            <Button
              loading={loading}
              type="primary"
              block
              size="large"
              onClick={onSubmit}
            >
              Войти
            </Button>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Auth;
