import React, { useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import ProductCard from "../../components/productCard/ProductCard";

const TreeProductList = () => {
  const { products = [], categories = [] } = useAppContext();
  const { parent, child } = useParams();
  const navigate = useNavigate();

  const redirectedRef = useRef(false);

  // =========================
  // 🔥 GET PARENT CATEGORY
  // =========================
  const parentCategory = useMemo(() => {
    if (!parent || categories.length === 0) return null;

    return categories.find((cat) => {
      const slug = (cat.path || cat.text || "")
        .toLowerCase()
        .trim();

      return slug === parent.toLowerCase().trim();
    });
  }, [categories, parent]);

  // =========================
  // 🔥 AUTO REDIRECT FIRST CHILD
  // =========================
  useEffect(() => {
    if (!parentCategory || child) return;

    const children = categories.filter(
      (c) => String(c.parentId) === String(parentCategory.id)
    );

    if (children.length > 0 && !redirectedRef.current) {
      redirectedRef.current = true;

      navigate(
        `/products/${parentCategory.path}/${children[0].path}`,
        { replace: true }
      );
    }
  }, [parentCategory, child, categories, navigate]);

  // =========================
  // 🔥 FILTER PRODUCTS BY CHILD CATEGORY
  // =========================
  const filteredProducts = useMemo(() => {
    if (!child || !categories.length) return [];

    const currentCategory = categories.find(
      (c) =>
        (c.path || "")
          .toLowerCase()
          .trim() === child.toLowerCase().trim()
    );

    if (!currentCategory) return [];

    return products.filter(
      (p) =>
        String(p.productCategoryId) === String(currentCategory.id)
    );
  }, [products, child, categories]);

  // =========================
  // 🔥 TITLE
  // =========================
  const title = child
    ? `${parent} / ${child}`
    : parent;

  return (
    <div className="mt-16 px-4 min-h-[60vh]">
      <h2 className="text-2xl text-center mb-6 uppercase tracking-wide">
        {title}
      </h2>

      {filteredProducts.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-4">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id || p._id} product={p} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No products found
        </p>
      )}
    </div>
  );
};

export default TreeProductList;