/* eslint-disable react/react-in-jsx-scope */
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import useUrl from "../hooks/useUrl.tsx";
import ItemDetails from "../components/ItemDetails.tsx";
import Footer from "../components/Footer.tsx";

export default function Details() {
  const navigate = useNavigate();
  const { products, loading } = useUrl();
  const { id } = useParams();

  const handleRedirectProducts = () => {
    navigate("/products");
  }


  const item = products?.find((product) => product.id.toString() === id);

  return (
    <>
      <title>{item?.title}</title>
      <div className="flex flex-wrap items-center justify-between w-full gap-3 p-6">
        <div className="flex items-center shrink-0">
          <nav className="flex items-center text-center gap-2">
            <div className="flex items-center gap-2">
              <button className="cursor-pointer" onClick={() => handleRedirectProducts()}><ArrowLeft /></button>
              <button className="cursor-pointer" onClick={() => navigate("/")}>
                <img src="/iconN.png" alt="ICON IMAGE" className="h-8" />
              </button>
              <h1 className="font-bold text-xl">Neomall</h1>
            </div>
          </nav>
        </div>
        <div className="flex items-center shrink-0 gap-3">
          <nav className="w-10 text-center">
            <Link to="/profile">
              <img src="/profilePic.png" className="h-9 rounded-full" aria-label="profilePic" alt="USER PROFILE PIC" />
            </Link>
          </nav>
        </div>
      </div>
      <div className="border border-gray-950"></div>

      <div className="min-h-screen flex flex-col">
        {item ? <ItemDetails item={item} isLoading={loading} /> :
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-xl">Loading product or product not found...</p>
            <Loader2 className="w-12 h-12 text-[rgba(7,75,248,1)] animate-spin" />
          </div>
        }
      </div>
      <Footer />
    </>
  );
}
