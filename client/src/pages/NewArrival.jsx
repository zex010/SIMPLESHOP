import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

// NOTE: this file replaces client/src/pages/NewIn.jsx (see the rename
// section of the response for why it was rebuilt rather than moved
// byte-for-byte - the original NewIn.jsx wasn't included in the files
// you shared, so this follows the same hero + grid pattern as
// Men.jsx/Women.jsx/Bestsellers.jsx). Please sanity-check this against
// your real NewIn.jsx and tell me about any extra logic it had
// (e.g. date-based "new" windows, custom copy) so I can port it over.
function NewArrival() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://avernus-api.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => {
        const all = data.products || [];
        const newProducts = all.filter((product) => product.isNew === true);
        setProducts(newProducts);
      })
      .catch((error) => {
        console.log("Products Error:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      {/* HERO */}
      <section className="relative h-[70vh] flex items-center justify-center border-b border-stone-100">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-stone-500 mb-8">
            THE VINTAGE BOUTIQUE
          </p>
          <h1 className="font-serif text-6xl md:text-8xl tracking-[0.15em]">
            NEW ARRIVALS
          </h1>
          <p className="mt-8 text-stone-500 tracking-[0.3em] uppercase text-sm">
            The Latest Additions To Our Collection
          </p>
        </div>
      </section>

      {/* PRODUCTS - same ProductCard component as Home. */}
      <section className="px-6 md:px-16 py-20">
        {loading ? (
          <p className="text-center py-20 uppercase tracking-[0.4em] text-xs text-stone-400">
            Loading...
          </p>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="font-serif text-4xl">No New Arrivals Found</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20 items-stretch">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} badge="NEW ARRIVAL" />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

export default NewArrival;