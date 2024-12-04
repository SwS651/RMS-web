import { AuthPage } from "@refinedev/antd";

export const Login = () => {
    return (
      <AuthPage type="login" providers={[
        {
            name: "google",
            label: "Sign in with Google",
        },
    ]}/>
    );
};
