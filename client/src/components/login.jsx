import React from 'react';
import { useState } from 'react';

function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password:''
    });
    


    const handleChange = ({ target }) => {
        setFormData({ ...formData, [target.name]: target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault;
        fetch('localhost:8080',{
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
    }

    return (
        <form method='post' onSubmit={handleSubmit}>
            <div className='inputDiv'>
                <label htmlFor="username">Username:
                    <input type="text"
                        onChange={handleChange}
                        value={formData.username}
                        name='username' />
                </label>
            </div>
            <div className='inputDiv'>
                <label htmlFor="username">Password:
                    <input type="password"
                        onChange={handleChange}
                        value={formData.password}
                        name='password'
                    />
                </label>
            </div>
            <div className='inputDiv'>
                <button type='submit'>Login</button>
            </div>
        </form>
    );
}

export default Login;