// src/app/list-rental/page.tsx
"use client";

import { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export default function ListRentalPage() {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [formData, setFormData] = useState({
    propertyTitle: '',
    description: '',
    location: '',
    monthlyRent: '',
    securityDeposit: '',
    leaseTerms: '',
    petPolicy: '',
    // Landlord verification fields
    landlordName: '',
    landlordEmail: '',
    landlordPhone: '',
    landlordType: '',
    // Property management verification
    managementType: '',
    propertyCount: '',
    rentedBefore: '',
    currentOccupancy: '',
    // Property details
    propertyAge: '',
    lastRenovated: '',
    // Verification documents
    ownershipDocument: null as File | null,
    idDocument: null as File | null,
    tenancyAgreement: null as File | null,
    insuranceDocument: null as File | null,
    // Selected features
    features: [] as string[]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
      setUploadedImages(prev => [...prev, ...newFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <main className="min-h-screen bg-white py-20 px-4">
        <h1 className="text-4xl font-bold text-center text-green-700 mb-8">
          List Your Rental Property
        </h1>

        <div className="max-w-4xl mx-auto bg-gray-50 p-6 rounded-lg shadow-md space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-green-700 font-semibold text-center">
            <div>
              <div className="text-lg">G$5,200 for 30 days</div>
              <div className="text-sm text-gray-600">Basic</div>
            </div>
            <div>
              <div className="text-lg">G$7,300 for 30 days</div>
              <div className="text-sm text-gray-600">Featured</div>
            </div>
            <div>
              <div className="text-lg">G$12,500 for 90 days</div>
              <div className="text-sm text-gray-600">Premium (20% savings)</div>
            </div>
          </div>

          <form className="space-y-6">
            <input 
              type="text" 
              name="propertyTitle"
              value={formData.propertyTitle}
              onChange={handleChange}
              placeholder="Property Title" 
              className="w-full px-4 py-2 border border-gray-300 rounded" 
            />
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Property Description (Powered by AI)" 
              className="w-full px-4 py-2 border border-gray-300 rounded" 
              rows={4}
            />
            <input 
              type="text" 
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location / Region" 
              className="w-full px-4 py-2 border border-gray-300 rounded" 
            />
            <input 
              type="number" 
              name="monthlyRent"
              value={formData.monthlyRent}
              onChange={handleChange}
              placeholder="Monthly Rent (GYD)" 
              className="w-full px-4 py-2 border border-gray-300 rounded" 
            />
            <input 
              type="number" 
              name="securityDeposit"
              value={formData.securityDeposit}
              onChange={handleChange}
              placeholder="Security Deposit (GYD)" 
              className="w-full px-4 py-2 border border-gray-300 rounded" 
            />

            <div>
              <label className="block mb-1 font-medium">Lease Terms</label>
              <select 
                name="leaseTerms"
                value={formData.leaseTerms}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded"
              >
                <option value="">Select lease terms</option>
                <option value="month-to-month">Month-to-Month</option>
                <option value="6-months">6 Months</option>
                <option value="1-year">1 Year</option>
                <option value="2-years">2 Years</option>
                <option value="flexible">Flexible Terms</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Pet Policy</label>
              <select 
                name="petPolicy"
                value={formData.petPolicy}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded"
              >
                <option value="">Select pet policy</option>
                <option value="no-pets">No Pets</option>
                <option value="cats-only">Cats Only</option>
                <option value="dogs-only">Dogs Only</option>
                <option value="pets-allowed">Pets Allowed</option>
                <option value="negotiable">Negotiable</option>
              </select>
            </div>

            <div className="text-center">
              <button 
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded"
              >
                List My Property
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
