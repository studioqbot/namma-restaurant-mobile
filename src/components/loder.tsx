import React from 'react';
import Image from 'next/image';



const Loader = () => {

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-28 h-28 bg-white rounded-full p-5">
                <Image src={require('../../public/assets/images/slow-cooker-loader.gif')} alt="Loading..." />
            </div>
        </div>

    );

};

export default Loader;