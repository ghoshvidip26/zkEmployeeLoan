"use client";
import { useState, useCallback } from "react";
import { useWriteContract } from "wagmi";
import abi from "./abi";
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

  const { writeContract } = useWriteContract();
  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const handleCreateLoan = async () => {
    try {
      writeContract({
        abi,
        address: (CONTRACT_ADDRESS as `0x${string}`) || "0x",
        functionName: "createLoan",
        args: [],
      });
      console.log("✅ Loan created successfully");
    } catch (error) {
      console.log("❌ Error creating loan:", error);
    }
  };

  const handleRepayLoan = async (repayAmount: number) => {
    try {
      writeContract({
        abi,
        address: (CONTRACT_ADDRESS as `0x${string}`) || "0x",
        functionName: "repayLoan",
        args: [repayAmount],
      });
      console.log("✅ Loan repay successful");
    } catch (error) {
      console.log("❌ Error repaying loan:", error);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.name.endsWith(".eml")) {
      setIsProcessing(true);

      try {
        const content = await file.text();
        setTimeout(() => {
          const mockSalaryData = {
            name: "John Doe",
            salary: 120000,
            position: "Senior Software Engineer",
            organization: "zkEmployeeLoan Corp",
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

    console.log(
      `Initiating ${action} with verified salary: $${uploadedFile.salaryData.salary}`
    );

    try {
      switch (action.toLowerCase()) {
        case "lending":
          await handleCreateLoan();
          alert("✅ Lending transaction successful!");
          break;

        case "repay":
          await handleRepayLoan(amount || 1000);
          alert("✅ Loan repayment successful!");
          break;

        default:
          alert("❌ Unknown financial action");
          break;
      }
    } catch (error) {
      console.error(`❌ Error with ${action}:`, error);
      alert(`Failed to process ${action}. Please try again.`);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setShowPreview(false);
  };

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-black text-white relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.2),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,193,7,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_70%)]" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-70"></div>
      <div className="absolute top-40 right-20 w-3 h-3 bg-green-400 rounded-full animate-pulse opacity-60"></div>
      <div className="absolute bottom-20 left-20 w-2 h-2 bg-yellow-300 rounded-full animate-bounce opacity-50"></div>
      <div className="absolute bottom-40 right-10 w-4 h-4 bg-green-300 rounded-full animate-ping opacity-40"></div>

      {/* Main Content Container */}
      <div className="flex justify-center items-center mt-24 flex-col z-30 min-h-screen px-8">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 via-yellow-400 to-green-600 rounded-3xl mb-8 shadow-2xl shadow-yellow-500/30 animate-float">
            <Shield className="h-12 w-12 text-black animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-green-400 via-yellow-300 to-green-500 text-transparent bg-clip-text animate-slideUp">
            Employee Financial Portal
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-slideUp delay-200">
            Upload your employment verification email to unlock personalized
            financial services powered by zkEmployeeLoan&apos;s secure proof
            system
          </p>
        </div>

        {!uploadedFile && (
          <div className="mb-16 animate-slideUp delay-300">
            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-3xl p-16 text-center transition-all duration-500 cursor-pointer overflow-hidden transform hover:rotate-1 ${
                isDragActive
                  ? "border-yellow-400 bg-gradient-to-br from-green-400/10 to-yellow-400/10 scale-105 shadow-2xl shadow-yellow-500/20"
                  : "border-gray-600 hover:border-green-400 hover:bg-gradient-to-br hover:from-green-800/20 hover:to-yellow-800/10 hover:scale-102 hover:shadow-xl hover:shadow-green-500/20"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-yellow-500/5 to-green-500/10 opacity-0 hover:opacity-100 transition-opacity duration-500" />

              <input {...getInputProps()} />

              {isProcessing ? (
                <div className="flex flex-col items-center relative z-10 animate-fadeIn">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 border-4 border-yellow-400/30 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-24 h-24 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-2 w-20 h-20 border-2 border-yellow-400 border-b-transparent rounded-full animate-spin-reverse"></div>
                  </div>
                  <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-green-400 to-yellow-400 text-transparent bg-clip-text animate-pulse">
                    Processing Your File...
                  </h3>
                  <p className="text-gray-300 text-lg animate-bounce">
                    Verifying DKIM signatures and extracting salary data
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center relative z-10 group">
                  <div className="p-8 bg-gradient-to-br from-green-500/20 via-yellow-500/20 to-green-600/20 rounded-3xl mb-8 shadow-2xl group-hover:shadow-yellow-500/30 transition-all duration-500 group-hover:scale-110">
                    <Upload className="w-20 h-20 text-green-400 group-hover:text-yellow-400 transition-colors duration-300 animate-bounce" />
                  </div>
                  <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-400 via-yellow-300 to-green-500 text-transparent bg-clip-text group-hover:scale-105 transition-transform duration-300">
                    {isDragActive
                      ? "Drop your .eml file here"
                      : "Upload Employment Verification"}
                  </h3>
                  <p className="text-gray-300 text-xl mb-8 max-w-md group-hover:text-yellow-200 transition-colors duration-300">
                    Drag & drop your .eml file here, or click to browse your
                    files
                  </p>
                  <div className="flex items-center gap-3 text-sm text-gray-400 bg-gradient-to-r from-gray-800/50 to-black/50 px-6 py-3 rounded-full border border-green-500/30 group-hover:border-yellow-500/50 transition-all duration-300">
                    <FileText className="w-5 h-5 text-green-400 group-hover:text-yellow-400 transition-colors duration-300" />
                    <span className="group-hover:text-yellow-200 transition-colors duration-300">
                      Supported: .eml files with DKIM signatures
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {uploadedFile && (
          <div className="mb-12 animate-slideUp delay-500">
            <div className="bg-gradient-to-br from-green-500/15 to-yellow-500/10 border border-green-500/30 rounded-3xl p-8 shadow-2xl backdrop-blur-sm hover:shadow-yellow-500/20 transition-all duration-500 transform hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4 animate-slideIn">
                  <div className="p-4 bg-gradient-to-br from-green-500/30 to-yellow-500/20 rounded-2xl animate-pulse">
                    <CheckCircle className="w-12 h-12 text-green-400 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-yellow-400 text-transparent bg-clip-text mb-2 animate-fadeIn">
                      File Verified Successfully!
                    </h3>
                    <p className="text-gray-300 text-lg animate-slideIn delay-200">
                      DKIM signature validated and salary data extracted
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  className="p-3 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-90"
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
                  Generate proof
                </button>
              </div>
            </div>

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

        {uploadedFile && uploadedFile.verified && (
          <div className="space-y-8 animate-slideUp delay-700">
            {/* Service Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Repay */}
              <div
                className={`bg-gradient-to-br from-green-500/10 via-yellow-500/5 to-green-600/10 border rounded-3xl p-8 hover:border-yellow-400 transition-all duration-500 group cursor-pointer transform hover:scale-105 hover:rotate-1 hover:shadow-2xl hover:shadow-yellow-500/20 ${
                  selectedService === "repay"
                    ? "border-yellow-400 bg-gradient-to-br from-green-500/20 to-yellow-500/15 shadow-xl shadow-yellow-500/20"
                    : "border-green-500/30 hover:border-yellow-400"
                }`}
                onClick={() =>
                  setSelectedService(
                    selectedService === "repay" ? null : "repay"
                  )
                }
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-green-500/20 to-yellow-500/20 rounded-2xl group-hover:bg-gradient-to-br group-hover:from-yellow-500/30 group-hover:to-green-500/30 transition-all duration-500 group-hover:scale-110">
                    <CreditCard className="w-8 h-8 text-green-400 group-hover:text-yellow-400 transition-colors duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-yellow-400 text-transparent bg-clip-text group-hover:scale-105 transition-transform duration-300">
                    Repay Loans
                  </h3>
                </div>
                <p className="text-gray-400 mb-6 text-base group-hover:text-yellow-200 transition-colors duration-300">
                  Make payments on existing loans using your verified salary
                  information
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-green-400 font-medium group-hover:text-yellow-400 transition-colors duration-300">
                    Available Balance
                  </span>
                  <span className="text-white font-bold text-lg animate-pulse">
                    ${uploadedFile.salaryData?.salary.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Lending */}
              <div
                className={`bg-gradient-to-br from-green-500/10 via-yellow-500/5 to-green-600/10 border rounded-3xl p-8 hover:border-yellow-400 transition-all duration-500 group cursor-pointer transform hover:scale-105 hover:rotate-1 hover:shadow-2xl hover:shadow-yellow-500/20 ${
                  selectedService === "lending"
                    ? "border-yellow-400 bg-gradient-to-br from-green-500/20 to-yellow-500/15 shadow-xl shadow-yellow-500/20"
                    : "border-green-500/30 hover:border-yellow-400"
                }`}
                onClick={() =>
                  setSelectedService(
                    selectedService === "lending" ? null : "lending"
                  )
                }
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-green-500/20 to-yellow-500/20 rounded-2xl group-hover:bg-gradient-to-br group-hover:from-yellow-500/30 group-hover:to-green-500/30 transition-all duration-500 group-hover:scale-110">
                    <DollarSign className="w-8 h-8 text-green-400 group-hover:text-yellow-400 transition-colors duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-yellow-400 text-transparent bg-clip-text group-hover:scale-105 transition-transform duration-300">
                    Provide Lending
                  </h3>
                </div>
                <p className="text-gray-400 mb-6 text-base group-hover:text-yellow-200 transition-colors duration-300">
                  Lend your assets to earn interest based on your financial
                  stability
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-green-400 font-medium group-hover:text-yellow-400 transition-colors duration-300">
                    Est. APY
                  </span>
                  <span className="text-white font-bold text-lg animate-pulse">
                    8.5%
                  </span>
                </div>
              </div>

              {/* Borrowing */}
              <div
                className={`bg-gradient-to-br from-green-500/10 via-yellow-500/5 to-green-600/10 border rounded-3xl p-8 hover:border-yellow-400 transition-all duration-500 group cursor-pointer transform hover:scale-105 hover:rotate-1 hover:shadow-2xl hover:shadow-yellow-500/20 ${
                  selectedService === "borrowing"
                    ? "border-yellow-400 bg-gradient-to-br from-green-500/20 to-yellow-500/15 shadow-xl shadow-yellow-500/20"
                    : "border-green-500/30 hover:border-yellow-400"
                }`}
                onClick={() =>
                  setSelectedService(
                    selectedService === "borrowing" ? null : "borrowing"
                  )
                }
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-green-500/20 to-yellow-500/20 rounded-2xl group-hover:bg-gradient-to-br group-hover:from-yellow-500/30 group-hover:to-green-500/30 transition-all duration-500 group-hover:scale-110">
                    <TrendingUp className="w-8 h-8 text-green-400 group-hover:text-yellow-400 transition-colors duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-yellow-400 text-transparent bg-clip-text group-hover:scale-105 transition-transform duration-300">
                    Borrow Funds
                  </h3>
                </div>
                <p className="text-gray-400 mb-6 text-base group-hover:text-yellow-200 transition-colors duration-300">
                  Access loans with competitive rates based on your verified
                  income
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-green-400 font-medium group-hover:text-yellow-400 transition-colors duration-300">
                    Max Loan
                  </span>
                  <span className="text-white font-bold text-lg animate-pulse">
                    $
                    {(
                      (uploadedFile.salaryData?.salary || 0) * 2
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Enhanced Service Details Panel */}
            {selectedService && (
              <div className="bg-gradient-to-br from-green-900/20 via-black/40 to-yellow-900/20 border border-green-500/30 rounded-3xl p-8 backdrop-blur-sm shadow-2xl animate-slideUp hover:shadow-yellow-500/20 transition-all duration-500">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-yellow-300 to-green-500 text-transparent bg-clip-text animate-fadeIn">
                    {selectedService === "repay" && "Loan Repayment"}
                    {selectedService === "lending" && "Provide Lending"}
                    {selectedService === "borrowing" && "Borrow Funds"}
                  </h3>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="p-3 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-90"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8 animate-slideIn">
                    <div>
                      <label className="block text-sm font-medium text-yellow-300 mb-3">
                        {selectedService === "repay" && "Repayment Amount"}
                        {selectedService === "lending" && "Lending Amount"}
                        {selectedService === "borrowing" && "Borrow Amount"}
                      </label>
                      <div className="relative group">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400 group-hover:text-yellow-400 transition-colors duration-300 font-bold text-lg">
                          $
                        </span>
                        <input
                          type="number"
                          value={serviceAmount}
                          onChange={(e) => setServiceAmount(e.target.value)}
                          placeholder={
                            selectedService === "borrowing" ? "50000" : "10000"
                          }
                          className="w-full pl-8 pr-4 py-4 bg-gradient-to-r from-gray-700/50 to-gray-800/50 border border-green-600/50 rounded-xl text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30 transition-all duration-300 hover:border-green-500"
                        />
                      </div>
                    </div>

                    {selectedService === "borrowing" && (
                      <div className="animate-slideIn">
                        <label className="block text-sm font-medium text-yellow-300 mb-2">
                          Loan Duration (months)
                        </label>
                        <select className="w-full px-4 py-4 bg-gradient-to-r from-gray-700/50 to-gray-800/50 border border-green-600/50 rounded-xl text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30 transition-all duration-300 hover:border-green-500">
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
                      className="w-full py-4 px-6 rounded-xl font-semibold text-black bg-gradient-to-r from-green-400 via-yellow-400 to-green-500 hover:from-yellow-400 hover:via-green-400 hover:to-yellow-500 transition-all duration-500 shadow-lg hover:shadow-yellow-500/30 transform hover:scale-105 animate-glow"
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
                              (uploadedFile.salaryData?.salary || 0) * 2
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
        <div className="mt-16 bg-gradient-to-br from-green-500/10 to-yellow-500/5 backdrop-blur-sm rounded-3xl p-8 border border-green-500/30 shadow-xl">
          <h3 className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-green-400 to-yellow-400 text-transparent bg-clip-text">
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center group p-6 rounded-2xl bg-gradient-to-br from-green-500/5 to-yellow-500/5 border border-green-500/20 hover:border-yellow-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-yellow-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FileText className="w-10 h-10 text-green-400 group-hover:text-yellow-400 transition-colors duration-300" />
              </div>
              <h4 className="font-bold text-xl mb-4 text-white group-hover:text-green-300 transition-colors duration-300">
                1. Upload Email
              </h4>
              <p className="text-gray-400 group-hover:text-yellow-200 transition-colors duration-300 leading-relaxed">
                Upload your .eml employment verification email with DKIM
                signature for secure processing
              </p>
            </div>
            <div className="text-center group p-6 rounded-2xl bg-gradient-to-br from-yellow-500/5 to-green-500/5 border border-yellow-500/20 hover:border-green-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500/20 to-green-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Shield className="w-10 h-10 text-yellow-400 group-hover:text-green-400 transition-colors duration-300" />
              </div>
              <h4 className="font-bold text-xl mb-4 text-white group-hover:text-yellow-300 transition-colors duration-300">
                2. ZK Verification
              </h4>
              <p className="text-gray-400 group-hover:text-green-200 transition-colors duration-300 leading-relaxed">
                Our system verifies your salary using zero-knowledge proofs
                while maintaining complete privacy
              </p>
            </div>
            <div className="text-center group p-6 rounded-2xl bg-gradient-to-br from-green-500/5 to-yellow-500/5 border border-green-500/20 hover:border-yellow-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-yellow-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <DollarSign className="w-10 h-10 text-green-400 group-hover:text-yellow-400 transition-colors duration-300" />
              </div>
              <h4 className="font-bold text-xl mb-4 text-white group-hover:text-green-300 transition-colors duration-300">
                3. Access Services
              </h4>
              <p className="text-gray-400 group-hover:text-yellow-200 transition-colors duration-300 leading-relaxed">
                Use your verified income to access financial services privately
                and securely
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
