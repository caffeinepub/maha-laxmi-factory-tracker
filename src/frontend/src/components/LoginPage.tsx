import { Button } from "@/components/ui/button";
import { AlertTriangle, Factory, Loader2, Waves } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function LoginPage() {
  const { login, isLoggingIn, isInitializing, isLoginError } =
    useInternetIdentity();
  const [showHelp, setShowHelp] = useState(false);

  const handleLogin = () => {
    setShowHelp(false);
    login();
  };

  return (
    <div className="min-h-screen factory-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, oklch(0.65 0.16 55), transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-8"
          style={{
            background:
              "radial-gradient(circle, oklch(0.72 0.13 40), transparent 70%)",
          }}
        />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Logo / Brand block */}
        <div className="text-center mb-10">
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.65 0.16 55), oklch(0.72 0.13 40))",
              boxShadow: "0 8px 32px oklch(0.65 0.16 55 / 0.35)",
            }}
            initial={{ scale: 0.8, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <Factory className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            className="font-display text-4xl font-bold tracking-tight text-foreground mb-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            MAHA LAXMI
          </motion.h1>
          <motion.p
            className="font-display text-lg font-semibold tracking-widest text-primary uppercase mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            FACTORY
          </motion.p>
          <motion.p
            className="text-muted-foreground text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Production & Inventory Management System
          </motion.p>
        </div>

        {/* Login card */}
        <motion.div
          className="bg-card border border-border rounded-2xl p-8 shadow-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-border">
            <Waves className="w-5 h-5 text-primary" />
            <div>
              <h2 className="font-display font-semibold text-base">
                Towel Production Tracker
              </h2>
              <p className="text-xs text-muted-foreground">
                Bath · Hand · Face
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sign in to track production, manage dispatches, and monitor stock
              levels across all towel categories.
            </p>

            <Button
              data-ocid="login.primary_button"
              onClick={handleLogin}
              disabled={isLoggingIn || isInitializing}
              className="w-full h-12 text-base font-semibold tracking-wide"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.65 0.16 55), oklch(0.72 0.13 40))",
              }}
            >
              {isLoggingIn || isInitializing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting... (allow popup if asked)
                </>
              ) : (
                "Sign In to Continue"
              )}
            </Button>

            {/* Error / help block */}
            <AnimatePresence>
              {(isLoginError || showHelp) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2"
                  data-ocid="login.error_state"
                >
                  <div className="flex items-center gap-2 text-amber-600">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span className="text-sm font-semibold">
                      Login blocked by Chrome
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Chrome is blocking the login popup. Follow these steps:
                  </p>
                  <ol className="text-xs text-foreground space-y-1 list-decimal list-inside">
                    <li>
                      Look at the <strong>address bar</strong> in Chrome (top of
                      screen)
                    </li>
                    <li>
                      Click the <strong>popup blocked icon</strong> (small box
                      with X)
                    </li>
                    <li>
                      Select{" "}
                      <strong>"Always allow popups from this site"</strong>
                    </li>
                    <li>
                      Click <strong>"Sign In to Continue"</strong> again
                    </li>
                  </ol>
                  <p className="text-xs text-muted-foreground pt-1">
                    Or open the app in <strong>Incognito mode</strong>{" "}
                    (Ctrl+Shift+N) where extensions are disabled.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {!showHelp && !isLoginError && (
              <button
                type="button"
                onClick={() => setShowHelp(true)}
                className="w-full text-xs text-center text-muted-foreground hover:text-foreground transition-colors pt-1 underline-offset-2 hover:underline"
              >
                Seeing an error? Click here for help
              </button>
            )}

            <p className="text-xs text-center text-muted-foreground pt-1">
              Secured with Internet Identity — your decentralized authentication
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 hover:underline"
          >
            Built with caffeine.ai
          </a>
        </p>
      </motion.div>
    </div>
  );
}
