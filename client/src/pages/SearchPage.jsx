import { Search } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchAllProducts,
  fetchSearchProducts,
} from "../features/product/productAPI";
import ProductCard from "../components/ProductCard";
import FilteredSection from "../components/FilteredSection";

const SearchPage = () => {
  const { register, handleSubmit, setValue } = useForm();

  const { searchProductsData, productsData } = useSelector(
    (state) => state.product,
  );
  console.log(searchProductsData?.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // URL params
  const params = new URLSearchParams(location.search);

  const query = params.get("query") || "";
  const page = Number(params.get("page")) || 1;
  const category = params.get("category");
  const subCategory = params.get("subCategory");
  const brand = params.get("brand");
  const tags = params.get("tags");

  const isSearch = query || category || subCategory || brand || tags;

  const productsToShow = isSearch
    ? searchProductsData?.products
    : productsData?.products;

  const metaToUse = isSearch ? searchProductsData?.meta : productsData?.meta;

  const {
    totalPages = 0,
    currentPage = 1,
    hasPrevPage = false,
    hasNextPage = false,
    prevPage = null,
    nextPage = null,
  } = metaToUse || {};

  useEffect(() => {
    setValue("query", query);
  }, [query, setValue]);

  // Fetch data on URL change
  useEffect(() => {
    if (isSearch) {
      dispatch(
        fetchSearchProducts({
          query,
          category,
          subCategory,
          brand,
          tags,
          page,
          limit: 9,
        }),
      );
    } else {
      dispatch(fetchAllProducts({ page, limit: 12 }));
    }
  }, [query, page, category, subCategory, brand, tags]);

  const submitForm = (data) => {
    const q = data.query.trim();

    if (q) {
      dispatch(
        fetchSearchProducts({
          query: q,
          page: 1,
          limit: 9,
        }),
      );

      navigate(`/product/search?query=${encodeURIComponent(q)}&page=1`);
    } else {
      navigate(`/product/search`);
    }
  };

  // Pagination
  const changePage = (newPage) => {
    const params = new URLSearchParams(location.search);

    params.set("page", newPage);
    params.set("t", Date.now());

    navigate(`/product/search?${params.toString()}`);
  };

  return (
    <div className="p-3">
      {/* Search bar */}
      <div className="h-[30vh] flex justify-center items-end p-5">
        <form className="border-b-2" onSubmit={handleSubmit(submitForm)}>
          <input
            type="search"
            placeholder="What are you looking for?"
            className="outline-none w-100 py-2 px-2"
            {...register("query")}
          />
          <button type="submit" className="cursor-pointer">
            <Search size={20} />
          </button>
        </form>
      </div>

      {/* Products */}
      {/* Products & Sidebar */}
      <div className="grid grid-cols-4 gap-3">
        {/* Sidebar only for search and if there are products */}
        {isSearch && productsToShow?.length > 0 && (
          <div className="col-span-1">
            <FilteredSection />
          </div>
        )}

        {/* Products Grid */}
        <div
          className={`${
            isSearch && productsToShow?.length > 0
              ? "col-span-3"
              : "col-span-full"
          } grid gap-3 grid-cols-3 items-start`}
        >
          {productsToShow?.length > 0 ? (
            productsToShow.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-full flex flex-col justify-center items-center gap-3 h-[50vh]">
              <p className="text-gray-500 text-2xl">No products found.</p>
              <button
                onClick={() => navigate("/")}
                className="bg-black text-white rounded-full px-4 py-2 text-sm cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Pagination: show only if products exist and totalPages > 1 */}
      {productsToShow?.length > 0 && totalPages > 1 && (
        <div className="flex justify-center mt-10">
          <ul className="flex items-center gap-2">
            {/* Prev */}
            <li>
              <button
                disabled={!hasPrevPage}
                onClick={() => changePage(prevPage)}
                className={`px-4 py-2 rounded-md text-white ${
                  hasPrevPage
                    ? "bg-black hover:opacity-70"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Prev
              </button>
            </li>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => {
              const p = i + 1;
              return (
                <li key={p}>
                  <button
                    onClick={() => changePage(p)}
                    className={`cursor-pointer px-4 py-2 rounded-md ${
                      currentPage === p
                        ? "bg-black text-white"
                        : "bg-[#E0DACF] hover:opacity-60"
                    }`}
                  >
                    {p}
                  </button>
                </li>
              );
            })}

            {/* Next */}
            <li>
              <button
                disabled={!hasNextPage}
                onClick={() => changePage(nextPage)}
                className={`px-4 py-2 rounded-md text-white ${
                  hasNextPage
                    ? "bg-black hover:opacity-70"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Next
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
