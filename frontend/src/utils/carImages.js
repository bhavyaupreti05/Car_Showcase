// High-resolution automotive photography fallbacks
const FALLBACK_IMAGES = {
  suv: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
  sedan: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
  hatchback: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
  electric: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
  default: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
};

/**
 * Get a clean, reliable, high-resolution image URL for a vehicle
 */
export const getCarImageUrl = (car) => {
  if (!car) return FALLBACK_IMAGES.default;

  // If car already has a valid non-dummy image
  if (car.imageUrl && !car.imageUrl.includes('dummyimage.com')) {
    return car.imageUrl;
  }
  if (car.image && !car.image.includes('dummyimage.com')) {
    return car.image;
  }

  // Type-specific fallback
  const fuel = car.fuelType?.toLowerCase();
  if (fuel === 'electric') return FALLBACK_IMAGES.electric;

  const type = car.bodyType?.toLowerCase();
  return FALLBACK_IMAGES[type] || FALLBACK_IMAGES.default;
};

export const handleImageError = (e, bodyType = 'default') => {
  const fallback = FALLBACK_IMAGES[bodyType?.toLowerCase()] || FALLBACK_IMAGES.default;
  if (e.target.src !== fallback) {
    e.target.src = fallback;
  }
};
