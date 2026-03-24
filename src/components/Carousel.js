import React, { useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
// import Container from "react-bootstrap/Container";
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

const carouselItems = [
  {
    src: "https://media.assettype.com/gulfnews%2F2024-11-18%2Fd0nwdt8n%2FWLD_190630_Fast_food__Read_Only__16ba9680d4a_original_ratio.jpg?w=1200&auto=format%2Ccompress",
    alt: "First slide",
  },
  {
    src: "https://media.assettype.com/gulfnews%2F2024-11-18%2F1lcpy5my%2Fspaghetti_181921fe124_original_ratio.jpg?w=1200&auto=format%2Ccompress",
    alt: "Second slide",
  },
  {
    src: "https://media.assettype.com/gulfnews%2F2024-11-18%2F2iyyr7k5%2Fbiryani_17e19b796be_original_ratio.jpg?w=1200&auto=format%2Ccompress",
    alt: "Third slide",
  },
  {
    src:"https://images.unsplash.com/photo-1567529854970-ce2c4207e242?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt:"Fourth Slide"
  },
  {
    src:"https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt:"Fourth Slide"
  }
];

export default function HomeCarousel() {
  gsap.registerPlugin(TextPlugin);

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(".animated-text", {
      duration: 1,
      text: "Deliciously Fast, Always Fresh!",
      ease: "none",
    }).to(".animated-text", {
      duration: 1,
      text: "Your Cravings, Delivered.",
      ease: "none",
      delay: 0.5
    });
  }, []);

  return (
    <>
      <Carousel fade interval={2500} indicators={false}>
        {carouselItems.map((item, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100"
              src={item.src}
              alt={item.alt}
              style={{ objectFit: "cover", height: "550px" }}
            />
            <Carousel.Caption 
              className="d-none d-md-block" 
              style={{ 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)', 
                bottom: 'auto', 
                background: 'rgba(0, 0, 0, 0.5)', 
                borderRadius: '10px', 
                padding: '1rem' }}>
              <h1 style={{ background: 'linear-gradient(to right, #ff7e5f, #feb47b, #86a8e7, #7f7fd5)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                <span className="animated-text"></span>
              </h1>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </>
  );
}
