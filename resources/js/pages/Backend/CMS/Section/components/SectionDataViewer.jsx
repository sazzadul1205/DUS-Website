// resources/js/pages/Backend/CMS/Section/components/SectionDataViewer.jsx

import React, { useState } from 'react';
import { FaDatabase, FaChevronDown, FaChevronRight, FaCopy, FaCheck } from 'react-icons/fa';
import { showToast } from '../utils/toastHelper';

const SectionDataViewer = ({ section, hasSectionData }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!section) return null;

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const copyToClipboard = (data) => {
    const jsonString = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true);
      showToast('success', '✅ Copied!', 'Data copied to clipboard.', 1500);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      showToast('error', '❌ Failed', 'Could not copy data.', 2000);
    });
  };

  // Helper to format data for display
  const formatData = (data) => {
    if (!data) return null;
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    }
    return data;
  };

  const formattedData = formatData(section.data);

  // Helper to get data type label
  const getDataTypeLabel = (data) => {
    if (!data) return 'No Data';
    if (Array.isArray(data)) return `Array (${data.length} items)`;
    if (typeof data === 'object') {
      const keys = Object.keys(data);
      if (keys.length === 0) return 'Empty Object';
      if (keys.includes('data') && Array.isArray(data.data)) {
        return `Object with Array (${data.data.length} items)`;
      }
      return `Object (${keys.length} fields)`;
    }
    return typeof data;
  };

  // Helper to get data preview
  const getDataPreview = (data) => {
    if (!data) return 'No data available';
    if (Array.isArray(data)) {
      if (data.length === 0) return 'Empty array';
      if (data.length <= 3) {
        return data.map(item => {
          if (typeof item === 'object') {
            return Object.keys(item).join(', ');
          }
          return String(item);
        }).join(', ');
      }
      return `${data.length} items`;
    }
    if (typeof data === 'object') {
      const keys = Object.keys(data);
      if (keys.length === 0) return 'Empty object';
      if (keys.includes('data') && Array.isArray(data.data)) {
        return `Data array with ${data.data.length} items`;
      }
      return keys.join(', ');
    }
    return String(data).substring(0, 100);
  };

  // Helper to get color based on data table
  const getDataTableColor = (table) => {
    const colors = {
      'custom_section_data': 'text-blue-600 bg-blue-50',
      'shared_data': 'text-green-600 bg-green-50',
      'blogs': 'text-purple-600 bg-purple-50',
      'programs': 'text-orange-600 bg-orange-50',
      'about_content': 'text-indigo-600 bg-indigo-50',
      'jobs': 'text-pink-600 bg-pink-50',
      'our_programs': 'text-teal-600 bg-teal-50',
    };
    return colors[table] || 'text-gray-600 bg-gray-50';
  };

  const dataTypeLabel = getDataTypeLabel(formattedData);
  const dataPreview = getDataPreview(formattedData);
  const dataTableColor = getDataTableColor(section.data_table);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
        onClick={toggleExpand}
      >
        <div className="flex items-center gap-3">
          <span className={`p-2 rounded-lg ${dataTableColor}`}>
            <FaDatabase size={14} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Section Data</span>
              {hasSectionData ? (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✓ Available</span>
              ) : (
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Empty</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{dataTypeLabel}</span>
              <span>•</span>
              <span className="truncate max-w-64">{dataPreview}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasSectionData && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(formattedData);
              }}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Copy data to clipboard"
            >
              {copied ? <FaCheck size={12} className="text-green-500" /> : <FaCopy size={12} />}
            </button>
          )}
          <span className="text-gray-400">
            {isExpanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
          </span>
        </div>
      </div>

      {/* Body - Expanded */}
      {isExpanded && (
        <div className="p-4 bg-white border-t border-gray-200">
          {hasSectionData ? (
            <div className="space-y-3">
              {/* Data Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Data Table</span>
                  <p className="font-medium text-gray-700 truncate">{section.data_table || 'None'}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Data Key</span>
                  <p className="font-medium text-gray-700 truncate">{section.data_key || 'None'}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Type</span>
                  <p className="font-medium text-gray-700">{dataTypeLabel}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Status</span>
                  <p className={`font-medium ${hasSectionData ? 'text-green-600' : 'text-gray-400'}`}>
                    {hasSectionData ? 'Has Data' : 'Empty'}
                  </p>
                </div>
              </div>

              {/* Data Content */}
              <div className="relative">
                <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-xs font-mono max-h-96">
                  {JSON.stringify(formattedData, (key, value) => {
                    // Handle large arrays - show summary
                    if (Array.isArray(value) && value.length > 100) {
                      return `[Array with ${value.length} items]`;
                    }
                    return value;
                  }, 2)}
                </pre>
                <button
                  onClick={() => copyToClipboard(formattedData)}
                  className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors text-xs flex items-center gap-1"
                >
                  {copied ? <FaCheck size={10} /> : <FaCopy size={10} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* Data Structure Info */}
              {Array.isArray(formattedData) && formattedData.length > 0 && (
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  <span className="font-medium">Structure:</span>{' '}
                  {Object.keys(formattedData[0] || {}).join(', ') || 'No keys'}
                </div>
              )}

              {/* Data Table Info */}
              {section.data_table && (
                <div className="text-xs text-gray-400 bg-gray-50 p-2 rounded flex items-center gap-2">
                  <span>📊</span>
                  <span>Data Source: <strong>{getDataTableDisplayLabel(section.data_table)}</strong></span>
                  {section.data_table === 'shared_data' && (
                    <span className="text-green-600">(Shared Data)</span>
                  )}
                  {section.data_table === 'custom_section_data' && (
                    <span className="text-blue-600">(Custom Data)</span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <FaDatabase size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No data available for this section</p>
              <p className="text-xs mt-1">Data will appear here once the section has content</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper function to get display label for data table
const getDataTableDisplayLabel = (table) => {
  if (!table) return 'None';
  const labels = {
    'custom_section_data': 'Custom Data',
    'shared_data': 'Shared Data',
    'blogs': 'Blogs',
    'programs': 'Programs',
    'about_content': 'About Content',
    'jobs': 'Jobs',
    'our_programs': 'Our Programs',
  };
  return labels[table] || table;
};

export default SectionDataViewer;