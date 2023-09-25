import { Button, Input, Typography } from "antd";
import { useState } from "react";
import { useMutation } from "react-query";
import AuthService from "../../../api/AuthService";
import { AuthContext } from "../../../context/AuthContext";
import { useContext } from "react";
import { Link } from "react-router-dom";
const { Text } = Typography;

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const { setUser } = useContext(AuthContext);

  const createSignUpMutation = useMutation({
    mutationFn: AuthService.signUp,
    onSuccess: (data) => {
      if (data) {
        setUser(data.user);
      }
    },
    onError: (error) => {
      setError("" + error);
    },
  });

  return (
    <div className="container">
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
          placeholder="Name"
          size="large"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
        {error.length > 0 ? (
          <Text style={{ color: "red" }}>{error}</Text>
        ) : (
          <></>
        )}
        <Button
          type="primary"
          className="default_component"
          loading={createSignUpMutation.isLoading}
          onClick={() => {
            createSignUpMutation.mutate({
              email,
              password,
              name,
            });
          }}
        >
          Sign up
        </Button>

        <Text>
          Already have an account? <Link to="/login">Log in</Link>
        </Text>
      </div>
    </div>
  );
}

export default SignUpPage;
