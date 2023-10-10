import { useContext, useEffect, useRef, useState } from "react";
import "./styles.css";
import { Button, Input } from "antd";
import { useMutation } from "react-query";
import AuthService from "../../../api/AuthService";
import { AuthContext } from "../../../context/AuthContext";
import { Typography } from "antd";
import { Link } from "react-router-dom";
import Lottie from "react-lottie-player";

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
    <div className="container">
      <Lottie
        loop
        play
        animationData={require("../../../../public/animations/social-media.json")}
        style={{
          width: "40%",
        }}
      />
      <div className="login_container">
        <h1 style={{ marginBottom: "12px" }}>Social Media</h1>
        <Input
          placeholder="Email"
          size="large"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="default_component"
        />
        <Input
          placeholder="Password"
          size="large"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="default_component"
        />
        <Button
          type="primary"
          className="default_component"
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
