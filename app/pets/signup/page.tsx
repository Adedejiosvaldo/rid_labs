"use client";
import { SetStateAction, useState } from "react";
import { Input, Modal } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import { subtitle, title } from "@/components/primitives";
import Link from "next/link";
import { z } from "zod";
import { RegisterSchema } from "@/app/ValidationSchema";
import { Callout } from "@radix-ui/themes";
import { MdError } from "react-icons/md";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
type RegForm = z.infer<typeof RegisterSchema>;
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const PetOwnerSignUp = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegForm>({
    resolver: zodResolver(RegisterSchema),
  });
  const [isLoading, setIsLoading] = useState(false);

  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);
  const { theme } = useTheme();
  const calloutColor = theme === "dark" ? "gray" : "red";

  const LoginUser = async (data: RegForm) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/owners/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData); // Log the error data
        return; // Exit if the response is not OK
      }

      const responseData = await response.json();

      router.push("/pets");
      router.refresh();
    } catch (error) {
      console.error("Error creating pet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="flex flex-col items-center justify-center py-8 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          <Callout.Root variant="outline" color={calloutColor}>
            <Callout.Icon>
              <MdError />
            </Callout.Icon>
            <Callout.Text className="font-medium">
              Only Pet Owners Can Create Account Here .
            </Callout.Text>
          </Callout.Root>
        </div>
      </section>
      <div className="container mx-auto p-6 md:p-6 lg:p-8 m-auto">
        <div className="flex  justify-center  flex-col flex-wrap md:flex-nowrap gap-4">
          <form onSubmit={handleSubmit(LoginUser)}>
            <Input
              {...register("name")}
              isRequired
              type="text"
              label="Name"
              color="default"
              variant="bordered"
              isInvalid={Boolean(errors.name)}
              errorMessage={errors.name?.message}
              isClearable
              className="border-11 border-s-orange-400 flex  mb-5 justify-center"
            />

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
              className="border-11 border-s-orange-400 flex  mb-5 justify-center"
              description="We'll never share your email with anyone else."
            />

            <Input
              {...register("phoneNumber")}
              label="Phone Number"
              color="default"
              variant="bordered"
              isInvalid={Boolean(errors.phoneNumber)}
              errorMessage={errors.phoneNumber?.message}
              //   value={password}
              type="tel"
              className="border-11 border-s-orange-400 flex  mb-5 justify-center"
            />

            <Input
              {...register("password")}
              label="Password"
              color="default"
              variant="bordered"
              isInvalid={Boolean(errors.password)}
              errorMessage={errors.password?.message}
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
              className="border-11 mt-2 border-s-orange-400 flex justify-center"
            />

            <div className="flex mt-3 justify-center items-center">
              <Button
                type="submit"
                isLoading={isLoading}
                color="primary"
                className="w-full p-3 rounded-lg font-semibold text-sm"
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
                Sign Up
              </Button>
            </div>
          </form>
        </div>

        <div
          className="
                        flex flex-col items-center justify-center"
        >
          <h3 className="text-sm mt-8 font-light text-center text-white">
            Already Have an Account?
            <span className=" ml-2 text-md font-medium text-center text-white hover:underline">
              <Link href={"/pets "}>Login</Link>
            </span>
          </h3>
        </div>
      </div>
    </>
  );
};

export default PetOwnerSignUp;
