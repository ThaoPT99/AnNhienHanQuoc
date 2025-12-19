import React, { useState } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  width, 
  height,
  loading = 'lazy',
  ...props 
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // Fallback image
  const fallbackImage = 'https://via.placeholder.com/800x600?text=Image+Not+Available';

  if (imageError) {
    return (
      <div 
        className={`optimized-image-error ${className}`}
        style={{ 
          width: width || '100%', 
          height: height || 'auto',
          background: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: '0.9rem'
        }}
        {...props}
      >
        {alt || 'Image not available'}
      </div>
    );
  }

  return (
    <div className={`optimized-image-wrapper ${className}`} style={{ position: 'relative' }}>
      {isLoading && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1
          }}
        >
          <div 
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid #e0e0e0',
              borderTopColor: '#667eea',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }}
          />
        </div>
      )}
      <img
        src={src || fallbackImage}
        alt={alt || ''}
        className={className}
        width={width}
        height={height}
        loading={loading}
        onError={handleError}
        onLoad={handleLoad}
        style={{
          width: width || '100%',
          height: height || 'auto',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease',
          objectFit: 'cover'
        }}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;


