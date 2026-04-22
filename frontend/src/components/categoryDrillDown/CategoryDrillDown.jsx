import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";

const CategoryDrillDown = ({ onClose }) => {
  const { categories, navigate } = useAppContext();
  const [currentLevel, setCurrentLevel] = useState("parents"); // 'parents' or 'children'
  const [selectedParent, setSelectedParent] = useState(null);

  // Filter data
  const parents = categories?.filter((cat) => cat.parentId === null) || [];
  const children = categories?.filter((cat) => cat.parentId === selectedParent?.id) || [];

  const handleParentClick = (parent) => {
    setSelectedParent(parent);
    setCurrentLevel("children");
  };

  const goBack = () => {
    setCurrentLevel("parents");
    setSelectedParent(null);
  };

  return (
    <div className="w-full bg-white overflow-hidden relative min-h-[400px]">
      {/* --- LEVEL 1: PARENT CATEGORIES --- */}
      <div
        className={`w-full transition-all duration-500 ease-in-out transform ${
          currentLevel === "parents" 
          ? "translate-x-0 opacity-100" 
          : "-translate-x-full opacity-0 absolute"
        }`}
      >
        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
          Toutes les Catégories
        </h3>
        <div className="space-y-2">
          {parents.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleParentClick(cat)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-indigo-50 transition-all"
            >
              <span className="font-bold text-gray-800 group-hover:text-indigo-600">
                {cat.text}
              </span>
              <i className="bi bi-chevron-right text-gray-400 group-hover:translate-x-1 transition-transform"></i>
            </button>
          ))}
        </div>
      </div>

      {/* --- LEVEL 2: CHILDREN / SUB-CATEGORIES --- */}
      <div
        className={`w-full transition-all duration-500 ease-in-out transform ${
          currentLevel === "children" 
          ? "translate-x-0 opacity-100" 
          : "translate-x-full opacity-0 absolute top-0"
        }`}
      >
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest mb-6 hover:gap-3 transition-all"
        >
          <i className="bi bi-arrow-left"></i> Retour
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-black text-gray-900 leading-tight">
            {selectedParent?.text}
          </h2>
          <button
            onClick={() => {
              navigate(`/products/${selectedParent?.path}`);
              if (onClose) onClose();
            }}
            className="text-xs font-medium text-gray-400 underline decoration-indigo-200 hover:text-indigo-600"
          >
            Voir tout dans {selectedParent?.text}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {children.map((child) => (
            <div
              key={child.id}
              onClick={() => {
                navigate(`/products/${selectedParent.path}/${child.path}`);
                if (onClose) onClose();
              }}
              className="flex items-center gap-4 p-3 border border-gray-100 rounded-2xl cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all active:scale-95 bg-white"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
                <img
                  src={child.image || "/logo.jpeg"}
                  alt={child.text}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-gray-800">{child.text}</p>
                <p className="text-[10px] text-gray-400 uppercase font-medium">Découvrir</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryDrillDown;