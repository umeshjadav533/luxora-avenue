import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../features/auth/authAPI.js";
import { toast } from "react-toastify";
import { LockKeyhole, Mail, Phone, User } from "lucide-react";
import { registerSchema } from "../validations/authValidation.js";
import { yupResolver } from "@hookform/resolvers/yup";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const submitForm = async (data) => {
    try {
      const res = await dispatch(registerUser(data)).unwrap();
      toast.success(res.message);
      navigate("/");
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br bg-[#F5F5F5] flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold">LUXORA</h1>
          <p className="text-gray-500 text-sm mt-1">Create your account</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(submitForm)}>
          {/* First name and last name*/}
          <div className="flex gap-3">
            <div className="w-full">
              <div>
                <div
                  className={`flex items-center px-4 py-3 bg-transparent border-2 ${errors.first_name ? "border border-red-500" : "border-gray-200"} focus-within:border-black`}
                >
                  <User size={18} className="text-gray-500 mr-3" />
                  <input
                    type="text"
                    placeholder="First name"
                    className="bg-transparent outline-none text-sm w-full"
                    {...register("first_name")}
                  />
                </div>
                {errors.first_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.first_name?.message}
                  </p>
                )}
              </div>
            </div>

            <div className="w-full">
              <div>
                <div
                  className={`flex items-center px-4 py-3 bg-transparent border-2 ${errors.last_name ? "border border-red-500" : "border-gray-200"} focus-within:border-black`}
                >
                  <User size={18} className="text-gray-500 mr-3" />
                  <input
                    type="text"
                    placeholder="Last name"
                    className="bg-transparent outline-none text-sm w-full"
                    {...register("last_name")}
                  />
                </div>
                {errors.last_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.last_name?.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <div
              className={`flex items-center px-4 py-3 bg-transparent border-2 ${errors.email ? "border border-red-500" : "border-gray-200"} focus-within:border-black`}
            >
              <Mail size={18} className="text-gray-500 mr-3" />
              <input
                type="email"
                placeholder="Email address"
                className="bg-transparent outline-none text-sm w-full"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email?.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div
              className={`flex items-center px-4 py-3 bg-transparent border-2 ${errors.password ? "border border-red-500" : "border-gray-200"} focus-within:border-black`}
            >
              <LockKeyhole size={18} className="text-gray-500 mr-3" />
              <input
                type="password"
                placeholder="Password"
                className="bg-transparent outline-none text-sm w-full"
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password?.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <div
              className={`flex items-center px-4 py-3 bg-transparent border-2 ${errors.phone_number ? "border border-red-500" : "border-gray-200"} focus-within:border-black`}
            >
              <Phone size={18} className="text-gray-500 mr-3" />
              <input
                type="password"
                placeholder="Phone number"
                className="bg-transparent outline-none text-sm w-full"
                {...register("phone_number")}
              />
            </div>
            {errors.phone_number && (
              <p className="text-red-500 text-xs mt-1">
                {errors.phone_number?.message}
              </p>
            )}
          </div>

          {/* Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-[#212A2F] border-2 text-white py-2.5 cursor-pointer  hover:bg-transparent hover:text-black transition duration-300"
              style={{ fontWeight: 600 }}
            >
              {loading.register && (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              <span>Sign Up</span>
            </button>
          </div>
        </form>

        <p className="text-xs text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
