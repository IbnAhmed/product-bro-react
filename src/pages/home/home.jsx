import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { toast } from 'react-toastify';
import Product from '../../component/product/product';
const Home = () => {
  const token = localStorage.getItem('token');
  // const auth_user = JSON.parse(localStorage.getItem('auth_user'));

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  function getProducts(page=1,per_page='all'){
    setIsLoading(true)
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/products?page=${page}&per_page=${per_page}`)
    .then((response) => response.json())
    .then((data) => {
      setProducts(data.data)
    }).catch(e => {
      
    }).finally(() => {
        setIsLoading(false)
    });
  }

  useEffect(() => {
    getProducts()
  }, []);

  function deleteProduct(product_id){
    if(window.confirm('Are you sure to delete?')){
      let responseStatus = '';
      fetch(`${process.env.REACT_APP_API_ENDPOINT}/products/${product_id}`,{
          method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
          headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
          }
      })
      .then((response) => {
        responseStatus = response.status;

        if(responseStatus === 204){
          toast.success("Product deleted successfully!")
          let prods = products.filter(prod => prod.id !== product_id);
          setProducts(prods);
        } else if(responseStatus === 404){
          toast.error('Product not found!')
        } else if(responseStatus === 401){
          toast.error('User not authorized!');
          setTimeout(function(){
            localStorage.removeItem('token');
            localStorage.removeItem('auth_user');
            window.location = '/sign-in';
          }, 1000)
        }
      }).catch(e => {
        toast.error(e.message)
      });
    }
  }
  return (
    <Fragment>
      <div className="py-6">
        <div>
          <h2 className="text-2xl font-black mb-3 pb-2 border-b border-dashed text-center" >Products</h2>
          

          {(()=> {
              if(token){
                return <div className={`flex justify-end`}>
                        <Link to="/products/create" className={`px-2 py-1 mb-2 bg-green-500 hover:bg-green-700 text-white rounded text-sm`}>Create Product</Link>
                      </div>
              }
            })()}
          <div className="flex flex-wrap justify-center gap-3">
            {products.map((product) => {
              return <Product 
              deleteProduct={deleteProduct}
              product={product} 
              key={product.id} 
              className={`lg:w-1/5 md:w-1/3 sm:w-1/2`} 
              imageHeight={`h-32`} 
              descriptionStyle={`h-14 text-center text-xs`}/>;
            })}
            {(()=> {
              if(isLoading){
                  return (<h2 className="text-center my-3 text-green-600">Loading ...</h2>);
              } else {
                if(products.length === 0){
                  return <h3 className={`text-red-600 text-center`}>No Products available</h3>
                }
              }
            })()}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Home;
