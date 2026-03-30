/* eslint-disable react/react-in-jsx-scope */
import { useNavigate } from "react-router";

export default function ErrorPage() {
  const navigate = useNavigate();
  const goToHome = () => {
    navigate("/");
  };

  return (
    <main>
      <div>
        <h1>Opps!</h1>
        <h2>Looks like something went wrong</h2>
        <p>
          It may have been an error or the page you are trying to access does not exist.
        </p>
        <button onClick={goToHome}>Back to home</button>
      </div>
    </main>
  );
}
