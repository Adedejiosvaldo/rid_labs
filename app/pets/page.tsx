"use client";
import { SetStateAction, useState } from "react";
import { signIn } from "next-auth/react";
import { Input, Modal } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import { subtitle, title } from "@/components/primitives";
import Link from "next/link";
import { z } from "zod";
import { LoginSchema } from "@/app/ValidationSchema";
import { Callout } from "@radix-ui/themes";
import { MdError } from "react-icons/md";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
type IssueForm = z.infer<typeof LoginSchema>;
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { getServerSession } from "next-auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Pets = () => {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueForm>({
    resolver: zodResolver(LoginSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [signInVisible, setSignInVisible] = useState(false);
  const [petType, setPetType] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const { theme } = useTheme();
  const calloutColor = theme === "dark" ? "gray" : "red";

  const handleCreatePet = async (data: IssueForm) => {
    setIsLoading(true);
    try {
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      console.log({ response });
      if (!response?.error) {
        toast.success("Login Successful");
        router.push("/dashboard/owners");
        router.refresh();
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      console.error("Error creating pet:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          <Callout.Root variant="outline" color={calloutColor}>
            <Callout.Icon>
              <MdError />
            </Callout.Icon>
            <Callout.Text className="font-medium">
              Only Pet Owners Are to Login Here .
            </Callout.Text>
          </Callout.Root>
        </div>
      </section>
      <div className="container mx-auto p-6 md:p-6 lg:p-8 m-auto">
        <div className="flex  justify-center  flex-col flex-wrap md:flex-nowrap gap-4">
          <form onSubmit={handleSubmit(handleCreatePet)}>
            {" "}
            <Input
              {...register("email")}
              isRequired
              type="email"
              label="Email"
              color="default"
              variant="bordered"
              isInvalid={Boolean(errors.email)}
              errorMessage={errors.email?.message}
              isClearable
              className=""
              description="We'll never share your email with anyone else."
            />
            {errors.email && (
              <p className="text-red-500 mt-2 mb-2 font-medium text-sm">
                {errors.email.message}
              </p>
            )}
            <Input
              {...register("password")}
              label="Password"
              color="default"
              variant="bordered"
              isInvalid={Boolean(errors.password)}
              errorMessage={errors.password?.message}
              //   value={password}
              endContent={
                <button
                  className="bg-default-100 p-1 rounded-lg"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label="toggle password visibility"
                >
                  {isVisible ? (
                    <FaEye className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
              className="border-11 mt-2 border-s-orange-400 flex items-center justify-center"
            />
            {errors.password && (
              <p className="text-red-500 mt-2  font-medium text-sm">
                {errors.password.message}
              </p>
            )}
            <div className="flex mt-3 justify-center items-center">
              <Button
                type="submit"
                isLoading={isLoading}
                color="primary"
                className="w-full p-3 rounded-lg font-medium text-sm"
                spinner={
                  <svg
                    className="animate-spin h-5 w-5 text-current"
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      fill="currentColor"
                    />
                  </svg>
                }
              >
                Login
              </Button>
            </div>
          </form>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h3 className="dark:text-sm mt-8 font-light text-center text-white white:text-black">
            Don't Have an Account Yet?
            <span className="ml-2 text-md font-medium text-white hover:underline dark:text-black">
              <Link href="/pets/signup">Sign Up</Link>
            </span>
          </h3>
        </div>
      </div>

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default Pets;
