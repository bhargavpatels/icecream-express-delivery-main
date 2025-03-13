export interface Address {
  id: string;
  streetAddress: string;
  city: string;
  pinCode: string;
  mobileNumber?: string;
  isDefault: boolean;
}
