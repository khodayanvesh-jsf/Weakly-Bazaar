export const calculateLogistics = (weightGrams, distanceKm, heavyTransportFee = 0, laborFee = 0) => {
  let vehicle = '2-Wheeler Rider (Up to 45kg)';
  let baseDelivery = 25; 
  if (weightGrams > 45000 && weightGrams <= 300000) {
    vehicle = '3-Wheeler Auto (Up to 3 Quintals)';
    baseDelivery = Math.min(Math.ceil(weightGrams / 100000) * 50, 150);
  } else if (weightGrams > 300000) {
    vehicle = 'Merchant Heavy Transport';
    baseDelivery = 0; 
  }
  return { vehicle, deliveryFee: baseDelivery + Number(heavyTransportFee || 0) + Number(laborFee || 0) };
};

export const calculateOrderTotals = (itemsTotal, deliveryFee, platformGstRate = 0.05) => {
  const gst = Number(((itemsTotal + deliveryFee) * platformGstRate).toFixed(2));
  const grandTotal = Number((itemsTotal + deliveryFee + gst).toFixed(2));
  return { gst, grandTotal };
};