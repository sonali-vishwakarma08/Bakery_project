import React from 'react'
import Header from '../Components/Header'
import Footer from '../Components/Footer'

function Profile() {
  return (
    <div>
        <Header/>
            <div className="min-h-screen flex items-center justify-center bg-[#fdf1f0]">
                <h1 className="text-3xl font-bold text-[#D9077A]">Welcome to your Profile</h1>
            </div>
        <Footer/>
    </div>
  )
}
export default Profile
