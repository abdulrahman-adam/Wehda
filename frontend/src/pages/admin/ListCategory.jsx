import React from 'react'
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const ListCategory = () => {
    // Getting the categiries, and deleteCategory and fetchCategories axios function from useAppContext
    const { categories, deleteCategory } = useAppContext();

    // ===============================
    // ✅ ADDED: GET PARENT NAME
    // ===============================
    const getParentName = (parentId) => {
      if (!parentId) return "Main Category";

      const parent = categories.find((cat) => cat.id === parentId);
      return parent ? parent.text : "Unknown";
    };

  return (
          
   <div className="flex-1 py-10 flex flex-col justify-between">
  <div className="w-full p-4 md:p-10">
     <h4 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-blue-500 pl-4">
          All Categories Dashboard
        </h4>

          
    <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-300">
      {/* Category List - Table */}
      <table className="table-auto w-full">
        <thead className="text-gray-900 text-sm text-left bg-gray-50">
          <tr>
            <th className="px-2 py-2 md:px-4 md:py-3 font-semibold truncate">Image</th>
            <th className="px-2 py-2 md:px-4 md:py-3 font-semibold truncate">Name</th>
            <th className="px-2 py-2 md:px-4 md:py-3 font-semibold truncate">
              Path
            </th>
            <th className="px-2 py-2 md:px-4 md:py-3 font-semibold truncate">Color</th>

            {/* ========================= */}
            {/* ✅ ADDED: PARENT COLUMN */}
            {/* ========================= */}
            <th className="px-2 py-2 md:px-4 md:py-3 font-semibold truncate">
              Parent
            </th>

            <th className="px-2 py-2 md:px-4 md:py-3 font-semibold truncate">Action</th>
          </tr>
        </thead>

        <tbody className="text-sm text-gray-600">
          {categories.map((category) => (
            <tr key={category.id} className="border-t border-gray-200 hover:bg-gray-50">
              
              {/* Image */}
              <td className="px-2 py-2 md:px-4 md:py-3 flex items-center space-x-2 md:space-x-3 truncate">
                <div className="border border-gray-200 rounded overflow-hidden w-12 h-12 md:w-16 md:h-16">
                  <img
                    src={category.image}
                    alt={category.text}
                    className="w-full h-full object-cover"
                  />
                </div>
              </td>

              {/* Name */}
              <td className="px-2 py-2 md:px-4 md:py-3 truncate">{category.text}</td>

              {/* Path */}
              <td className="px-2 py-2 md:px-4 md:py-3 truncate">{category.path}</td>

              {/* Color */}
              <td className="px-2 py-2 md:px-4 md:py-3 truncate">{category.bgColor}</td>

              {/* ========================= */}
              {/* ✅ ADDED: PARENT VALUE */}
              {/* ========================= */}
              <td className="px-2 py-2 md:px-4 md:py-3 truncate">
                {getParentName(category.parentId)}
              </td>

              {/* Actions */}
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => deleteCategory(category.id)}
                  className="p-2 rounded hover:bg-red-100"
                  title="Delete Category"
                >
                  <img
                    src={assets.remove_icon}
                    alt="Remove category"
                    className="w-6 h-6 sm:w-7 sm:h-7"
                  />
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

  )
}

export default ListCategory