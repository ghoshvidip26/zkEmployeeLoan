"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  FileText,
  CheckCircle,
  DollarSign,
  CreditCard,
  TrendingUp,
  Shield,
  Download,
  Eye,
  X,
} from "lucide-react";

interface UploadedFile {
  file: File;
  content: string;
  verified: boolean;
  salaryData?: {
    name: string;
    salary: number;
    position: string;
    organization: string;
  };
}

export default function EmployeePortal() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.name.endsWith(".eml")) {
      setIsProcessing(true);

      try {
        const content = await file.text();

        // Simulate verification process and salary extraction
        setTimeout(() => {
          const mockSalaryData = {
            name: "John Doe",
            salary: 120000,
            position: "Senior Software Engineer",
            organization: "zkVerify Corp",
          };

          setUploadedFile({
            file,
            content,
            verified: true,
            salaryData: mockSalaryData,
          });
          setIsProcessing(false);
        }, 2000);
      } catch (error) {
        console.error("Error reading file:", error);
        setIsProcessing(false);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "message/rfc822": [".eml"],
      "text/plain": [".eml"],
    },
    multiple: false,
  });

  const handleFinancialAction = (action: string) => {
    console.log(
      `Initiating ${action} with verified salary: $${uploadedFile?.salaryData?.salary}`
    );
    // Here you would integrate with your financial protocols
    alert(
      `${action} request initiated! Your verified salary of $${uploadedFile?.salaryData?.salary?.toLocaleString()} has been submitted for processing.`
    );
  };

  const removeFile = () => {
    setUploadedFile(null);
    setShowPreview(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(34,197,94,0.1),transparent_50%)]" />
      
      <div className="relative max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl mb-8 shadow-2xl shadow-green-500/25">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-green-100 to-green-300 text-transparent bg-clip-text">
            Employee Financial Portal
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Upload your employment verification email to unlock personalized financial services 
            powered by zkVerify&apos;s secure proof system
          </p>
        </div>

        {/* Upload Section */}
        {!uploadedFile && (
          <div className="mb-16">
            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-3xl p-16 text-center transition-all duration-300 cursor-pointer overflow-hidden ${
                isDragActive
                  ? "border-green-400 bg-green-400/10 scale-105"
                  : "border-gray-600 hover:border-green-400 hover:bg-gray-800/30 hover:scale-102"
              }`}
            >
              {/* Background Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              
              <input {...getInputProps()} />

              {isProcessing ? (
                <div className="flex flex-col items-center relative z-10">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 border-4 border-green-400/30 rounded-full"></div>
                    <div className="absolute inset-0 w-20 h-20 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white">
                    Processing Your File...
                  </h3>
                  <p className="text-gray-300 text-lg">
                    Verifying DKIM signatures and extracting salary data
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center relative z-10">
                  <div className="p-6 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl mb-6 shadow-2xl">
                    <Upload className="w-16 h-16 text-green-400" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-white">
                    {isDragActive
                      ? "Drop your .eml file here"
                      : "Upload Employment Verification"}
                  </h3>
                  <p className="text-gray-300 text-lg mb-6 max-w-md">
                    Drag & drop your .eml file here, or click to browse your files
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800/50 px-4 py-2 rounded-full">
                    <FileText className="w-4 h-4" />
                    <span>Supported: .eml files with DKIM signatures</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* File Verification Status */}
        {uploadedFile && (
          <div className="mb-12">
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/20 rounded-2xl">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-green-400 mb-1">
                      File Verified Successfully!
                    </h3>
                    <p className="text-gray-300 text-lg">
                      DKIM signature validated and salary data extracted
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  className="p-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200"
                  title="Remove file"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-green-400" />
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-wide">File Name</p>
                  </div>
                  <p className="font-semibold text-white text-lg">{uploadedFile.file.name}</p>
                </div>
                <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50">
                  <div className="flex items-center gap-3 mb-2">
                    <Download className="w-5 h-5 text-green-400" />
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-wide">File Size</p>
                  </div>
                  <p className="font-semibold text-white text-lg">
                    {(uploadedFile.file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>

              {uploadedFile.salaryData && (
                <div className="bg-neutral-800 p-6 rounded-lg mb-4">
                  <h4 className="text-lg font-bold mb-4 text-green-400">
                    Extracted Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-neutral-400">Employee Name</p>
                      <p className="font-semibold text-lg">
                        {uploadedFile.salaryData.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400">Position</p>
                      <p className="font-semibold text-lg">
                        {uploadedFile.salaryData.position}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400">Organization</p>
                      <p className="font-semibold text-lg">
                        {uploadedFile.salaryData.organization}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400">Annual Salary</p>
                      <p className="font-semibold text-2xl text-green-400">
                        ${uploadedFile.salaryData.salary.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  {showPreview ? "Hide" : "View"} Email Content
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  Download Verification Report
                </button>
              </div>
            </div>

            {/* Email Preview */}
            {showPreview && (
              <div className="mt-6 bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                <h4 className="text-lg font-bold mb-4">
                  Email Content Preview
                </h4>
                <div className="bg-neutral-900 p-4 rounded-lg max-h-64 overflow-y-auto">
                  <pre className="text-sm text-neutral-300 whitespace-pre-wrap">
                    {uploadedFile.content.substring(0, 1000)}...
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Financial Services Section */}
        {uploadedFile && uploadedFile.verified && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Repay */}
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-6 hover:border-blue-400 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                  <CreditCard className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold">Repay Loans</h3>
              </div>
              <p className="text-neutral-400 mb-6 text-sm">
                Make payments on existing loans using your verified salary
                information
              </p>
              <button
                onClick={() => handleFinancialAction("Loan Repayment")}
                className="w-full bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-blue-500/25"
              >
                Repay Now
              </button>
            </div>

            {/* Lending */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/30 rounded-xl p-6 hover:border-green-400 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-bold">Provide Lending</h3>
              </div>
              <p className="text-neutral-400 mb-6 text-sm">
                Lend your assets to earn interest based on your financial
                stability
              </p>
              <button
                onClick={() => handleFinancialAction("Lending")}
                className="w-full bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-green-500/25"
              >
                Start Lending
              </button>
            </div>

            {/* Borrowing */}
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-xl p-6 hover:border-purple-400 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold">Borrow Funds</h3>
              </div>
              <p className="text-neutral-400 mb-6 text-sm">
                Access loans with competitive rates based on your verified
                income
              </p>
              <button
                onClick={() => handleFinancialAction("Borrowing")}
                className="w-full bg-purple-500 hover:bg-purple-400 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-purple-500/25"
              >
                Apply for Loan
              </button>
            </div>

            {/* Approve Transactions */}
            <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-xl p-6 hover:border-orange-400 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-orange-500/20 rounded-lg group-hover:bg-orange-500/30 transition-colors">
                  <Shield className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold">Approve Transactions</h3>
              </div>
              <p className="text-neutral-400 mb-6 text-sm">
                Review and approve pending financial transactions securely
              </p>
              <button
                onClick={() => handleFinancialAction("Transaction Approval")}
                className="w-full bg-orange-500 hover:bg-orange-400 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-orange-500/25"
              >
                Review & Approve
              </button>
            </div>
          </div>
        )}

        {/* Information Section */}
        <div className="mt-12 bg-neutral-800 rounded-xl p-6 border border-neutral-700">
          <h3 className="text-xl font-bold mb-4">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="font-semibold mb-2">1. Upload Email</h4>
              <p className="text-sm text-neutral-400">
                Upload your .eml employment verification email with DKIM
                signature
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="font-semibold mb-2">2. ZK Verification</h4>
              <p className="text-sm text-neutral-400">
                Our system verifies your salary using zero-knowledge proofs
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="font-semibold mb-2">3. Access Services</h4>
              <p className="text-sm text-neutral-400">
                Use your verified income to access financial services privately
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
