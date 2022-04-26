import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

const SignIn = () => {
    
    const history = useHistory();
    useEffect(() => {
        checkAuth()
    },[])
    function checkAuth(){
        const token = localStorage.getItem('token');
        if(token){
            history.push("/")
        }
    }

    let formGroupStyle = "mb-4 flex flex-col";
    let labelStyle = "mb-2";
    let inputStyle = "border rounded p-2";

    const [error, setError]= useState('');
    const [email, setEmail]= useState('');
    const [password, setPassword]= useState('')

    const handleSubmit = (event) => {
        event.preventDefault();
        let responseStatus = '';
        
        let formData =  new FormData();
        formData.append('email', email);
        formData.append('password', password);

        fetch(`${process.env.REACT_APP_API_ENDPOINT}/auth/login`,{
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
            'Accept': 'application/json'
            },
            body: formData
        })
        .then((response) => {
          responseStatus = response.status;
          return response.json()
        })
        .then((data) => {
            if(responseStatus === 422 || responseStatus === 401){
                errorDataManage(data)
            } else if(responseStatus === 200){
                setError('');
                localStorage.setItem('token', data.access_token)
                localStorage.setItem('auth_user', JSON.stringify(data.user))
                window.location = '/';
            }
            
        }).catch(e => {
            errorDataManage(e)
        });
    }

    function errorDataManage(data){
        let errs = Object.keys(data);
        let errHtml = '';
        errs.forEach( err => {
            errHtml += `<li>[${err}] : ${typeof data[err] === 'array'?data[err][0]:data[err]} </li>`;
        });
        setError(errHtml);
    }
    
    return ( <div className="p-6">
        <h2 className="text-2xl font-black mb-3 pb-2 border-b border-dashed text-center">Sign In</h2>
        {(() => {
            if(error !== ''){
                return <div className={`bg-red-100 text-red-600 p-4 my-4 w-2/4 mx-auto`}  dangerouslySetInnerHTML={{ __html: error}}></div>
            }
          })()}
        <form className={`w-2/4 mx-auto`} onSubmit={handleSubmit}>
            <div className={formGroupStyle}>
                <label className={labelStyle} htmlFor="email">Email Address</label>
                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="e.g. test@gmail.com" className={inputStyle} required/>
            </div>

            <div className={formGroupStyle}>
                <label className={labelStyle} htmlFor="password">Password</label>
                <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="e.g. pa#@!" className={inputStyle} required/>
            </div>

            <button type="submit" className="rounded bg-blue-400 hover:bg-blue-600 text-white text-center py-2 w-full">Sign In</button>
        </form>
    </div> );
}
 
export default SignIn;