"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

export default function Footer() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const checkInstalled = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        // iOS Safari
        (window.navigator as Navigator & { standalone?: boolean }).standalone;

      setIsInstalled(Boolean(standalone));
    };

    checkInstalled();

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );

      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();

    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  return (
    <footer className="mt-5 border-t border-slate-200/80 bg-white/60">
      <div className="page-shell flex flex-col items-center py-5 text-center">
        <p className="text-sm font-semibold text-slate-700">
          Górnik Radlin · Mecze
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Terminarz drużyn w jednym miejscu
        </p>

        {!isInstalled && deferredPrompt && (
          <button
            type="button"
            onClick={handleInstall}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <span>📲</span>
            Zainstaluj aplikację
          </button>
        )}

        <a
          href="https://www.adiczq.dev"
          target="_blank"
          rel="noreferrer"
          className="mt-3 text-[11px] text-slate-400 transition hover:text-slate-600"
        >
          adiczq.dev
        </a>
      </div>
    </footer>
  );
}
