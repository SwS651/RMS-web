import { AuthPage } from "@refinedev/antd";
import { useRegister } from "@refinedev/core";
import { notification } from "antd";
import { authProvider } from "../../authProvider";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
export const Register = () => {
  const { mutate: register,isLoading } = useRegister();
  return  (
      <AuthPage
          type="register"
          formProps={{
              onFinish: (values) => {
                register(values); // Call the custom hook
              },
            }}
          submitProps={{
              loading: isLoading, // Show loading state
          }}
      />  
  )
};




export const useSignup = () => {
  const navigate = useNavigate();

  return useMutation(
    async (params: { email: string; password: string; name?: string }) => {
      if (!authProvider.signup) {
        throw new Error("Signup method is not implemented in authProvider.");
      }
      const response = await authProvider.signup(params);
      if (!response.success) {
        throw new Error(response.error?.message || "Signup failed");
      }
      return response;
    },
    {
      onSuccess: (data: { redirectTo: any }) => {
        notification.success({
          message: "Sign-up Successful",
          description: "Your account has been created successfully.",
        });
        navigate(data.redirectTo || "/login");
      },
      onError: (error: any) => {
        notification.error({
          message: "Sign-up Error",
          description: error.message || "An error occurred during sign-up.",
        });
      },
    }
  );
};