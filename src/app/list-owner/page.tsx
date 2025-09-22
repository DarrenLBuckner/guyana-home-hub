// src/app/list-owner/page.tsx
"use client";

import { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { CurrencyFormatter } from '@/lib/currency';

export default function ListOwnerPage() {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [formData, setFormData] = useState({
    propertyTitle: '',
    description: '',
    location: '',
    price: '',
    squareFootage: '',
    // Owner verification fields
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    // Property ownership verification
    ownershipType: '',
    purchaseYear: '',
    ownershipDuration: '',
    propertyUse: '',
    // Verification documents
    ownershipDocument: null as File | null,
    idDocument: null as File | null,
    utilityDocument: null as File | null,
    // Selected features
    features: [] as string[]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
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
          List Your Home for Sale
        </h1>

        <div className="max-w-4xl mx-auto bg-gray-50 p-6 rounded-lg shadow-md space-y-6">
          <div className="flex justify-between items-center text-sm sm:text-base text-green-700 font-semibold">
            <span>{CurrencyFormatter.pricing(10000)} for 30 days</span>
            <span className="text-center font-bold">No agent fees</span>
            <span>{CurrencyFormatter.pricing(25000)} for 90 days <span className="text-xs ml-1 text-gray-500">(Most Popular)</span></span>
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
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price in GYD (USD equivalent will be shown)" 
              className="w-full px-4 py-2 border border-gray-300 rounded" 
            />
            <input 
              type="number" 
              name="squareFootage"
              value={formData.squareFootage}
              onChange={handleChange}
              placeholder="Square Footage" 
              className="w-full px-4 py-2 border border-gray-300 rounded" 
            />

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Property Features</h4>
              
              {/* Features Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-700 mb-3">Features</h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {["Pet Friendly", "Garden", "Pool", "Security Estate", "AC", "Security System", "Fenced", "Backup Generator", "Garage", "Furnished"].map((feature) => (
                    <label key={feature} className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        className="form-checkbox"
                        checked={formData.features.includes(feature)}
                        onChange={() => handleFeatureToggle(feature)}
                      />
                      <span className="text-sm">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Other Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-700 mb-3">Other</h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {["WiFi", "Cable TV", "Kitchen Appliances", "Washing Machine"].map((feature) => (
                    <label key={feature} className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        className="form-checkbox"
                        checked={formData.features.includes(feature)}
                        onChange={() => handleFeatureToggle(feature)}
                      />
                      <span className="text-sm">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Owner Verification Section */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Owner Verification</h3>
              
              {/* Basic Owner Information */}
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <h4 className="font-medium text-blue-800 mb-3">👤 Property Owner Information</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name (as on property documents) *
                    </label>
                    <input
                      type="text"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      name="ownerEmail"
                      value={formData.ownerEmail}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="john@email.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      name="ownerPhone"
                      value={formData.ownerPhone}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="+592-XXX-XXXX"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Property Ownership Verification */}
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <h4 className="font-medium text-green-800 mb-3">🏠 Property Ownership Details</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ownership Type *
                    </label>
                    <select
                      name="ownershipType"
                      value={formData.ownershipType}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select ownership type</option>
                      <option value="sole-owner">Sole Owner</option>
                      <option value="joint-owner">Joint Owner (with spouse/family)</option>
                      <option value="inherited">Inherited Property</option>
                      <option value="company-owned">Company Owned</option>
                      <option value="authorized-seller">Authorized to Sell (with permission)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Year Property Was Acquired *
                      </label>
                      <select
                        name="purchaseYear"
                        value={formData.purchaseYear}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select year</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                        <option value="2019">2019</option>
                        <option value="2018">2018</option>
                        <option value="2017">2017</option>
                        <option value="2016">2016</option>
                        <option value="2015-earlier">2015 or earlier</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Use *
                      </label>
                      <select
                        name="propertyUse"
                        value={formData.propertyUse}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select current use</option>
                        <option value="primary-residence">Primary Residence</option>
                        <option value="vacation-home">Vacation/Second Home</option>
                        <option value="rental-property">Rental Property</option>
                        <option value="vacant">Vacant/Unoccupied</option>
                        <option value="investment">Investment Property</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Verification */}
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                <h4 className="font-medium text-yellow-800 mb-3">📄 Document Verification</h4>
                <p className="text-sm text-yellow-700 mb-4">
                  Please upload documents to verify ownership. We accept various forms of proof.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Ownership Document *
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setFormData({...formData, ownershipDocument: e.target.files?.[0] || null})}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Property deed, title, purchase agreement, or inheritance document
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
                      Proof of Address (Optional but Recommended)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setFormData({...formData, utilityDocument: e.target.files?.[0] || null})}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Recent utility bill, tax notice, or bank statement for this property
                    </p>
                  </div>
                </div>
              </div>

              {/* Verification Process Info */}
              <div className="bg-gray-50 border border-gray-200 rounded p-4">
                <h4 className="font-medium text-gray-800 mb-2">⏰ Verification Process</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>
                    <strong>Quick Verification:</strong> Most owners with clear documentation get approved within 24 hours.
                  </p>
                  <p>
                    <strong>First Property Trial:</strong> First-time property sellers get a <strong>10-day trial</strong> to test our platform.
                  </p>
                  <p>
                    <strong>Multiple Properties?</strong> If you own multiple properties for sale, consider our <a href="/list-agent" className="text-green-600 underline">Professional Agent Network</a> for better exposure and sales support.
                  </p>
                  <p>
                    <strong>Flexible Documentation:</strong> We work with various proof of ownership - don't have perfect paperwork? Contact us at <a href="mailto:info@guyanahomehub.com" className="text-green-600 underline">info@guyanahomehub.com</a>.
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
