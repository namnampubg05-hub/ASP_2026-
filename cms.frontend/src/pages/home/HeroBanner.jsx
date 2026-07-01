import React, { useState, useEffect, useCallback } from "react";
import advertisementService from "../../services/advertisementService";

export default function HeroBanner({ scrollTo }) {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    advertisementService.getAll().then((data) => {
      const mapped = data.map((item) => ({
        id: item.id,
        image: item.imageUrl,
        badge: item.badgeText,
        title: item.title,
        accent: item.accent,
        desc: item.description,
        link: item.linkUrl,
      }));
      setSlides(mapped);
      setLoading(false);
    });
  }, []);

  const goTo = useCallback((index) => {
    setPrev(current);
    setCurrent(index);
  }, [current]);

  const next = useCallback(() => {
    if (slides.length === 0) return;
    goTo((current + 1) % slides.length);
  }, [current, goTo, slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length === 0) return;
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo, slides.length]);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  if (loading || slides.length === 0) return null;

  return (
    <section id="home" className="hero hero-carousel">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`hero-slide ${index === current ? "active" : ""} ${index === prev ? "prev" : ""}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        />
      ))}
      <div className="hero-overlay" />

      <div className="overlay">
        {slides[current].badge && (
          <div className="badge-hero">{slides[current].badge}</div>
        )}
        <h1>
          {slides[current].title}{" "}
          {slides[current].accent && <span>{slides[current].accent}</span>}
        </h1>
        {slides[current].desc && <p>{slides[current].desc}</p>}
        <div className="hero-btns">
          <button className="btn-primary-hero" onClick={() => scrollTo("products")}>Mua Ngay</button>
          <button className="btn-secondary-hero">Khám Phá</button>
        </div>
      </div>

      <div className="hero-float">
        <div className="float-card">
          <div className="number">500+</div>
          <div className="label">Sản phẩm</div>
        </div>
        <div className="float-card">
          <div className="number">99%</div>
          <div className="label">Hài lòng</div>
        </div>
        <div className="float-card">
          <div className="number">60'</div>
          <div className="label">Giao hàng</div>
        </div>
      </div>

      <div className="carousel-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === current ? "active" : ""}`}
            onClick={() => goTo(index)}
          />
        ))}
      </div>

      <button className="carousel-arrow carousel-arrow-left" onClick={prevSlide}>❮</button>
      <button className="carousel-arrow carousel-arrow-right" onClick={next}>❯</button>
    </section>
  );
}
