import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useHistory } from "react-router-dom";
const ProductForm = ({status="create", product}) => {

    const history = useHistory();
    const token = localStorage.getItem('token');
    // const auth_user = JSON.parse(localStorage.getItem('auth_user'));

    const [error, setError]= useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image_url, setImage_url] = useState('');
    const [image, setImage] = useState('');

    let formGroupStyle = "mb-4 flex flex-col";
    let labelStyle = "mb-2";
    let inputStyle = "border rounded p-2";


    useEffect(() => {
        checkAuth()
        if(status==='edit' && product){
            setTitle(product.title)
            setDescription(product.description)
            setPrice(product.price)
            setImage_url(product.image_url)
        }
    },[])
    function checkAuth(){
        if(!token){
            history.push("/sign-in")
        }
    }

    const imageOnChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            setImage(img)
            setImage_url(URL.createObjectURL(img))
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let responseStatus = '';
        
        let formData =  new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        if(image!==''){
            formData.append('image', image, image.name);
        }
        let url = `${process.env.REACT_APP_API_ENDPOINT}/products`;
        if(status === 'edit'){
            url = `${process.env.REACT_APP_API_ENDPOINT}/products/${product.id}`;
        }

        fetch(url,{
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
            },
            body: formData
        })
        .then((response) => {
          responseStatus = response.status;
          return response.json()
        })
        .then((data) => {
            if(responseStatus === 422){
                errorDataManage(data)
            } else if(responseStatus === 401){
                toast.error('User not authorized!');
                setTimeout(function(){
                    localStorage.removeItem('token');
                    localStorage.removeItem('auth_user');
                    window.location = '/sign-in';
                }, 1000)
            } else if(responseStatus === 200 || responseStatus === 201){
                setError('');
                toast.success('Succesfully form submitted!')
                if(status === 'edit'){
                    history.push(`/products/${product.id}`);
                } else {
                    history.push('/');
                }
            }
            
        }).catch(e => {
            errorDataManage(e)
        });
    }

    function errorDataManage(data){
        let errs = Object.keys(data);
        let errHtml = '';
        errs.forEach( err => {
            if(typeof data[err] === 'array'){
                errHtml += `<li>[${err}] : ${data[err][0]} </li>`;
            } else if (typeof data[err] === 'string'){
                errHtml += `<li>[${err}] : ${data[err]} </li>`;
            } else if (typeof data[err] === 'object'){
                let nest_errors = Object.keys(data[err]);
                let new_err_html = "";
                nest_errors.forEach(n_err => {
                    new_err_html += `<li>[${n_err}] : ${data[err][n_err]} </li>`;
                })
                errHtml += `<li>[${err}] : <ul class="ml-10">${new_err_html}</ul></li>`;
                
            }
        });
        if(errHtml !== ''){
            setError(`<ul>${errHtml}</ul>`);
        }
    }

    return ( <div className="p-6">
        <h2 className="text-2xl font-black mb-3 pb-2 border-b border-dashed text-center"><span className={`capitalize`}>{status}</span> Product</h2>
        {(() => {
            if(error !== ''){
                return <div className={`bg-red-100 text-red-600 p-4 my-4 w-2/4 mx-auto`}  dangerouslySetInnerHTML={{ __html: error}}></div>
            }
        })()}
        <form className={`lg:w-2/4 mx-auto`} onSubmit={handleSubmit}>
            <div className={formGroupStyle}>
                <label className={labelStyle} htmlFor="title">Title</label>
                <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Awesome Product" className={inputStyle} required/>
            </div>

            <div className={formGroupStyle}>
                <label className={labelStyle} htmlFor="description">Description</label>
                <textarea id="description" 
                          value={description} 
                          onChange={e => setDescription(e.target.value)} 
                          placeholder="e.g. This product is ..." 
                          className={inputStyle} rows="3"></textarea>
            </div>

            <div className={formGroupStyle}>
                <label className={labelStyle} htmlFor="price">Price</label>
                <input type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. 439" className={inputStyle} required/>
            </div>

            <div className={formGroupStyle}>
                <label className={labelStyle} htmlFor="image">Image</label>
                <input type="file" id="image" onChange={imageOnChange} className={inputStyle} accept={`image/*`}/>
                
                {
                    (()=> {
                        if(typeof image_url == "string" && image_url !== ''){
                            return <img alt="product" src={image_url} className={`w-32 mt-2`}/>
                        }
                    })()
                }
                
            </div>

            <button type="submit" className="rounded bg-blue-400 hover:bg-blue-600 text-white text-center py-2 w-full">Submit</button>
        </form>
    </div> );
};

export default ProductForm;
