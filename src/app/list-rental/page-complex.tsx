// src/app/list-rental/page.tsx
"use client";

import { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { CurrencyFormatter } from '@/lib/currency';

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
              <div className="text-lg">{CurrencyFormatter.pricing(5200)} for 30 days</div>
              <div className="text-sm text-gray-600">Basic</div>
            </div>
            <div>
              <div className="text-lg">{CurrencyFormatter.pricing(7300)} for 30 days</div>
              <div className="text-sm text-gray-600">Featured</div>
            </div>
            <div>
              <div className="text-lg">{CurrencyFormatter.pricing(12500)} for 90 days</div>
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
                <option value="small-dogs">Small Dogs Only</option>
                <option value="all-pets">All Pets Allowed</option>
                <option value="case-by-case">Case by Case</option>
              </select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {["Garden", "Security", "Fruit Trees", "Swimming Pool", "Air Conditioning", "Garage / Parking"].map((feature) => (
                <label key={feature} className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    className="form-checkbox"
                    onChange={(e) => {
                      const current = formData.features || []
                      if (e.target.checked) {
                        setFormData({...formData, features: [...current, feature]})
                      } else {
                        setFormData({...formData, features: current.filter(f => f !== feature)})
                      }
                    }}
                  />
                  <span>{feature}</span>
                </label>
              ))}
            </div>

            {/* Landlord/Property Manager Verification Section */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Landlord/Property Manager Verification</h3>
              
              {/* Basic Landlord Information */}
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <h4 className="font-medium text-blue-800 mb-3">👤 Landlord Information</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="landlordName"
                      value={formData.landlordName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Property owner/manager name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      name="landlordEmail"
                      value={formData.landlordEmail}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="landlord@email.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      name="landlordPhone"
                      value={formData.landlordPhone}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="+592-XXX-XXXX"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Landlord Type *
                    </label>
                    <select
                      name="landlordType"
                      value={formData.landlordType}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select type</option>
                      <option value="individual-owner">Individual Property Owner</option>
                      <option value="property-management">Property Management Company</option>
                      <option value="real-estate-investor">Real Estate Investor</option>
                      <option value="family-owner">Family-Owned Property</option>
                      <option value="corporate-owner">Corporate Owner</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Rental Experience Portfolio */}
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <h4 className="font-medium text-green-800 mb-3">🏠 Rental Property Experience</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Management Type *
                    </label>
                    <select
                      name="managementType"
                      value={formData.managementType}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select management type</option>
                      <option value="self-managed">Self-Managed (I handle everything)</option>
                      <option value="property-manager">Using Property Manager</option>
                      <option value="family-managed">Family-Managed</option>
                      <option value="professional-company">Professional Management Company</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Rental Properties You Own *
                      </label>
                      <select
                        name="propertyCount"
                        value={formData.propertyCount}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select count</option>
                        <option value="1">1 property (First-time landlord)</option>
                        <option value="2-3">2-3 properties</option>
                        <option value="4-10">4-10 properties</option>
                        <option value="11-25">11-25 properties</option>
                        <option value="25+">25+ properties (Portfolio landlord)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience as Landlord *
                      </label>
                      <select
                        name="rentedBefore"
                        value={formData.rentedBefore}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select experience</option>
                        <option value="first-time">First-time landlord</option>
                        <option value="1-2-years">1-2 years experience</option>
                        <option value="3-5-years">3-5 years experience</option>
                        <option value="6-10-years">6-10 years experience</option>
                        <option value="10+-years">10+ years experience</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Property Status *
                      </label>
                      <select
                        name="currentOccupancy"
                        value={formData.currentOccupancy}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select status</option>
                        <option value="vacant-ready">Vacant & Ready to Rent</option>
                        <option value="occupied-leaving">Currently Occupied (Tenant Leaving)</option>
                        <option value="needs-renovation">Vacant & Needs Minor Repairs</option>
                        <option value="new-property">New Property (Never Rented)</option>
                        <option value="being-renovated">Currently Being Renovated</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Age
                      </label>
                      <select
                        name="propertyAge"
                        value={formData.propertyAge}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select age</option>
                        <option value="new-construction">New Construction (0-2 years)</option>
                        <option value="recent">Recent (3-10 years)</option>
                        <option value="established">Established (11-25 years)</option>
                        <option value="mature">Mature (26+ years)</option>
                        <option value="historic">Historic/Heritage Property</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Verification */}
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                <h4 className="font-medium text-yellow-800 mb-3">📄 Property Documentation</h4>
                <p className="text-sm text-yellow-700 mb-4">
                  Upload documents to verify your right to rent this property. We work with various proof types.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Ownership/Authorization Document *
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setFormData({...formData, ownershipDocument: e.target.files?.[0] || null})}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Property deed, rental authorization letter, or property management agreement
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Government ID *
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setFormData({...formData, idDocument: e.target.files?.[0] || null})}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      National ID, passport, or driver's license
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sample Tenancy Agreement (Optional)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setFormData({...formData, tenancyAgreement: e.target.files?.[0] || null})}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Your standard rental agreement template (helps build trust)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Insurance (Recommended)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setFormData({...formData, insuranceDocument: e.target.files?.[0] || null})}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Property insurance certificate (shows professional landlord status)
                    </p>
                  </div>
                </div>
              </div>

              {/* Verification Process Info */}
              <div className="bg-gray-50 border border-gray-200 rounded p-4">
                <h4 className="font-medium text-gray-800 mb-2">⏰ Verification & Pricing</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>
                    <strong>Quick Approval:</strong> Most landlords with clear documentation get approved within 24 hours.
                  </p>
                  <p>
                    <strong>Free Trial:</strong> 
                    • <strong>Single property owners:</strong> 10-day free trial<br/>
                    • <strong>Multiple properties (2+):</strong> No free trial - pay from day 1<br/>
                    • <strong>Property management companies:</strong> Contact us for enterprise rates
                  </p>
                  <p>
                    <strong>Why no free trials for multiple properties?</strong> You're already generating rental income 
                    and should invest in proper marketing from the start.
                  </p>
                  <p>
                    <strong>Professional Support:</strong> All verified landlords get tenant screening guidance 
                    and professional listing optimization.
                  </p>
                </div>
              </div>

              {/* Property Management Company Notice */}
              <div className="bg-blue-50 border border-blue-400 rounded p-4">
                <h4 className="font-medium text-blue-800 mb-2">🏢 Property Management Companies</h4>
                <div className="text-sm text-blue-700 space-y-2">
                  <p>
                    <strong>Enterprise Pricing Available:</strong> Managing multiple properties for clients? 
                    We offer custom bulk rates based on your portfolio size.
                  </p>
                  <p>
                    <strong>Contact Sales:</strong> Email us at info@guyanahomehub.com or call +592-XXX-XXXX 
                    to discuss volume discounts and white-label solutions.
                  </p>
                  <p>
                    <strong>What We'll Need:</strong> Portfolio size, property types, current management structure, 
                    and your specific needs for custom pricing.
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Image Upload Section */}
            <div className="space-y-4">
              <label className="block font-medium text-gray-700">Upload Property Images</label>
              
              {/* Drag and Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragOver 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-green-50'
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drag and drop images here, or click to select
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Upload up to 10 high-quality images (JPG, PNG, GIF)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 cursor-pointer transition"
                >
                  Choose Files
                </label>
              </div>

              {/* Image Preview Grid */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {uploadedImages.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Status */}
              <div className="text-sm text-gray-600">
                {uploadedImages.length > 0 && (
                  <p className="flex items-center">
                    <ImageIcon className="h-4 w-4 mr-1" />
                    {uploadedImages.length} image{uploadedImages.length !== 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
            </div>

            <div className="text-center pt-4">
              <button type="submit" className="bg-green-700 text-white font-semibold px-8 py-3 rounded hover:bg-green-800 transition">
                Submit Listing
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
