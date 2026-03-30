/* eslint-disable react/react-in-jsx-scope */
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className='w-full py-4 flex items-center justify-center'>
      <small className='text-white text-sm'>
        &copy; {year} NeoMall. All rights reserved
      </small>
    </footer>
  );
}
