import SearchSection from "../components/SearchSection.jsx";
import Pagination from "../components/Pagination.js";
import ListOfProducts from "../components/ListOfProducts.js";
import { Link } from "react-router";
import Footer from "../components/Footer.js";
import useFilters from "../hooks/useFilters.js";
import { useRef, useState } from "react";
import { Search, ShoppingCart } from "lucide-react";

export default function Products() {
  const { setFilters } = useFilters();
  const [input, setInput] = useState<string>("");
  let timeout = useRef<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const onChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInput(text);

    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(() => {
      setFilters((prevState) => ({
        ...prevState,
        text,
      }));
    }, 500);
  };

  const handleSelectCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prevSate) => ({
      ...prevSate,
      category: e.target.value,
    }));
  };
  return (
    <>
      <title>Neomall products</title>


      <div className="flex flex-wrap items-center justify-between w-full gap-3 p-6">

        <div className="flex items-center shrink-0">
          <nav className="flex items-center text-center gap-2">
            <img src="/iconN.png" alt="ICON IMAGE" className="h-8" />
            <h1 className="font-bold text-xl">Neomall</h1>
          </nav>
        </div>


        <div className="flex items-center justify-center shrink-0 gap-7">
          <nav className="flex items-center ">
            <form action='submit' onSubmit={handleSubmit}>
              <input
                type='text'
                placeholder='Essence Mascara Lash Princess'
                value={input}
                onChange={onChangeText}
                className="w-60 px-3 py-1 rounded-md text-white focus:outline-none"
              />
            </form>
            <button className="p-1 hover:text-gray-300 transition-colors cursor-pointer">
              <Search size={18} />
            </button>
          </nav>
          <nav>
            <select onChange={handleSelectCategory} className="outline-0 bg-transparent appearance-none cursor-pointer text-white ">
              <option className="bg-[#071427]" value=''>Category</option>
              <option className="bg-[#071427]" value='beauty'>Beauty</option>
              <option className="bg-[#071427]" value='fragrances'>Fragrances</option>
              <option className="bg-[#071427]" value='furniture'>Furniture</option>
              <option className="bg-[#071427]" value='groceries'>Groceries</option>
              <option className="bg-[#071427]" value='womens-watches'>Womens watches</option>
              <option className="bg-[#071427]" value='womens-dresses'>Womens dresses</option>
              <option className="bg-[#071427]" value='womens-jewellery'>Womens jewellery</option>
              <option className="bg-[#071427]" value='womens-shoes'>Womens shoes</option>
              <option className="bg-[#071427]" value='womens-bags'>Womens bags</option>
              <option className="bg-[#071427]" value='vehicle'>Vehicle</option>
              <option className="bg-[#071427]" value='tops'>Tops</option>
              <option className="bg-[#071427]" value='tablets'>Tablets</option>
              <option className="bg-[#071427]" value='sunglasses'>Sunglasses</option>
              <option className="bg-[#071427]" value='sports-accessories'>Sports accessories</option>
              <option className="bg-[#071427]" value='smartphones'>Smartphones</option>
              <option className="bg-[#071427]" value='skin-care'>Skin care</option>
              <option className="bg-[#071427]" value='motorcycle'>Motorcycle</option>
              <option className="bg-[#071427]" value='mobile-accessories'>Mobile accessories</option>
              <option className="bg-[#071427]" value='mens-watches'>Mens watches</option>
              <option className="bg-[#071427]" value='mens-shoes'>Mens shoes</option>
              <option className="bg-[#071427]" value='mens-shirts'>Mens shirts</option>
              <option className="bg-[#071427]" value='laptops'>Laptops</option>
              <option className="bg-[#071427]" value='kitchen-accessories'>kitchen accessories</option>
              <option className="bg-[#071427]" value='home-decoration'>Home decoration</option>
            </select>
          </nav>
        </div>
        <div className="flex items-center shrink-0 gap-3">
          <nav className="w-10 text-center">
            <Link to="/cart">
              <ShoppingCart size={25} />
            </Link>
          </nav>
          <nav className="w-10 text-center">
            <Link to="/profile">
              <img src="/profilePic.png" className="h-9 rounded-full" alt="USER PROFILE PIC" />
            </Link>
          </nav>
        </div>
      </div>
      <div className="border border-gray-950" />

      <ListOfProducts />
      <Pagination />
      <Footer />
    </>
  );
}
