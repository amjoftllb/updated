import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate()
  
    const login = useGoogleLogin({
        onSuccess: async respose => {
            try {
                const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: {
                        "Authorization": `Bearer ${respose.access_token}`
                    }
                })
                if(res.status === 200){
                    navigate("/")
                }
            } catch (err) {
                console.log(err)

            }

        }
        // onFailure: err => console.log('Login failed', err),
        // redirectUri: 'http://localhost:5173' 
    });
    return (
        <div className='min-h-full w-screen flex items-center flex-col text-center px-1 sm:px-0'>
            <div className='mt-[32px]'>
                <img src='/Group 3.svg' alt="Group 3" />
            </div>
            <div className='mt-[119px]'>
                <h3 className='text-[#333333] text-[24px] font-bold'>
                    Welcome! How do you want to get started?
                </h3>
            </div>

            <div className='mt-[38px]'>
                <button
                    className='flex items-center gap-[15px] p-2 sm:w-[354px] h-[54px] text-[#757575] font-[600] justify-center rounded-[10px] shadow-[0px_2px_3px_rgb(0_0_0_/_16.18%)]'
                    onClick={() => login()}
                >
                    <img src='/Google Logo.svg' alt="Google Logo" />
                    Continue with Google
                </button>
            </div>

            <div className='my-[32px] flex gap-[13px]'>
                <img src='/Line 1.svg' className='w-[155px]' alt="Line" />
                <h4 className='text-[#b3a2a2] text-shadow text-[18px]'>or</h4>
                <img src='/Line 1.svg' className='w-[155px]' alt="Line" />
            </div>

            <h4 className='text-[#333333] text-[18px] font-[400]'>
                Sign up with your Email instead
            </h4>

            <input
                className='mt-[18px] border-[1px] border-[#BEAEE2] sm:w-[390px] h-[43px] text-[#333333] rounded-[10px] p-[0px_12px] focus:outline-none'
                placeholder='Enter Email Address'
            />

            <button className='mt-[19px] min-w-[140px] h-[45px] bg-[#BEAEE2] text-white rounded-[5px] text-[16px] font-bold'>
                Continue
            </button>
        </div>
    );
}

export default Login;
