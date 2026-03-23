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
      <title>NeoMall</title>
      <div className='min-h-screen flex flex-col'>
        <main className='flex-grow flex flex-col items-center justify-center p-4'>
          <div className='flex items-center mb-8 justify-center gap-2'>
            <button onClick={() => navigate("/")} className='outline-none border-none cursor-pointer'>
              <img
                src='/iconN.png'
                alt='app icon'
                className='w-36'
              />
            </button>
            <h3 className='text-white font-bold text-4xl'>
              NeoMall
            </h3>
          </div>
          <section className='flex flex-col items-center text-center'>
            <div className='relative'>
              <h2 className='text-3xl font-bold mb-4 text-white '>
                Your shopping <br></br> experience, redefined.
              </h2>
              <p className='text-white'>
                The future of online shopping, simplified for you.
              </p>
            </div>
          </section>
          <section className='flex flex-col items-center mt-10'>
            <button
              onClick={() => handleClickProducts()}
              className='h-10 border border-[rgba(7,75,248,1)] w-60 rounded-full text-white cursor-pointer hover:bg-[rgba(7,75,248,0.8)] hover:text-white hover:border-0 hover:duration-500 transition-all font-semibold'
            >
              Explore products
            </button>

            <div className="flex gap-3 mt-5 justify-center">
              <p>Already have an account?</p>
              <p className="text-blue-500 cursor-pointer font-semibold"><Link to="/login">Login</Link></p>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
