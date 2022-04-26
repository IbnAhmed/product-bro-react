import React, { useState, useEffect } from "react";
import { useParams, useHistory} from "react-router-dom";
import Product from '../../component/product/product';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const token = localStorage.getItem('token');
  // const auth_user = JSON.parse(localStorage.getItem('auth_user'));
  const history = useHistory();

  let { id } = useParams();

  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  function getProduct(){
    setIsLoading(true)
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/products/${id}`,{
    })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      if(data.data){
        setProduct(data.data)
      }
    }).catch(e => {
      
    }).finally(() => {
        setIsLoading(false)
    });
  }
  useEffect(() => {
    getProduct()
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
          history.push('/');
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
  
  let content = "";
  if(isLoading){
        content = (<h2 className="text-center my-3 text-green-600">Loading ...</h2>);
  } else {
    if(product.id){
      content = (<Product deleteProduct={deleteProduct} product={product} className={`lg:w-2/3 mx-auto block mb-3`} imageHeight={`h-64`} descriptionStyle={`h-auto whitespace-pre-wrap`}/>)
    } else {
      content = (<h2 className="text-center my-3 text-red-600">Not Found</h2>);
    }
  }

  return <div className={`p-6`}>
        <h2 className="text-2xl font-black mb-3 pb-2 border-b border-dashed text-center">Product Detail</h2>
        {content}
    </div>;
};

export default ProductDetail;
