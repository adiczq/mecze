"use client";

import { useEffect, useState } from "react";

export default function InAppBrowserNotice() {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    const isFacebook =
      userAgent.includes("fbav") ||
      userAgent.includes("fban") ||
      userAgent.includes("facebook");

    const isMessenger =
      userAgent.includes("messenger") || userAgent.includes("fb_iab");

    setShowNotice(isFacebook || isMessenger);
  }, []);

  if (!showNotice) {
    return null;
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-2xl border border-blue-200 bg-white p-4 shadow-xl">
      <div className="flex items-start gap-3">
        <div className="text-2xl">📱</div>

        <div className="flex-1">
          <p className="font-bold text-slate-900">
            Chcesz zainstalować aplikację?
          </p>

          <p className="mt-1 text-sm leading-5 text-slate-600">
            Otwórz tę stronę w Chrome, aby dodać Górnik Radlin – Mecze do ekranu
            głównego.
          </p>

          <p className="mt-2 text-xs font-medium text-blue-600">
            Menu ⋮ → Otwórz w przeglądarce / Chrome
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNotice(false)}
          className="rounded-lg px-2 py-1 text-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Zamknij komunikat"
        >
          ×
        </button>
      </div>
    </div>
  );
}
