
import Navbar from "@/components/layout/Navbar";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
