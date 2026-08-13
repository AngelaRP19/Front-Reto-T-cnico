import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-4 bg-bg text-text px-5 text-center transition-colors duration-400">
      <h1 className="text-6xl font-extrabold text-main">404</h1>
      <p className="text-lg opacity-80">Esta página no existe.</p>
      <Link
        to="/"
        className="mt-4 bg-main text-bg px-6 py-3 rounded-full font-bold hover:bg-hover transition"
      >
        Volver al inicio
      </Link>
    </div>
  );
}

export default NotFoundPage;
