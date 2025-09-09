import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Download, Upload, X, FileSpreadsheet, Loader2 } from "lucide-react";

const REQUIRED_FIELDS = [
    "Username",
    "Full Name",
    "Email",
    "Gender",
    "Phone",
    "Address",
    "Role",
    "Status"
];

const ImportUserModal = ({ open, onClose, onUpload }) => {
    const [importError, setImportError] = useState("");
    const [fileData, setFileData] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleImportExcel = (e) => {
        setImportError("");
        const file = e.target.files[0];
        if (!file) return;

        setSelectedFile(file);

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const data = new Uint8Array(evt.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                setFileData(jsonData);
            } catch (err) {
                console.error(err);
                setImportError("File không hợp lệ hoặc lỗi khi đọc file.");
                setSelectedFile(null);
                setFileData(null);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setFileData(null);
    };

    const handleUploadUsers = async () => {
        setImportError("");

        if (!fileData) {
            setImportError("Vui lòng chọn file trước khi upload.");
            return;
        }

        // Validate required fields
        const missingFields = REQUIRED_FIELDS.filter(
            (field) => !Object.keys(fileData[0]).includes(field)
        );

        if (missingFields.length > 0) {
            setImportError(
                `File thiếu các cột bắt buộc: ${missingFields.join(", ")}`
            );
            return;
        }

        console.log(missingFields);
        setLoading(true);

        try {
            const users = fileData.map((row) => ({
                username: row["Username"] || "",
                fullname: row["Full Name"] || "",
                email: row["Email"] || "",
                gender: row["Gender"] || "",
                phone: row["Phone"] || "",
                address: row["Address"] || "",
                role: row["Role"] || "",
                status: row["Status"] || "",
            }));

            if (onUpload) {
                await onUpload({ users });
            }

            onClose();
            setSelectedFile(null);
            setFileData(null);
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            const errorMessage = err.response.data.message; // assuming the error message is in the response data
            setImportError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg relative animate-fadeIn">
                {/* Close button */}
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                    onClick={onClose}
                    disabled={loading}
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
                    <Download size={20} className="text-blue-600" />
                    Import người dùng từ Excel
                </h3>

                {/* File Input */}
                {!selectedFile && (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 text-gray-600 cursor-pointer hover:border-blue-400 transition">
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleImportExcel}
                            className="hidden"
                            disabled={loading}
                        />
                        <Download size={40} className="text-blue-500 mb-2" />
                        <span className="text-sm">
                            Chọn hoặc kéo file Excel vào đây
                        </span>
                    </label>
                )}

                {/* Hiển thị file đã chọn */}
                {selectedFile && (
                    <div className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg mt-2">
                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                            <FileSpreadsheet size={18} className="text-green-600" />
                            <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                        </div>
                        <button
                            onClick={handleRemoveFile}
                            className="text-red-500 hover:text-red-700"
                            disabled={loading}
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Error message */}
                {importError && (
                    <div className="mt-3 text-red-500 text-sm">{importError}</div>
                )}

                {/* File preview */}
                {fileData && (
                    <div className="mt-4 text-sm text-gray-700 max-h-40 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                        <p className="font-medium mb-2">
                            Đã tải {fileData.length} người dùng từ file:
                        </p>
                        <ul className="list-disc ml-4 space-y-1">
                            {fileData.slice(0, 5).map((row, idx) => (
                                <li key={idx}>
                                    {row["Full Name"] || JSON.stringify(row)}
                                </li>
                            ))}
                        </ul>
                        {fileData.length > 5 && (
                            <p className="text-xs text-gray-400 mt-2">
                                ... và {fileData.length - 5} người dùng khác
                            </p>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Đóng
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${fileData
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-blue-300 text-white cursor-not-allowed"
                            }`}
                        onClick={handleUploadUsers}
                        disabled={!fileData || loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Đang upload...
                            </>
                        ) : (
                            <>
                                <Upload size={16} />
                                Upload người dùng
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImportUserModal;
