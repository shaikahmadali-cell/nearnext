import React, { useState, useEffect, useRef } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ isLoading = true, onFinish }) => {
  const [mounted, setMounted] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Check reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (videoRef.current) {
      if (prefersReducedMotion) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {
          // Autoplay fallback (browser policy)
        });
      }
    }
  }, []);

  useEffect(() => {
    if (!isLoading && mounted) {
      // Trigger smooth fade-out
      setIsFading(true);

      const timer = setTimeout(() => {
        setMounted(false);
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
        if (onFinish) onFinish();
      }, 400); // 400ms matching CSS transition

      return () => clearTimeout(timer);
    }
  }, [isLoading, mounted, onFinish]);

  if (!mounted) return null;

  return (
    <div
      className={`loading-screen ${isFading ? 'hidden' : ''}`}
      role="status"
      aria-label="Loading NearNest"
      aria-busy={!isFading}
    >
      <div className="loading-screen-content">
        {!videoError ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            loop
            className="loading-video"
            onError={() => setVideoError(true)}
            disablePictureInPicture
            disableRemotePlayback
          >
            <source src="/assets/nearnest-loader.mp4" type="video/mp4" />
          </video>
        ) : (
          <div className="loading-fallback-spinner" aria-hidden="true" />
        )}

        <div className="loading-brand">
          <div className="loading-logo-text">
            Near<span style={{ color: '#0ea5e9' }}>Nest</span>
          </div>
          <div className="loading-tagline">Discover & Save</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
