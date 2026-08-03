"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/auth/AuthModal";

type AuthModalTab = "login" | "signup";

interface AuthModalContextValue {
  openAuthModal: (tab?: AuthModalTab) => void;
}

const AuthModalContext = createContext<AuthModalContextValue>({
  openAuthModal: () => {},
});

export function useAuthModal() {
  return useContext(AuthModalContext);
}

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  // Defaults to "login" to match the modal's own pre-existing default —
  // only overridden when a caller (e.g. the homepage's ?auth=signup
  // handoff from /r/[username]) explicitly asks to open on signup.
  const [initialTab, setInitialTab] = useState<AuthModalTab>("login");
  const router = useRouter();

  return (
    <AuthModalContext.Provider
      value={{
        openAuthModal: (tab) => {
          setInitialTab(tab || "login");
          setOpen(true);
        },
      }}
    >
      {children}
      <AuthModal
        open={open}
        initialTab={initialTab}
        onClose={() => setOpen(false)}
        onSignupComplete={(username) => {
          // Onboarding now lives at its own /onboarding route instead of
          // opening as a modal over the current page. Same 300ms delay
          // after the auth modal closes as before.
          setTimeout(() => {
            setOpen(false);
            router.push(`/onboarding?username=${encodeURIComponent(username)}`);
          }, 300);
        }}
      />
    </AuthModalContext.Provider>
  );
}
