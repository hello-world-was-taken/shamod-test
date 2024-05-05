"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Formik } from "formik";
import Image from "next/image";
import { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";
import { BASE_URL } from "../../util/constants";
import Toast from "../../components/toast";
import { toast } from "react-toastify";
import Button from "@/components/ui/button";

const Signin = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const router = useRouter();

  const signInUser = async (email: string, password: string) => {
    let response;
    try {
      response = await fetch(`${BASE_URL}/signin`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
    } catch (err) {
      toast.error("Could not connect to the server, please try again later.");
      return;
    }
    if (response.status !== 200) {
      toast.error("Something went wrong");
      return;
    }
    const data = await response.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("name", data.name);
    localStorage.setItem("email", data.email);
    localStorage.setItem("id", data.id);
    router.push("/");
    toast.success("User signed in Successfully!");
  };

  return (
    <div className="w-4/5 mx-auto flex flex-col justify-center items-center gap-8">
      <h1 className="text-3xl font-black text-[#C53F3F]">
        LOGIN TO YOUR ACCOUNT
      </h1>

      <Formik
        initialValues={{ email: "", password: "", checkbox: false }}
        validate={(values) => {
          const errors = { email: "", password: "" };
          if (!values.email) {
            errors.email = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }
          if (!values.password) {
            errors.password = "Required";
          }
          return errors;
        }}
        onSubmit={(values, actions) => {
          actions.resetForm();
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form
            onSubmit={(e) => {
              signInUser(values.email, values.password);
              e.preventDefault();
            }}
            className="w-full flex flex-col justify-center items-start gap-2"
          >
            <div className="w-full flex flex-col items-start justify-center gap-1">
              <label htmlFor="email" className="text-sm poppins text-gray-500">
                Your Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                onChange={handleChange}
                value={values.email}
                className="w-full py-3 border border-gray-400 rounded-md bg-transparent focus:border-gray-600 text-gray-600 px-2"
              />
            </div>
            {errors.email && touched.email && (
              <p className="text-sm text-red-400 font-semibold">
                {errors.email}
              </p>
            )}
            <div className="w-full flex flex-col items-start justify-center gap-1 ">
              <label
                htmlFor="password"
                className="text-sm poppins text-gray-500"
              >
                Password *
              </label>
              <div className="w-full relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  onChange={handleChange}
                  value={values.password}
                  className="w-full py-3 border border-gray-400 rounded-md bg-transparent focus:border-gray-600 text-gray-600 px-2"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3
                                    flex items-center
                                    z-50 cursor-pointer"
                  onClick={handleShowPassword}
                >
                  {showPassword ? (
                    <FaRegEyeSlash size={24} color="text-gray-700" />
                  ) : (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 13C6.6 5 17.4 5 21 13"
                        stroke="#000    "
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 17C10.3431 17 9 15.6569 9 14C9 12.3431 10.3431 11 12 11C13.6569 11 15 12.3431 15 14C15 15.6569 13.6569 17 12 17Z"
                        stroke="#000"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
            {errors.password && touched.password && (
              <p className="text-sm text-red-400 font-semibold">
                {errors.password}
              </p>
            )}
            <div className="w-full flex justify-start items-center gap-2">
              <input
                type="checkbox"
                name="checkbox"
                id="checkbox"
                onChange={handleChange}
                checked={values.checkbox}
                className="w-4 h-4 text-gray-300 cursor-pointer"
              />
              <label
                htmlFor="checkbox"
                className="text-md poppins text-gray-500 cursor-pointer"
              >
                Remember Me
              </label>
            </div>

            <div className="w-full flex justify-center items-center py-4">
              <Button text="Log in" />
            </div>
            <div className="w-full flex justify-center items-center">
              <Link href="/register">
                <p className="text-gray-500 underline font-normal text-md cursor-pointer">
                  Sign up
                </p>
              </Link>
            </div>
          </form>
        )}
      </Formik>

      <Toast />
    </div>
  );
};

export default Signin;
