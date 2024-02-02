export type HotelType = {
    _id: String;
    userId: String;
    name: String;
    city: String;
    country: String;
    description: String;
    type: String;
    adultCount: number;
    childCount: number;
    facilities: string[];
    pricePerNight: number;
    starRating: number;
    imageUrls: string[];
    lastUpdated: Date;
}