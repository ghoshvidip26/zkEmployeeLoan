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
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [serviceAmount, setServiceAmount] = useState<string>("");

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

  const handleFinancialAction = async (action: string, amount?: number) => {
    if (!uploadedFile?.salaryData) {
      alert("Please upload and verify your employment email first.");
      return;
    }

    const walletAddress = "0x1234567890123456789012345678901234567890"; // This would come from wallet connection

    try {
      let endpoint = "";
      let requestData: any = {
        walletAddress,
        emailData: {
          containsSalaryInfo: true,
          salary: uploadedFile.salaryData.salary,
        },
      };

      switch (action.toLowerCase()) {
        case "lending":
          endpoint = "/api/financial/lending";
          requestData.amount = amount || uploadedFile.salaryData.salary / 12; // Monthly salary as default
          break;
        case "borrowing":
          endpoint = "/api/financial/borrowing";
          requestData.amount = amount || 50000; // Default borrowing amount
          requestData.duration = 12; // 12 months default
          break;
        case "loan repayment":
          endpoint = "/api/financial/repay";
          requestData.amount = amount || 1000; // Default repayment amount
          requestData.loanId = "LOAN_123456"; // This would be dynamic
          break;
        case "transaction approval":
          endpoint = "/api/financial/approve";
          requestData.transactionId = "TXN_" + Date.now();
          requestData.transactionType = "lending";
          requestData.amount = amount || 1000;
          break;
        default:
          alert("Unknown financial action");
          return;
      }

      console.log(
        `Initiating ${action} with verified salary: $${uploadedFile.salaryData.salary}`
      );

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`${action} request processed successfully! ${result.message}`);
        console.log("API Response:", result);
      } else {
        alert(`Error processing ${action}: ${result.error}`);
      }
    } catch (error) {
      console.error(`Error with ${action}:`, error);
      alert(`Failed to process ${action} request. Please try again.`);
    }
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
            Upload your employment verification email to unlock personalized
            financial services powered by zkVerify&apos;s secure proof system
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
                    Drag & drop your .eml file here, or click to browse your
                    files
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
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                      File Name
                    </p>
                  </div>
                  <p className="font-semibold text-white text-lg">
                    {uploadedFile.file.name}
                  </p>
                </div>
                <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50">
                  <div className="flex items-center gap-3 mb-2">
                    <Download className="w-5 h-5 text-green-400" />
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                      File Size
                    </p>
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
          <div className="space-y-8">
            {/* Service Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Repay */}
              <div
                className={`bg-gradient-to-br from-blue-500/10 to-blue-600/10 border rounded-2xl p-6 hover:border-blue-400 transition-all group cursor-pointer ${
                  selectedService === "repay"
                    ? "border-blue-400 bg-blue-500/20"
                    : "border-blue-500/30"
                }`}
                onClick={() =>
                  setSelectedService(
                    selectedService === "repay" ? null : "repay"
                  )
                }
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors">
                    <CreditCard className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold">Repay Loans</h3>
                </div>
                <p className="text-gray-400 mb-4 text-sm">
                  Make payments on existing loans using your verified salary
                  information
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-blue-400 font-medium">
                    Available Balance
                  </span>
                  <span className="text-white font-bold">
                    ${uploadedFile.salaryData?.salary.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Lending */}
              <div
                className={`bg-gradient-to-br from-green-500/10 to-emerald-600/10 border rounded-2xl p-6 hover:border-green-400 transition-all group cursor-pointer ${
                  selectedService === "lending"
                    ? "border-green-400 bg-green-500/20"
                    : "border-green-500/30"
                }`}
                onClick={() =>
                  setSelectedService(
                    selectedService === "lending" ? null : "lending"
                  )
                }
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition-colors">
                    <DollarSign className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold">Provide Lending</h3>
                </div>
                <p className="text-gray-400 mb-4 text-sm">
                  Lend your assets to earn interest based on your financial
                  stability
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-green-400 font-medium">Est. APY</span>
                  <span className="text-white font-bold">8.5%</span>
                </div>
              </div>

              {/* Borrowing */}
              <div
                className={`bg-gradient-to-br from-purple-500/10 to-purple-600/10 border rounded-2xl p-6 hover:border-purple-400 transition-all group cursor-pointer ${
                  selectedService === "borrowing"
                    ? "border-purple-400 bg-purple-500/20"
                    : "border-purple-500/30"
                }`}
                onClick={() =>
                  setSelectedService(
                    selectedService === "borrowing" ? null : "borrowing"
                  )
                }
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-colors">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold">Borrow Funds</h3>
                </div>
                <p className="text-gray-400 mb-4 text-sm">
                  Access loans with competitive rates based on your verified
                  income
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-purple-400 font-medium">Max Loan</span>
                  <span className="text-white font-bold">
                    ${(uploadedFile.salaryData?.salary * 2).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Service Details Panel */}
            {selectedService && (
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700 rounded-2xl p-8 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    {selectedService === "repay" && "Loan Repayment"}
                    {selectedService === "lending" && "Provide Lending"}
                    {selectedService === "borrowing" && "Borrow Funds"}
                  </h3>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {selectedService === "repay" && "Repayment Amount"}
                        {selectedService === "lending" && "Lending Amount"}
                        {selectedService === "borrowing" && "Borrow Amount"}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                          $
                        </span>
                        <input
                          type="number"
                          value={serviceAmount}
                          onChange={(e) => setServiceAmount(e.target.value)}
                          placeholder={
                            selectedService === "borrowing" ? "50000" : "10000"
                          }
                          className="w-full pl-8 pr-4 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                        />
                      </div>
                    </div>

                    {selectedService === "borrowing" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Loan Duration (months)
                        </label>
                        <select className="w-full px-4 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all">
                          <option value="6">6 months</option>
                          <option value="12">12 months</option>
                          <option value="24">24 months</option>
                          <option value="36">36 months</option>
                        </select>
                      </div>
                    )}

                    <button
                      onClick={() =>
                        handleFinancialAction(
                          selectedService,
                          parseFloat(serviceAmount) || undefined
                        )
                      }
                      className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all shadow-lg ${
                        selectedService === "repay"
                          ? "bg-blue-500 hover:bg-blue-400 hover:shadow-blue-500/25"
                          : selectedService === "lending"
                          ? "bg-green-500 hover:bg-green-400 hover:shadow-green-500/25"
                          : "bg-purple-500 hover:bg-purple-400 hover:shadow-purple-500/25"
                      }`}
                    >
                      {selectedService === "repay" && "Process Repayment"}
                      {selectedService === "lending" && "Start Lending"}
                      {selectedService === "borrowing" && "Apply for Loan"}
                    </button>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white mb-4">
                      Service Details
                    </h4>

                    {selectedService === "repay" && (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Current Balance:
                          </span>
                          <span className="text-white">$25,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Monthly Payment:
                          </span>
                          <span className="text-white">$2,100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Interest Rate:</span>
                          <span className="text-white">6.5% APR</span>
                        </div>
                      </div>
                    )}

                    {selectedService === "lending" && (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Expected APY:</span>
                          <span className="text-green-400">8.5%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Min. Amount:</span>
                          <span className="text-white">$1,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Lock Period:</span>
                          <span className="text-white">30 days</span>
                        </div>
                      </div>
                    )}

                    {selectedService === "borrowing" && (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Interest Rate:</span>
                          <span className="text-purple-400">6.5% APR</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Max Loan:</span>
                          <span className="text-white">
                            $
                            {(
                              uploadedFile.salaryData?.salary * 2
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Collateral:</span>
                          <span className="text-green-400">Not Required</span>
                        </div>
                      </div>
                    )}

                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-medium">
                          Salary Verified
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">
                        Your income verification allows for preferential rates
                        and terms.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
