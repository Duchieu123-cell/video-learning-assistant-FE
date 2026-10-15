import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <main className="h-screen">
        <Outlet />
    </main>
  );
}

export default RootLayout;
