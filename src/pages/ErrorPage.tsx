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
        <h2>Parece que algo salio mal</h2>
        <p>
          Puede haber sido un error o la pagina a la que intenta ingresarno
          existe.
        </p>
        <button onClick={goToHome}>Ir al inicio de NeoMall</button>
      </div>
    </main>
  );
}
