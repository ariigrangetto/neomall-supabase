import { Search } from "lucide-react";
import { useRef, useState } from "react";
import useFilters from "../hooks/useFilters.tsx";

export default function SearchSection() {
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
      <div>
        <div>
          <form action='submit' onSubmit={handleSubmit}>
            <input
              type='text'
              placeholder='Essence Mascara Lash Princess'
              value={input}
              onChange={onChangeText}
            />
          </form>
          <button>
            <Search />
          </button>
        </div>
        <div>
          <select onChange={handleSelectCategory}>
            <option value=''>Category</option>
            <option value='beauty'>Beauty</option>
            <option value='fragrances'>Fragrances</option>
            <option value='furniture'>Furniture</option>
            <option value='groceries'>Groceries</option>
            <option value='womens-watches'>Womens watches</option>
            <option value='womens-dresses'>Womens dresses</option>
            <option value='womens-jewellery'>Womens jewellery</option>
            <option value='womens-shoes'>Womens shoes</option>
            <option value='womens-bags'>Womens bags</option>
            <option value='vehicle'>Vehicle</option>
            <option value='tops'>Tops</option>
            <option value='tablets'>Tablets</option>
            <option value='sunglasses'>Sunglasses</option>
            <option value='sports-accessories'>Sports accessories</option>
            <option value='smartphones'>Smartphones</option>
            <option value='skin-care'>Skin care</option>
            <option value='motorcycle'>Motorcycle</option>
            <option value='mobile-accessories'>Mobile accessories</option>
            <option value='mens-watches'>Mens watches</option>
            <option value='mens-shoes'>Mens shoes</option>
            <option value='mens-shirts'>Mens shirts</option>
            <option value='laptops'>Laptops</option>
            <option value='kitchen-accessories'>kitchen accessories</option>
            <option value='home-decoration'>Home decoration</option>
          </select>
        </div>
      </div>
    </>
  );
}
