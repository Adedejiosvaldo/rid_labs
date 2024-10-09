"use client"; // Make this a client component

import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";
const SessionProviderWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <SessionProvider>
      <NextUIProvider>{children}</NextUIProvider>
    </SessionProvider>
  );
};

export default SessionProviderWrapper;
