import { Link, useNavigate } from "react-router";
import Footer from "../components/Footer.tsx";

export default function Home() {
  const navigate = useNavigate();

  const handleClickLogin = () => {
    navigate("/login")
  }

  const handleClickRegister = () => {
    navigate("/register");
  }

  const handleClickProducts = () => {
    navigate("/products");
  }

  return (
    <>
      <div className='min-h-screen flex flex-col'>
        <main className='home-main flex flex-col flex-1  items-center overscroll-y-none mb-0'>
          <title>NeoMall</title>
          <div className='home-icon-title flex items-center mb-8 justify-center  mt-60 '>
            <img
              src='/iconN.png'
              alt='app icon'
              className='home-icon justify-center flex m-auto w-36  '
            />
            <h3 className='text-white items-center mt-2 font-bold text-4xl'>
              NeoMall
            </h3>
          </div>
          <section className='home-section flex flex-col items-center text-center '>
            <div className='home-name-presentation relative'>
              <h2 className='home-title text-3xl font-bold mb-4 text-white '>
                Your shopping <br></br> experience, redefined.
              </h2>
              <p className='text-white'>
                The future of online shopping, simplified for you.
              </p>
            </div>
          </section>
          <section>

            <div className="mt-13 justify-center flex m-auto">
              <button
                onClick={handleClickProducts}
                className='btn h-8 px-5 bg-[rgba(7,75,248,1)] rounded text-white border-0 pointer  hover:bg-[rgba(7,75,248,0.8)] hover:text-white hover:border-0 hover:duration-500'
              >
                Explore products
              </button>
            </div>
            <div className="flex gap-3 mt-3 justify-center">
              <button
                onClick={handleClickLogin}
                className='btn h-8 px-5 bg-[rgba(7,75,248,1)] rounded text-white border-0 pointer  hover:bg-[rgba(7,75,248,0.8)] hover:text-white hover:border-0 hover:duration-500'
              >
                Login
              </button>
              <button
                onClick={handleClickRegister}
                className='btn h-8 px-5 bg-[rgba(7,75,248,1)] rounded text-white border-0 pointer  hover:bg-[rgba(7,75,248,0.8)] hover:text-white hover:border-0 hover:duration-500'
              >
                Register
              </button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
