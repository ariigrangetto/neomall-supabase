import { Link } from "react-router";

export default function NotFound() {
  return (
    <>
      <header>
        <h1>404</h1>
        <h2>Not found</h2>
        <p>It looks like theres been an error</p>
        <Link to='/'>Return to NeoMall</Link>
      </header>
    </>
  );
}
