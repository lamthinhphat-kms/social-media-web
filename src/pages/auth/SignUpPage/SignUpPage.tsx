import { Button, Input, Typography } from "antd";
import { useContext, useState } from "react";
import { useMutation } from "react-query";
import { Link } from "react-router-dom";
import AuthService from "../../../api/AuthService";
import { AuthContext } from "../../../context/AuthContext";
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
    <div className="flex justify-center items-center flex-col">
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
          placeholder="Name"
          size="large"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
        {error.length > 0 ? (
          <Text style={{ color: "red" }}>{error}</Text>
        ) : (
          <></>
        )}
        <Button
          type="primary"
          className="w-[70%] mb-3"
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
