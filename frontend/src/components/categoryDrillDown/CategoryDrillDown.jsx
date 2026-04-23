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
 <div className="w-full bg-white overflow-hidden relative">
  
  {/* --- LEVEL 1: PARENT CATEGORIES (SLIDES LEFT ON EXIT) --- */}
  <div
    className={`w-full transition-all duration-500 ease-in-out transform ${
      currentLevel === "parents" 
      ? "translate-x-0 opacity-100" 
      : "-translate-x-full opacity-0 absolute pointer-events-none"
    }`}
  >
    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 text-center mt-8">
      Explorer les Collections
    </h3>
    
    {/* Horizontal Scroll Row */}
    <div className="flex overflow-x-auto pb-8 px-6 gap-6 scrollbar-hide snap-x mx-auto justify-start sm:justify-center">
      {parents.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleParentClick(cat)}
          className="flex flex-col items-center group space-y-3 outline-none flex-shrink-0 snap-center"
        >
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-50 flex items-center justify-center border-2 border-indigo-50 group-hover:border-indigo-600 transition-all duration-300 overflow-hidden shadow-sm">
             <img 
              src={cat.image || "/logo.jpeg"} 
              alt={cat.text}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-bold text-[11px] uppercase tracking-tight text-gray-700 group-hover:text-indigo-600 transition-colors text-center w-20 line-clamp-1">
            {cat.text}
          </span>
        </button>
      ))}
    </div>
    <div className="h-[1px] bg-gray-100 w-full mb-4"></div>
  </div>

  {/* --- LEVEL 2: SUB-CATEGORIES (SLIDES IN FROM RIGHT) --- */}
  <div
    className={`w-full px-6 transition-all duration-500 ease-in-out transform ${
      currentLevel === "children" 
      ? "translate-x-0 opacity-100" 
      : "translate-x-full opacity-0 absolute top-0 pointer-events-none"
    }`}
  >
    <div className="flex items-center justify-between mt-6 mb-8">
      <button
        onClick={goBack}
        className="flex items-center gap-1 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-indigo-600 transition-all"
      >
        <i className="bi bi-chevron-left text-sm"></i> Retour
      </button>

      <h2 className="text-lg font-black text-gray-900 italic tracking-tighter uppercase">
        {selectedParent?.text}
      </h2>
    </div>

    {/* Single Column List */}
    <div className="flex flex-col gap-3 pb-12">
      {children.map((child) => (
        <div
          key={child.id}
          onClick={() => {
            navigate(`/products/${selectedParent.path}/${child.path}`);
            if (onClose) onClose();
          }}
          className="flex items-center gap-4 p-3 bg-gray-50 rounded-[20px] cursor-pointer hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all active:scale-[0.98]"
        >
          <div className="w-14 h-14 rounded-full bg-white border border-gray-100 shadow-sm overflow-hidden flex-shrink-0">
            <img
              src={child.image || "/logo.jpeg"}
              alt={child.text}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <p className="font-black text-gray-800 text-sm">{child.text}</p>
            <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">Voir la collection</p>
          </div>
          
          <i className="bi bi-chevron-right text-gray-300 pr-2"></i>
        </div>
      ))}
      
      <button
        onClick={() => {
            navigate(`/products/${selectedParent?.path}`);
            if (onClose) onClose();
        }}
        className="mt-4 w-full py-4 border-2 border-dashed border-gray-100 rounded-[20px] text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:bg-gray-50 hover:text-indigo-600 transition-all"
      >
        Tout afficher dans {selectedParent?.text}
      </button>
    </div>
  </div>
</div>
  );
};

export default CategoryDrillDown;