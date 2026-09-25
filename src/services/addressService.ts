import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { INITIAL_DEMO_ADDRESSES } from '../lib/mockData';
import { Address } from '../types';

const STORAGE_KEY = 'zestora_demo_addresses';

function getLocalAddresses(): Address[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_DEMO_ADDRESSES;
}

function saveLocalAddresses(addresses: Address[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  } catch (e) {
    console.error(e);
  }
}

export const addressService = {
  async getAddresses(userId: string): Promise<Address[]> {
    if (isSupabaseConfigured && userId && userId !== 'demo-user-id') {
      try {
        const { data, error } = await supabase
          .from('addresses')
          .select('*')
          .eq('user_id', userId)
          .order('is_default', { ascending: false });

        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase addresses fetch error:', err);
      }
    }
    return getLocalAddresses();
  },

  async addAddress(userId: string, addressData: Omit<Address, 'id' | 'user_id' | 'created_at'>): Promise<Address> {
    const newAddress: Address = {
      id: isSupabaseConfigured ? undefined as unknown as string : `addr-${Date.now()}`,
      user_id: userId,
      ...addressData,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && userId && userId !== 'demo-user-id') {
      try {
        // If this address is set as default, unset others first
        if (addressData.is_default) {
          await supabase
            .from('addresses')
            .update({ is_default: false })
            .eq('user_id', userId);
        }

        const { data, error } = await supabase
          .from('addresses')
          .insert([{
            user_id: userId,
            label: addressData.label,
            address_line: addressData.address_line,
            city: addressData.city,
            state: addressData.state,
            postal_code: addressData.postal_code,
            latitude: addressData.latitude,
            longitude: addressData.longitude,
            is_default: addressData.is_default,
          }])
          .select()
          .single();

        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase add address error:', err);
      }
    }

    const current = getLocalAddresses();
    if (newAddress.is_default) {
      current.forEach(a => a.is_default = false);
    }
    const created = { ...newAddress, id: `addr-${Date.now()}` };
    current.unshift(created);
    saveLocalAddresses(current);
    return created;
  },

  async deleteAddress(userId: string, addressId: string): Promise<void> {
    if (isSupabaseConfigured && userId && userId !== 'demo-user-id') {
      try {
        await supabase
          .from('addresses')
          .delete()
          .eq('id', addressId)
          .eq('user_id', userId);
        return;
      } catch (err) {
        console.warn('Supabase delete address error:', err);
      }
    }

    const current = getLocalAddresses().filter(a => a.id !== addressId);
    saveLocalAddresses(current);
  },

  async setDefaultAddress(userId: string, addressId: string): Promise<void> {
    if (isSupabaseConfigured && userId && userId !== 'demo-user-id') {
      try {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', userId);

        await supabase
          .from('addresses')
          .update({ is_default: true })
          .eq('id', addressId)
          .eq('user_id', userId);
        return;
      } catch (err) {
        console.warn('Supabase set default address error:', err);
      }
    }

    const current = getLocalAddresses().map(a => ({
      ...a,
      is_default: a.id === addressId,
    }));
    saveLocalAddresses(current);
  }
};
