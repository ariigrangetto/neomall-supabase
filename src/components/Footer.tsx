export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className='w-full py-4 flex items-center justify-center'>
      <small className='text-black text-sm'>
        All rights reserved &copy; {year} NeoMall
      </small>
    </footer>
  );
}
