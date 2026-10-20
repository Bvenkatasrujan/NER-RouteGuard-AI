import { Vehicle, VehicleStatus } from '../../types/vehicle';
import { DEMO_VEHICLES } from '../mockData/demoVehicles';

class VehicleService {
  private vehicles: Vehicle[] = [...DEMO_VEHICLES];

  async getAllVehicles(): Promise<Vehicle[]> {
    return this.vehicles;
  }

  async getVehicleById(id: string): Promise<Vehicle | undefined> {
    return this.vehicles.find((v) => v.vehicle_id === id);
  }

  async updateVehicleStatus(id: string, status: VehicleStatus): Promise<Vehicle | undefined> {
    const v = this.vehicles.find((item) => item.vehicle_id === id);
    if (v) {
      v.status = status;
    }
    return v;
  }

  async updateVehicleLocation(id: string, lat: number, lng: number): Promise<Vehicle | undefined> {
    const v = this.vehicles.find((item) => item.vehicle_id === id);
    if (v) {
      v.latitude = lat;
      v.longitude = lng;
    }
    return v;
  }
}

export const vehicleService = new VehicleService();
