import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";

function ProductCard({ product }) {

  const { addToCart } = useShop();
  const navigate = useNavigate();

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/checkout");
  };

  return (
    <div className="bg-white cursor-pointer group">

      {/* Product Image */}
      <Link to={`/product/${product._id}`}>
        <div className="aspect-square w-full overflow-hidden bg-[#FAF9F6] flex items-center justify-center rounded-sm">
          <img
            src={`http://localhost:5000${product.image}`}
            alt={product.name}
            className="
              h-full
              w-full
              object-cover
              group-hover:scale-105
              transition-transform
              duration-500
              ease-out
            "
          />
        </div>
      </Link>


      {/* Product Details */}
      <div className="text-center mt-6">

        <p className="text-xs tracking-[4px] uppercase text-stone-400">
          {product.brand}
        </p>

        <h2 className="text-xl font-serif uppercase mt-2 text-stone-900">
          {product.name}
        </h2>

        <p className="mt-2 text-stone-700 font-medium">
          ${product.price}
        </p>


        {/* Add To Bag / Buy Now */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            onClick={() => addToCart(product)}
            className="
              flex-1
              bg-black
              text-white
              px-6
              py-3
              text-xs
              tracking-[3px]
              uppercase
              hover:bg-stone-800
              transition
            "
          >
            Add To Bag
          </button>

          <button
            onClick={handleBuyNow}
            className="
              flex-1
              border
              border-black
              text-black
              px-6
              py-3
              text-xs
              tracking-[3px]
              uppercase
              hover:bg-black
              hover:text-white
              transition
            "
          >
            Buy Now
          </button>
        </div>

      </div>

    </div>
  );
}

export default ProductCard;