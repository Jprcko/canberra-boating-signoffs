
import { useState, useEffect } from "react";

export const useBookingPriceTest = (selectedServices: string[], participants: string) => {
  const [price, setPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  
  useEffect(() => {
    let totalPrice = 0;
    let totalDiscount = 0;
    const basePrice = 1; // Changed from 499 to 1
    const testPrice = 149;
    
    if (selectedServices.includes("full")) {
      totalPrice = basePrice;
    } 
    
    if (selectedServices.includes("group")) {
      let discountPercent = 0;
      
      switch (participants) {
        case "2":
          discountPercent = 10;
          break;
        case "3":
          discountPercent = 12;
          break;
        case "4":
          discountPercent = 15;
          break;
        case "5":
          discountPercent = 17;
          break;
        case "6":
          discountPercent = 20;
          break;
        case "7":
          discountPercent = 22;
          break;
        default:
          discountPercent = 0;
      }
      
      const discountAmount = (basePrice * discountPercent) / 100;
      const pricePerPerson = basePrice - discountAmount;
      totalPrice = pricePerPerson * Number(participants);
      totalDiscount = discountAmount * Number(participants);
    }

    if (selectedServices.includes("test")) {
      const participantCount = selectedServices.includes("group") ? Number(participants) : 1;
      let testTotalPrice = testPrice * participantCount;
      
      if (selectedServices.includes("group")) {
        let discountPercent = 0;
        switch (participants) {
          case "2":
            discountPercent = 10;
            break;
          case "3":
            discountPercent = 12;
            break;
          case "4":
            discountPercent = 15;
            break;
          case "5":
            discountPercent = 17;
            break;
          case "6":
            discountPercent = 20;
            break;
          case "7":
            discountPercent = 22;
            break;
        }
        const testDiscountAmount = (testTotalPrice * discountPercent) / 100;
        testTotalPrice -= testDiscountAmount;
        totalDiscount += testDiscountAmount;
      }
      
      totalPrice += testTotalPrice;
    }

    setPrice(totalPrice);
    setDiscount(totalDiscount);
  }, [selectedServices, participants]);

  return { price, discount };
};
