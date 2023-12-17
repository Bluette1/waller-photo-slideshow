import { useState, useRef, useEffect } from 'react';
import { ArrowBigLeft, ArrowBigRight } from 'lucide-react'
import './image-slider.css'

type image = {
  src: string;
  alt: string;
};


type imageSliderProps = {
  images: image[],
  city: string | null
};
export function ImageSlider({ images, city }: imageSliderProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const delay = 5500;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);


  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(showNextImage, delay);

    return () => {
      resetTimeout();
    };
  }, [showNextImage]);

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  function showNextImage() {
    setImageIndex((index) => {
      if (index === images.length - 1) {
        return 0;
      }
      return index + 1;
    });
  }

  function showPrevImage() {
    setImageIndex((index) => {
      if (index === 0) {
        return images.length - 1;
      }
      return index - 1;
    });
  }

  return <section aria-label="Image Slider" style={{ width: "100%", height: "100%", position: "relative", }}>
    <a className="skip-link" href="#after-image-slider-controls">Skip Image Slider Controls</a>
    <div style={{ width: "100%", height: "100%", display: "flex", overflow: "hidden" }}>
      {images.map(({ src: url, alt }, index) => (
        <img aria-hidden={imageIndex !== index} key={url} className="img-slider-img" alt={alt} src={url.split('?')[0]} style={{ translate: `${-100 * imageIndex}%` }} />
      ))}
    </div>
    <button aria-hidden aria-label="View Previous Image" onClick={showPrevImage} className="img-slider-btn" style={{ left: 0 }}><ArrowBigLeft /></button >
    <button aria-hidden aria-label="View Next Image" onClick={showNextImage} className="img-slider-btn" style={{ right: 0 }}><ArrowBigRight /></button >
    <div id="after-image-slider-controls" />
    {city && <article className="city">{city}</article>}
  </section>
}
