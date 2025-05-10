
import Navbar from "@/components/layout/Navbar";
import RegisterForm from "@/components/auth/RegisterForm";

const Register = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
