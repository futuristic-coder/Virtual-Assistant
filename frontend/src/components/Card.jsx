import React, { useContext } from 'react'
import { userDataContext } from '../context/userContext';

const Card = ({image}) => {
  const {
      selectedImage,
      setSelectedImage
    } = useContext(userDataContext);
  
  const isSelected = selectedImage === image;
  
  return (
    <div 
      className='group w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 relative cursor-pointer transform transition-all duration-500 hover:scale-105'
      onClick={() => setSelectedImage(image)}
    >
      {/* Outer glow effect */}
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 blur-xl transition-opacity duration-300 ${
        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-70'
      }`}></div>
      
      {/* Card container */}
      <div className={`relative w-full h-full bg-gradient-to-br from-cyan-950/20 to-purple-950/20 backdrop-blur-sm border-2 rounded-xl overflow-hidden transition-all duration-500 ${
        isSelected 
          ? 'border-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.6)]' 
          : 'border-cyan-500/30 group-hover:border-cyan-400/80 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]'
      }`}>
        {/* Image */}
        <img 
          src={image} 
          alt="card" 
          className='w-full h-full object-cover transition-all duration-500 group-hover:scale-110'
        />
        
        {/* Overlay gradient */}
        <div className={`absolute inset-0 bg-gradient-to-t from-cyan-900/40 via-transparent to-purple-900/20 transition-opacity duration-300 ${
          isSelected ? 'opacity-60' : 'opacity-0 group-hover:opacity-40'
        }`}></div>
        
        {/* Corner accent lines */}
        <div className={`absolute top-0 left-0 w-8 h-8 sm:w-12 sm:h-12 border-t-2 sm:border-t-4 border-l-2 sm:border-l-4 border-cyan-400 transition-all duration-300 ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}></div>
        <div className={`absolute top-0 right-0 w-8 h-8 sm:w-12 sm:h-12 border-t-2 sm:border-t-4 border-r-2 sm:border-r-4 border-cyan-400 transition-all duration-300 ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}></div>
        <div className={`absolute bottom-0 left-0 w-8 h-8 sm:w-12 sm:h-12 border-b-2 sm:border-b-4 border-l-2 sm:border-l-4 border-cyan-400 transition-all duration-300 ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}></div>
        <div className={`absolute bottom-0 right-0 w-8 h-8 sm:w-12 sm:h-12 border-b-2 sm:border-b-4 border-r-2 sm:border-r-4 border-cyan-400 transition-all duration-300 ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}></div>
        
        {/* Selected indicator */}
        {isSelected && (
          <div className="absolute inset-0 border-2 sm:border-4 border-cyan-400 rounded-xl animate-pulse-border">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-cyan-400/90 text-black px-3 sm:px-6 py-1 sm:py-2 rounded-full font-bold uppercase text-[10px] sm:text-sm tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.8)]">
              Selected
            </div>
          </div>
        )}
        
        {/* Scan line effect on hover */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan-line-fast"></div>
        </div>
      </div>
    </div>
  )
}

export default Card
