"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/ui/button";

const HeroComponent = () => {
  const [name, setName] = useState(null);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/signin");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found, redirecting to sign-in.");
      router.push("/signin");
    } else {
      const storedName = localStorage.getItem("name");
      setName(storedName);
    }
  }, [router]);

  return (
    <div id="home" className="flex flex-col w-3/5 mx-auto pt-24">
      <div className="flex flex-col gap-8 justify-center items-center">
        <h2 className="text-red-700 text-center text-8xl font-bold">
          Welcome!
        </h2>
        <h3 className="text-gray-800 text-5xl text-center">{name}</h3>
      </div>
      <div className="flex items-center justify-center">
        <Image
          src="/landing.svg"
          alt="hero"
          width={500}
          height={500}
          className="rounded-md"
        />
      </div>

      <form
        onSubmit={(e) => {
          handleLogout();
          e.preventDefault();
        }}
        className="w-full flex flex-col justify-center items-start gap-2"
      >
        <div className="w-full flex justify-center items-center py-4">
          <Button text="Log out" />
        </div>
      </form>
    </div>
  );
};

export default HeroComponent;
