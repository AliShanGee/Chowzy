import React, { useEffect, useRef, useState } from 'react';
import API_BASE_URL from '../config.js';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useUserStore from '../store/useUserStore';

const ReelVideo = ({ reel, userId, handleLike, handleSave }) => {
    const videoRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    
    const isYouTube = reel.videoUrl.includes('youtube.com') || reel.videoUrl.includes('youtu.be');
    
    let videoUrl = reel.videoUrl;
    if (!isYouTube && reel.videoUrl.startsWith('/')) {
        videoUrl = `${API_BASE_URL}${reel.videoUrl}`;
    }

    // Convert YouTube short/watch link to embed link
    let embedUrl = videoUrl;
    if (isYouTube) {
        if (videoUrl.includes('shorts/')) {
            embedUrl = videoUrl.replace('shorts/', 'embed/').split('?')[0];
        } else if (videoUrl.includes('watch?v=')) {
            embedUrl = videoUrl.replace('watch?v=', 'embed/').split('&')[0];
        }
        // Add parameters for autoplay and mute if needed
        embedUrl += (embedUrl.includes('?') ? '&' : '?') + 'autoplay=1&mute=1&loop=1&rel=0';
    }

    useEffect(() => {
        if (isYouTube) {
            setIsLoading(false); // Iframes handle their own loading
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        if (videoRef.current) {
                            videoRef.current.play().catch(e => console.log("Auto-play blocked"));
                        }
                    } else {
                        if (videoRef.current) {
                            videoRef.current.pause();
                            videoRef.current.currentTime = 0;
                        }
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, [isYouTube]);

    return (
        <div className="reel-item" style={{
            height: '100%',
            width: '100%',
            scrollSnapAlign: 'start',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000'
        }}>
            {isLoading && !isYouTube && (
                <div style={{ position: 'absolute', zIndex: 5 }}>
                    <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">Loading Video...</span>
                    </div>
                </div>
            )}
            
            {hasError && (
                <div style={{ position: 'absolute', zIndex: 5, textAlign: 'center', color: 'white' }}>
                    <p>Failed to load video</p>
                    <small>{videoUrl}</small>
                </div>
            )}

            {isYouTube ? (
                <iframe
                    src={embedUrl}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title={reel.title}
                    onLoad={() => setIsLoading(false)}
                />
            ) : (
                <video
                    ref={videoRef}
                    src={videoUrl}
                    style={{ height: '100%', maxWidth: '100%', objectFit: 'contain', opacity: isLoading ? 0 : 1 }}
                    controls
                    loop
                    muted
                    preload="auto"
                    playsInline
                    onLoadedData={() => setIsLoading(false)}
                    onError={() => {
                        setHasError(true);
                        setIsLoading(false);
                    }}
                />
            )}
            <div className="reel-overlay" style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
                color: '#fff',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                zIndex: 10
            }}>
                <button
                    type="button"
                    className="action-item"
                    style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        color: 'inherit',
                        textAlign: 'center',
                        cursor: 'pointer'
                    }}
                    onClick={() => handleLike(reel._id)}
                    aria-label={reel.likes && reel.likes.includes(userId) ? "Unlike reel" : "Like reel"}
                    aria-pressed={Boolean(reel.likes && reel.likes.includes(userId))}
                >
                    {reel.likes && reel.likes.includes(userId) ? 
                        <FaHeart size={30} color="red" /> : 
                        <FaRegHeart size={30} />
                    }
                    <div style={{ fontSize: '12px' }}>{reel.likes ? reel.likes.length : 0}</div>
                </button>
                <button
                    type="button"
                    className="action-item"
                    style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        color: 'inherit',
                        textAlign: 'center',
                        cursor: 'pointer'
                    }}
                    onClick={() => handleSave(reel._id)}
                    aria-label={reel.saves && reel.saves.includes(userId) ? "Unsave reel" : "Save reel"}
                    aria-pressed={Boolean(reel.saves && reel.saves.includes(userId))}
                >
                    {reel.saves && reel.saves.includes(userId) ? 
                        <FaBookmark size={25} color="#FFE13C" /> : 
                        <FaRegBookmark size={25} />
                    }
                    <div style={{ fontSize: '12px' }}>Save</div>
                </button>
            </div>
            <div className="reel-info" style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                color: '#fff',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                maxWidth: '70%',
                zIndex: 10
            }}>
                <h5 style={{ margin: 0 }}>{reel.title}</h5>
                <p style={{ fontSize: '14px', margin: '5px 0' }}>{reel.description}</p>
            </div>
        </div>
    );
};

const Reels = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const user = useUserStore(state => state.user);
    const userId = user?.id || user?._id;

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const { data: reelsData, isLoading, error, refetch } = useQuery({
        queryKey: ['reels'],
        queryFn: async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 20000); // Increased to 20s

            try {
                const response = await fetch(`${API_BASE_URL}/api/getreels`, {
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                if (!data.success) throw new Error(data.message);
                return data.reels;
            } catch (err) {
                clearTimeout(timeoutId);
                console.error("Fetch error detail:", err);
                if (err.name === 'AbortError') {
                    throw new Error('Request timed out. The server is taking too long to respond.');
                }
                throw new Error(err.message || 'Failed to connect to the server.');
            }
        },
        enabled: !!user,
        retry: 2,
        refetchOnMount: true
    });

    const likeMutation = useMutation({
        mutationFn: async (reelId) => {
            const response = await fetch(`${API_BASE_URL}/api/reels/${reelId}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reels'] });
        }
    });

    const saveMutation = useMutation({
        mutationFn: async (reelId) => {
            const response = await fetch(`${API_BASE_URL}/api/reels/${reelId}/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reels'] });
        }
    });

    const handleLike = (reelId) => {
        if (!userId) return;
        likeMutation.mutate(reelId);
    };

    const handleSave = (reelId) => {
        if (!userId) return;
        saveMutation.mutate(reelId);
    };

    if (isLoading) {
        return <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
            <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>;
    }

    if (error) {
        return (
            <div className="text-white text-center mt-5 p-4" style={{ backgroundColor: '#000', height: '80vh' }}>
                <h3 className="text-danger mb-4">Connection Issue</h3>
                <p>{error.message}</p>
                <button 
                    className="btn btn-success mt-3"
                    onClick={() => refetch()}
                >
                    Retry Connection
                </button>
                <div className="mt-4 small text-muted">
                    Make sure your backend is running at {API_BASE_URL}
                </div>
            </div>
        );
    }

    const reels = reelsData || [];

    return (
        <div className="reels-container" style={{
            height: 'calc(100vh - 80px)',
            overflowY: 'scroll',
            scrollSnapType: 'y mandatory',
            backgroundColor: '#000',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
        }}>
            <style>
                {`
                    .reels-container::-webkit-scrollbar {
                        display: none;
                    }
                `}
            </style>
            {reels.length === 0 ? (
                <div className="text-white d-flex justify-content-center align-items-center h-100">
                    <h3>No reels available. Check back later!</h3>
                </div>
            ) : (
                reels.map((reel) => (
                    <ReelVideo 
                        key={reel._id} 
                        reel={reel} 
                        userId={userId} 
                        handleLike={handleLike} 
                        handleSave={handleSave} 
                    />
                ))
            )}
        </div>
    );
};

export default Reels;
