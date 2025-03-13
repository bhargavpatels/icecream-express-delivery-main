
import { User } from '../../types/user';
import { UserState, UserAction } from './userTypes';

// Initial state with mock user for development
export const mockUser: User = {
  id: "1",
  name: "Bhargav Kachhadiya",
  email: "dainikkachhadiya@gmail.com",
  phone: "8238868416",
  addresses: [
    {
      id: "1",
      address: "512, Mindwave Infoway",
      city: "Rajkot",
      pincode: "360004",
      isDefault: true
    }
  ]
};

// Reducer function
export function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload
      };
    
    case 'UPDATE_PROFILE':
      if (!state.user) return state;
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };
    
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload
      };
    
    case 'ADD_ADDRESS':
      if (!state.user) return state;
      return {
        ...state,
        user: {
          ...state.user,
          addresses: [...state.user.addresses, action.payload]
        }
      };
    
    case 'UPDATE_ADDRESS':
      if (!state.user) return state;
      return {
        ...state,
        user: {
          ...state.user,
          addresses: state.user.addresses.map(addr => 
            addr.id === action.payload.id ? action.payload : addr
          )
        }
      };
    
    case 'DELETE_ADDRESS':
      if (!state.user) return state;
      
      // Get the address being deleted to check if it's default
      const addressToDelete = state.user.addresses.find(addr => addr.id === action.payload);
      // Filter out the deleted address
      const updatedAddresses = state.user.addresses.filter(addr => addr.id !== action.payload);
      
      // If we're deleting the default address and there are other addresses, make the first one default
      if (addressToDelete?.isDefault && updatedAddresses.length > 0) {
        updatedAddresses[0].isDefault = true;
      }
      
      return {
        ...state,
        user: {
          ...state.user,
          addresses: updatedAddresses
        }
      };
    
    case 'SET_DEFAULT_ADDRESS':
      if (!state.user) return state;
      return {
        ...state,
        user: {
          ...state.user,
          addresses: state.user.addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === action.payload
          }))
        }
      };
    
    default:
      return state;
  }
}
