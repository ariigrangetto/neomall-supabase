import { Link } from "react-router";
import Footer from "../components/Footer.tsx";

export default function Home() {
  return (
    <>
      <div className='min-h-screen flex flex-col'>
        <main className='home-main flex flex-col flex-1  items-center overscroll-y-none mb-0'>
          <title>NeoMall</title>
          <div className='home-icon-title flex items-center mb-8 justify-center  mt-60 '>
            <img
              src='/icon.svg'
              alt='app icon'
              className='home-icon justify-center flex m-auto w-36  '
            />
            <h3 className='text-black items-center mt-2 font-bold text-4xl'>
              NeoMall
            </h3>
          </div>
          <section className='home-section flex flex-col items-center text-center '>
            <div className='home-name-presentation relative'>
              <h2 className='home-title text-3xl font-bold mb-4 text-black '>
                Your shopping <br></br> experience, redefined.
              </h2>
              <p className='text-black'>
                The future of online shopping, simplified for you.
              </p>
            </div>
            <Link
              to='/products'
              className='btn mt-6 px-6 py-2 bg-blue-500 rounded text-white border-0 pointer  hover:bg-blue-600 hover:text-white hover:border-0 hover:duration-500'
            >
              Explore products
            </Link>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
