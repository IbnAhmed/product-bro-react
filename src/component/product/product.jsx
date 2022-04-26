import React from "react";
import { Link } from "react-router-dom";
const Product = ({ product, className, imageHeight, descriptionStyle, deleteProduct }) => {
  const token = localStorage.getItem('token');
  // const auth_user = JSON.parse(localStorage.getItem('auth_user'));
  
  function handleDelete(){
    deleteProduct(product.id)
  }
  let content = "";
    content = (
        <div>
        <div className="flex mb-2 justify-between relative">
            <img src={product.image_url} alt="product" className={`${imageHeight} bg-gray-200 object-contain w-full`}/>

            <span className={`absolute left-2 top-2 shadow-sm rounded bg-blue-300 text-white px-1 text-sm font-bold`}>৳ {product.price}</span>
            
            {( () => {
                if(token){
                    return <span className={`absolute right-2 bottom-2`}>
                        <Link to={`/products/${product.id}/edit`} className={`shadow-sm rounded bg-yellow-500 text-white px-1 text-sm mr-2`}>Edit</Link>
                        <button className={`shadow-sm rounded bg-red-500 text-white px-1 text-sm`} onClick={handleDelete}>Delete</button>
                    </span>
                }
            })()}

        </div>
        <div className="flex justify-between w-100">
            <Link
                to={`/products/${product.id}`} className="block w-full truncate text-center hover:text-blue-500 font-bold"
            >
                {product.title}
            </Link>
        </div>
        <div className={`border-t mt-2 pt-2 overflow-hidden ${descriptionStyle} text-gray-600`}>
            {product.description}
        </div>
        </div>
    );
  return (
    <div className={`p-3 ${className} shadow-md hover:bg-gray-50 rounded-md border-t border-gray-50`}>
      {content}
    </div>
  );
};

export default Product;
