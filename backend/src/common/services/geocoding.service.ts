import { Injectable } from '@nestjs/common';

@Injectable()
export class GeocodingService {
  async geocodeAddress(address: string): Promise<{ latitude: number | null; longitude: number | null }> {
    // Mock geocoding based on a hash of the address
    const hash = Array.from(address).reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const latitude = 40.0 + (hash % 1000) / 10000;
    const longitude = -80.0 + (hash % 1000) / 10000;
    return { latitude, longitude };
  }
}
