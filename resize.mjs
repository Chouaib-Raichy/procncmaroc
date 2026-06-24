import sharp from 'sharp';
await sharp('frontend/public/showroom-v2.webp')
  .resize(800)
  .webp({ quality: 80 })
  .toFile('frontend/public/showroom-800.webp');
