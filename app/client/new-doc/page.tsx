'use client';
import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFile } from '@fortawesome/free-solid-svg-icons';
import './DocumentUpload.css';
import { redirect, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';
import { Loading } from '@/components/loading';

const DocumentUpload = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    dob: '',
    documentType: '',
    issueDate: '',
    expiryDate: '',
    document: null, // Single document upload
    requestDate: new Date().toISOString().slice(0, 10), // Auto-fill current date
    address: '',
    city: '',
    state: '',
    zip: '',
    income: ''
  });

  const router = useRouter();

  const fileInputRef = useRef(null); // Reference to the file input

  const handleChange = (e: any) => {
    if (e.target.name === 'zip' || e.target.name === 'income') {
      if (isNaN(e.target.value)) {
        return;
      }
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    if (file.size > 1000000) {
      toast({
        title: 'File size too large',
        description: 'Please upload a file less than 1MB',
        variant: 'destructive'
      });
      return;
    }
    if (file) {
      setFormData({
        ...formData,
        document: file
      });
    }
  };

  const handleReset = () => {
    setFormData({
      firstname: '',
      lastname: '',
      dob: '',
      documentType: '',
      issueDate: '',
      expiryDate: '',
      document: null,
      requestDate: new Date().toISOString().slice(0, 10),
      address: '',
      city: '',
      state: '',
      zip: '',
      income: ''
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formD = new FormData();
    for (let key in formData) {
      if (key === 'document') {
        formD.append(key, formData[key]!);
      } else {
        formD.append(key, (formData as any)[key]);
      }
    }

    setLoading(true);
    try {
      const uploadRes = await axios.post('/api/documents', formD, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const thumbRes = await axios.post('/api/documents/thumbnail', {
        documentUrl: uploadRes.data.documentUrl
      });

      const final = await axios.post('/api/documents/addDocument', {
        ...formData,
        documentUrl: uploadRes.data.documentUrl,
        thumbnailUrl: thumbRes.data.thumbnailUrl
      });

      router.push('/client');
    } catch (error: any) {
      toast({
        title: 'Fill all fields and upload a document',
        description: error.message,
        variant: 'destructive'
      });

      if (error.response?.data.error === 'Unauthorized') {
        router.replace('/login');
      }
      console.error(error.message);
    }
    setLoading(false);
  };
  const triggerFileInput = () => {
    (fileInputRef.current as any).click(); // Trigger click on hidden file input
  };

  if (loading)
    return (
      <div className="p-20">
        <Loading />
      </div>
    );

  return (
    <div className="initialize2">
      <div className="container2">
        <h1>EWS Certificate Verification</h1>
        <form onSubmit={handleSubmit} onReset={handleReset}>
          <div className="name2">
            <div>
              <label>First Name</label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Last Name</label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Type of Document</label>
            <select
              name="documentType"
              value={formData.documentType}
              onChange={handleChange}
              required
            >
              <option value="">Select Document</option>
              <option value="caste_certificate">Caste Certificate</option>
              <option value="income_certificate">Income Certificate</option>
              <option value="address_proof">Address Proof</option>
              <option value="identity_proof">Identity Proof</option>
              <option value="birth_certificate">Birth Certificate</option>
              <option value="passport">Passport</option>
              <option value="driving_license">Driving License</option>
              <option value="ration_card">Ration Card</option>
              <option value="govt_scheme_card">Govt Scheme Card</option>
              <option value="aadhar_card">Aadhar Card</option>
              <option value="voter_id">Voter ID</option>
              <option value="pan_card">PAN Card</option>
            </select>
          </div>
          <div className="file-upload2">
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef} // Reference to the file input
              onChange={handleFileUpload}
              style={{
                height: 0,
                padding: 0,
                border: '0',
                margin: 0,
                width: 0,
                lineHeight: 0,
                display: 'absolute'
              }} // Hide the file input
              required
            />
            <label>Document for Verification</label>
            <button
              type="button"
              className="upload-btn2"
              onClick={triggerFileInput}
            >
              <FontAwesomeIcon icon={faPlus} style={{ marginRight: '8px' }} />
              Add Document
            </button>
            {formData.document && (
              <div className="uploaded-file2">
                <FontAwesomeIcon icon={faFile} style={{ marginRight: '8px' }} />
                <span>
                  Document: <small>{(formData.document as any).name}</small>
                </span>
              </div>
            )}
            <p>Acceptable file format: .pdf</p>
            <p>Max file size: 1MB</p>
          </div>

          <div>
            <label>Issue Date</label>
            <input
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Request Date</label>
            <input
              type="text"
              name="requestDate"
              value={formData.requestDate}
              readOnly
            />
          </div>

          <div>
            <label>Income</label>
            <input
              type="text"
              name="income"
              value={formData.income}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="address2">
            <div>
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Pin Code</label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="actions2">
            <div className="checkbox-group2">
              <input type="checkbox" required />
              <label>I agree that the document uploaded is correct</label>
            </div>
            <button type="submit" className="submit-btn2">
              Submit Application
            </button>
            <button type="reset" className="reset-btn2">
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentUpload;
