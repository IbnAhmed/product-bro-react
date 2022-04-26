import React, { useState, useEffect } from 'react';
import { useParams} from "react-router-dom";
import ProductForm from '../../component/product-form/product-form';

const EditProduct = () => {
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

    let content = "";
    if(isLoading){
        content = (<h2 className="text-center my-3 text-green-600">Loading ...</h2>);
    } else {
        if(product.id){
            content = (<ProductForm status={`edit`} product={product}/>)
        } else {
            content = (<h2 className="text-center my-3 text-red-600">Product Not Found</h2>);
        }
    }
    return <div>{content}</div>;
}
 
export default EditProduct;