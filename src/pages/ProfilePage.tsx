import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { profileService } from '../services/profileService';
import { addressService } from '../services/addressService';
import { Address } from '../types';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { AddAddressModal } from '../components/checkout/AddAddressModal';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  LogOut,
  Edit2,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Plus
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, profile, signOut, refreshProfile, updateUserMetadata } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // Edit profile state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phoneNumber, setPhoneNumber] = useState(profile?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Add address modal
  const [addAddressModalOpen, setAddAddressModalOpen] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhoneNumber(profile.phone || '');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoadingAddresses(true);
        const data = await addressService.getAddresses(user?.id || 'demo-user-id');
        setAddresses(data);
      } catch (err) {
        console.error('Error fetching addresses:', err);
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateUserMetadata({
        full_name: fullName,
        phone: phoneNumber,
        avatar_url: avatarUrl,
      });
      setEditModalOpen(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddAddress = async (data: Omit<Address, 'id' | 'user_id' | 'created_at'>) => {
    const created = await addressService.addAddress(user?.id || 'demo-user-id', data);
    setAddresses(prev => [created, ...prev]);
  };

  const handleDeleteAddress = async (addrId: string) => {
    await addressService.deleteAddress(user?.id || 'demo-user-id', addrId);
    setAddresses(prev => prev.filter(a => a.id !== addrId));
  };

  const handleSetDefault = async (addrId: string) => {
    await addressService.setDefaultAddress(user?.id || 'demo-user-id', addrId);
    setAddresses(prev => prev.map(a => ({ ...a, is_default: a.id === addrId })));
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Profile Card Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="relative">
            {profile?.avatar_url && !profile.avatar_url.includes('photo-1534528741775') ? (
              <img
                src={profile.avatar_url}
                alt={profile?.full_name || user?.full_name || 'Profile'}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-brand-100"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 text-white font-black text-3xl flex items-center justify-center border-4 border-white shadow-md ring-2 ring-brand-100">
                {(profile?.full_name || user?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <button
              onClick={() => setEditModalOpen(true)}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-brand-500 hover:bg-brand-600 text-white flex items-center justify-center shadow-md transition-all active:scale-90"
              title="Edit Profile Photo"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {profile?.full_name || user?.full_name || 'My Profile'}
              </h1>
            </div>

            <div className="mt-2 space-y-1 text-xs text-slate-500 font-medium">
              <p className="flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{user?.email || profile?.email || 'No email provided'}</span>
              </p>
              <p className="flex items-center justify-center sm:justify-start gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{profile?.phone || user?.phone || 'Add phone number in edit profile'}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditModalOpen(true)}
            leftIcon={<Edit2 className="w-3.5 h-3.5" />}
          >
            Edit Profile
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
            leftIcon={<LogOut className="w-3.5 h-3.5" />}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Quick Navigation Link Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/orders"
          className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card hover:shadow-card-hover transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-brand-600 transition-colors">
                My Orders
              </h3>
              <p className="text-xs text-slate-400">View live deliveries and past orders</p>
            </div>
          </div>
          <span className="text-xs font-bold text-brand-600 group-hover:translate-x-1 transition-transform">
            →
          </span>
        </Link>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Account Security
              </h3>
              <p className="text-xs text-slate-400">Supabase Auth Verified • Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Addresses Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-500" />
            <h2 className="font-extrabold text-lg text-slate-900">
              Saved Delivery Addresses
            </h2>
          </div>

          <Button
            size="sm"
            onClick={() => setAddAddressModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Address
          </Button>
        </div>

        {loadingAddresses ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading addresses...</div>
        ) : addresses.length === 0 ? (
          <p className="text-sm text-slate-500 py-4 text-center">No addresses saved yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between gap-3 relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-xs uppercase tracking-wider text-slate-900">
                      {addr.label}
                    </span>
                    {addr.is_default && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {addr.address_line}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {addr.city}, {addr.postal_code}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                  {!addr.is_default ? (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="font-bold text-brand-600 hover:underline text-[11px]"
                    >
                      Set as Default
                    </button>
                  ) : (
                    <span className="text-slate-400 text-[11px]">Primary Address</span>
                  )}

                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete address"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Profile"
        maxWidth="md"
      >
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <Input
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            leftIcon={<User className="w-4 h-4" />}
          />

          <Input
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+91 98765 43210"
            leftIcon={<Phone className="w-4 h-4" />}
          />

          <Input
            label="Avatar Photo URL"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
            helperText="Provide a public image link for your profile picture"
          />

          <div className="flex gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditModalOpen(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={savingProfile}
              fullWidth
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Address Modal */}
      <AddAddressModal
        isOpen={addAddressModalOpen}
        onClose={() => setAddAddressModalOpen(false)}
        onAddAddress={handleAddAddress}
      />
    </div>
  );
};
