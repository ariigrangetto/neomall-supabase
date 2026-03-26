import { Link } from "react-router";
import Footer from "../components/Footer.tsx";

export default function NotFound() {
  return (
    <>
      <header>
        <h1>404</h1>
        <h2>Page not found</h2>
        <p>The page you are looking for might have been removed, had its name changed or is temporarily unavailable.</p>
        <Link to='/'>Back to home</Link>
      </header>
      <Footer />
    </>
  );
}
