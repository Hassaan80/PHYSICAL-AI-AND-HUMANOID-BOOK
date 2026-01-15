export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Todo App
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Professional task management application
          </p>
        </div>

        <div className="bg-white rounded-lg shadow px-6 py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
