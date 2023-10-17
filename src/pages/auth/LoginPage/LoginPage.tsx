import { Button, Input, Typography } from "antd";
import { useContext, useState } from "react";
import Lottie from "react-lottie-player";
import { useMutation } from "react-query";
import { Link } from "react-router-dom";
import AuthService from "../../../api/AuthService";
import { AuthContext } from "../../../context/AuthContext";
import { socialMedia } from "../../../res";

const { Text } = Typography;

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUser } = useContext(AuthContext);

  const createSignInMutation = useMutation({
    mutationFn: AuthService.login,
    onSuccess: (data) => {
      setUser(data.user);
    },
  });

  return (
    <div className="flex justify-center items-center flex-col">
      <Lottie loop play animationData={socialMedia} className=" w-[40%]" />
      <div className="flex w-[60%] py-8 items-center flex-col border border-solid border-gray-500 rounded-[15px]">
        <h1 className="mb-3">Social Media</h1>
        <Input
          placeholder="Email"
          size="large"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-[70%] mb-3"
        />
        <Input
          placeholder="Password"
          size="large"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-[70%] mb-3"
        />
        <Button
          type="primary"
          className="w-[70%] mb-3"
          loading={createSignInMutation.isLoading}
          onClick={() => {
            createSignInMutation.mutate({
              email,
              password,
            });
          }}
        >
          Log in
        </Button>

        <Text>
          Don't have an account? <Link to="/sign-up">Sign up</Link>
        </Text>
      </div>
    </div>
  );
}

export default LoginPage;
