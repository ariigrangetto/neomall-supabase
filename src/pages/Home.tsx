import { Link } from "react-router";

export default function Home() {
  return (
    <>
      <main className='home-main'>
        <title>NeoMall</title>
        <section className='home-section'>
          <div className='home-presentation'>
            <div className='home-icon-title'>
              <img src='/icon.svg' alt='app icon' className='home-icon' />
              <h3>NeoMall</h3>
            </div>
            <div className='home-name-presentation'>
              <h2 className='home-title'>
                Your shopping <br></br> experience, redefined.
              </h2>
              <p>The future of online shopping, simplified for you</p>
            </div>
          </div>
          <Link to='/products' className='btn'>
            Explore products
          </Link>
        </section>
      </main>
    </>
  );
}
