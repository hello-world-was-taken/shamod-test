"use client";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";
import Link from "next/link";
import { BASE_URL } from "../../util/constants";
import Toast from "../../components/toast";
import { toast } from "react-toastify";
import Button from "@/components/ui/button";

const Register = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  const handleShopPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const checkPasswordStrength = (password: string) => {
    const alphabeticRegex = /[a-zA-Z]/;
    const numericRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*]/;

    let alphabeticCharsCount = 0;
    for (let i = 0; i < password.length; i++) {
      if (alphabeticRegex.test(password[i])) {
        alphabeticCharsCount++;
      }
    }
    const hasNumericChars = numericRegex.test(password);
    const hasSpecialChars = specialCharRegex.test(password);

    if (alphabeticCharsCount >= 8 && hasNumericChars && hasSpecialChars) {
      setMessage("");
      setPasswordStrength("strong");
    } else if (
      (alphabeticCharsCount >= 8 && hasNumericChars) ||
      (alphabeticCharsCount >= 8 && hasSpecialChars) ||
      (hasNumericChars && hasSpecialChars)
    ) {
      if (alphabeticCharsCount < 8) {
        setMessage("Password must contain at least 8 alphabetic characters.");
      } else if (!hasNumericChars) {
        setMessage("Password must contain at least 1 number.");
      } else if (!hasSpecialChars) {
        setMessage("Password must contain at least 1 special character.");
      }
      setPasswordStrength("medium");
    } else if (
      alphabeticCharsCount >= 8 ||
      hasNumericChars ||
      hasSpecialChars
    ) {
      if (alphabeticCharsCount < 8) {
        setMessage("Password must contain at least 8 alphabetic characters.");
      } else if (!hasNumericChars) {
        setMessage("Password must contain at least 1 number.");
      } else if (!hasSpecialChars) {
        setMessage("Password must contain at least 1 special character.");
      }
      setPasswordStrength("weak");
    } else if (password.length > 0) {
      setMessage(
        "Password must contain at least 8 alphabetic characters, 1 number, and 1 special character."
      );
      setPasswordStrength("");
    } else {
      setMessage("");
      setPasswordStrength("");
    }
  };

  const registerUser = async (
    name: string,
    email: string,
    password: string
  ) => {
    let response;
    try {
      response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: name,
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
    console.log("here here hrer");
    const data = await response.json();

    localStorage.setItem("name", data.name);
    setTimeout(() => {
      toast.success("User Registered in Successfully!");
    }, 1000);
    router.push("/signin");
  };

  return (
    <div className="w-4/5 mx-auto flex flex-col justify-center items-center gap-4">
      <h1 className="text-3xl font-black text-[#C53F3F] ">REGISTER</h1>
      <p className="text-gray-500 font-normal text-md mb-5">
        Fill the form to finish registration
      </p>
      <Formik
        initialValues={{
          email: "",
          name: "",
          password: "",
          confirmPassword: "",
        }}
        validate={(values) => {
          const errors = {
            email: "",
            password: "",
            name: "",
            confirmPassword: "",
          };
          if (!values.email) {
            errors.email = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }
          if (!values.name) {
            errors.name = "Required";
          }
          if (!values.password) {
            errors.password = "Required";
          } else if (values.password.length < 8) {
            errors.password = "Password must be at least 8 characters long";
          }
          if (
            !values.confirmPassword ||
            values.confirmPassword !== values.password
          ) {
            errors.confirmPassword = "Passwords do not match";
          }

          return errors;
        }}
        onSubmit={(values, actions) => {
          actions.resetForm();
        }}
      >
        {({ values, errors, touched, handleChange }) => (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              registerUser(values.name, values.email, values.password);
            }}
            className="w-full flex flex-col justify-center items-start gap-2"
          >
            <div className="w-full flex justify-start items-center gap-2"></div>
            <div className="w-full flex flex-col items-start justify-center gap-1">
              <label htmlFor="email" className="text-sm  text-gray-500">
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
              {errors.email && touched.email && (
                <p className="text-sm text-red-400 font-semibold">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="w-full flex flex-col items-start justify-center gap-1">
              <label htmlFor="name" className="text-sm  text-gray-500">
                Name *
              </label>
              <input
                id="name"
                name="name"
                type="name"
                onChange={handleChange}
                value={values.name}
                className="w-full py-3 border border-gray-400 rounded-md bg-transparent focus:border-gray-600 text-gray-600 px-2"
              />
              {errors.name && touched.name && (
                <p className="text-sm text-red-400 font-semibold">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="w-full flex flex-col items-start justify-center gap-1 ">
              <label htmlFor="password" className="text-sm  text-gray-500">
                Password *
              </label>
              <div className="w-full relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => {
                    handleChange(e);
                    checkPasswordStrength(e.target.value);
                  }}
                  value={values.password}
                  className="w-full py-3 border border-gray-400 rounded-md bg-transparent focus:border-gray-600 text-gray-600 px-2"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3
                                    flex items-center
                                    z-50 cursor-pointer"
                  onClick={handleShopPassword}
                >
                  {showPassword ? (
                    <FaRegEyeSlash size={20} className="text-gray-700" />
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
                        stroke="#383670"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 17C10.3431 17 9 15.6569 9 14C9 12.3431 10.3431 11 12 11C13.6569 11 15 12.3431 15 14C15 15.6569 13.6569 17 12 17Z"
                        stroke="#383670"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>
              {message !== "" && (
                <p className=" text-sm font-semibold text-gray-600">
                  {message}
                </p>
              )}
              <div className="w-full grid grid-cols-3 place-content-center gap-2 pt-1">
                <div
                  className={`h-2 transition ease-in-out bg-gray-300
                    ${passwordStrength === "weak" && "bg-red-400"}
                    ${passwordStrength === "medium" && "bg-yellow-300"}
                    ${passwordStrength === "strong" && "bg-green-300"}
                    rounded-md`}
                ></div>
                <div
                  className={`h-2 transition ease-in-out bg-gray
                   ${passwordStrength === "medium" && "bg-yellow-300"}
                    ${passwordStrength === "strong" && "bg-green-300"}
                   bg-gray-300 rounded-md`}
                ></div>
                <div
                  className={`h-2 transition ease-in-out bg-gray-300 ${
                    passwordStrength === "strong" && "bg-green-300"
                  } bg-gray-300 rounded-md`}
                ></div>
              </div>
              {errors.password && touched.password && (
                <p className="text-sm text-red-400 font-semibold">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="w-full flex flex-col items-start justify-center gap-1 ">
              <label
                htmlFor="confirmPassword"
                className="text-sm  text-gray-500"
              >
                Re-Enter Password *
              </label>
              <div className="w-full relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  onChange={handleChange}
                  value={values.confirmPassword}
                  className="w-full py-3 border border-gray-400 rounded-md bg-transparent focus:border-gray-600 text-gray-600 px-2"
                />
                <div
                  className="absolute inset-y-0 right-0 top-50 pr-3
                                    flex items-center
                                    z-50 cursor-pointer"
                  onClick={handleShowConfirmPassword}
                >
                  {showConfirmPassword ? (
                    <FaRegEyeSlash size={20} className="text-gray-700" />
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
                        stroke="#383670"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 17C10.3431 17 9 15.6569 9 14C9 12.3431 10.3431 11 12 11C13.6569 11 15 12.3431 15 14C15 15.6569 13.6569 17 12 17Z"
                        stroke="#383670"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="text-sm text-red-400 font-semibold">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="w-full flex justify-center items-center py-4">
              <Button text="Register" />
            </div>
            <div className="w-full flex justify-center items-center">
              <p className="text-gray-500 font-normal text-md ">
                Already have an account?{" "}
                <Link href="/signin">
                  <span className="cursor-pointer underline">Login</span>
                </Link>
              </p>
            </div>
          </form>
        )}
      </Formik>

      <Toast />
    </div>
  );
};

export default Register;
