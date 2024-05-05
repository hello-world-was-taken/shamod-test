export default function AuthLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="flex w-4/5 mx-auto items-center justify-center min-h-screen ">
      <div className="w-full xl:w-1/2 h-full flex justify-center items-center">
        {children}
      </div>
      <div
        className="hidden xl:w-1/2 min-h-screen xl:flex justify-center items-center"
      >
        <img className="w-full h-full" src="/loginn.svg" alt="svg image" />
      </div>
    </div>
  );
}
