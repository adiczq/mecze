type StatusCardProps = {
  title: string;
  description?: string;
  variant?: "empty" | "error";
};

export default function StatusCard({
  title,
  description,
  variant = "empty",
}: StatusCardProps) {
  const isError = variant === "error";

  return (
    <div
      className={`rounded-3xl border p-6 text-center ${
        isError
          ? "border-red-200 bg-red-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <div
        className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full text-lg font-black ${
          isError
            ? "bg-red-100 text-red-600"
            : "bg-blue-50 text-blue-600"
        }`}
      >
        {isError ? "!" : "–"}
      </div>

      <h3
        className={`mt-4 text-lg font-bold ${
          isError ? "text-red-700" : "text-slate-900"
        }`}
      >
        {title}
      </h3>

      {description && (
        <p
          className={`mx-auto mt-2 max-w-md text-sm leading-6 ${
            isError ? "text-red-600" : "text-slate-500"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}