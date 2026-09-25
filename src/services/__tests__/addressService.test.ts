import { describe, it, expect, beforeEach } from 'vitest';
import { addressService } from '../addressService';

describe('addressService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('retrieves default demo addresses when no addresses are saved', async () => {
    const addresses = await addressService.getAddresses('demo-user-id');
    expect(addresses.length).toBeGreaterThan(0);
    expect(addresses[0]).toHaveProperty('address_line');
  });

  it('adds a new address to storage', async () => {
    const newAddressData = {
      label: 'Office',
      address_line: 'Tower B, Tech Park, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postal_code: '560038',
      latitude: 12.9716,
      longitude: 77.5946,
      is_default: false,
    };

    const created = await addressService.addAddress('demo-user-id', newAddressData);
    expect(created.label).toBe('Office');
    expect(created.address_line).toBe('Tower B, Tech Park, Indiranagar');

    const addresses = await addressService.getAddresses('demo-user-id');
    expect(addresses.some(a => a.address_line === 'Tower B, Tech Park, Indiranagar')).toBe(true);
  });

  it('sets an address as default and unsets previous defaults', async () => {
    const addresses = await addressService.getAddresses('demo-user-id');
    const targetAddress = addresses[addresses.length - 1];

    await addressService.setDefaultAddress('demo-user-id', targetAddress.id);

    const updated = await addressService.getAddresses('demo-user-id');
    const newDefault = updated.find(a => a.id === targetAddress.id);
    expect(newDefault?.is_default).toBe(true);

    const otherDefaults = updated.filter(a => a.id !== targetAddress.id && a.is_default);
    expect(otherDefaults.length).toBe(0);
  });

  it('deletes an address successfully', async () => {
    const initialAddresses = await addressService.getAddresses('demo-user-id');
    const toDelete = initialAddresses[0];

    await addressService.deleteAddress('demo-user-id', toDelete.id);

    const afterDelete = await addressService.getAddresses('demo-user-id');
    expect(afterDelete.some(a => a.id === toDelete.id)).toBe(false);
  });
});
