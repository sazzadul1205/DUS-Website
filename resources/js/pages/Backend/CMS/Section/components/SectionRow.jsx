// resources/js/pages/Backend/CMS/Section/components/SectionRow.jsx

// React
import React from 'react';

// Icons
import {
  FaDatabase,
  FaToggleOn,
  FaToggleOff,
  FaChevronDown,
  FaChevronUp,
  FaGripVertical,
} from 'react-icons/fa';
import { BsStack } from 'react-icons/bs';

// Helpers
import { getComponentLabel, getDataTableLabel, getSectionTypeInfo } from '../utils/sectionHelpers';

const SectionRow = ({
  section,
  index,
  totalSections,
  isExpanded,
  isReordering,
  isSaving,
  isMovable,
  hasSectionData,
  dataSummary,
  onToggleExpand,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}) => {
  const typeInfo = getSectionTypeInfo(section);
  const isBanner = section.component === 'HomeBanner' || section.component === 'PageBannerSection';
  const rowBgClass = isBanner
    ? 'bg-yellow-50/50'
    : section.is_fixed_section
      ? 'bg-blue-50/30'
      : '';

  return (
    <React.Fragment>
      {/* Main Row */}
      <tr
        className={`hover:bg-gray-50 transition-colors cursor-pointer ${rowBgClass} ${isReordering ? 'opacity-75' : ''}`}
        draggable={isMovable}
        onDragStart={(e) => onDragStart(e, index)}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, index)}
      >
        {/* Index with Drag Handle */}
        <td className="px-4 py-3 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            {isMovable ? (
              <span
                className="cursor-grab text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
                title="Drag to reorder"
                onClick={(e) => e.stopPropagation()}
              >
                <FaGripVertical size={12} />
              </span>
            ) : (
              <span className="w-4" />
            )}
            <span>{index + 1}</span>
          </div>
        </td>

        {/* Section Key */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${section.is_enabled ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <BsStack className={section.is_enabled ? 'text-blue-600' : 'text-gray-400'} size={14} />
            </span>
            <span className="text-sm font-medium text-gray-900">{section.section_key}</span>
            {isBanner && (
              <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">⭐</span>
            )}
            {section.is_fixed_section && (
              <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">🔒</span>
            )}
          </div>
        </td>

        {/* Component */}
        <td className="px-4 py-3">
          <span className="text-sm text-gray-700">{getComponentLabel(section.component)}</span>
          <div className="text-xs text-gray-400">{section.component}</div>
        </td>

        {/* Data Source */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-1.5">
            <FaDatabase size={12} className="text-gray-400" />
            <span className="text-sm text-gray-700">{getDataTableLabel(section.data_table)}</span>
            {hasSectionData && (
              <span className="text-xs text-green-600 ml-1">✓</span>
            )}
            <span className="text-xs text-gray-400 ml-1">({dataSummary})</span>
          </div>
        </td>

        {/* Status */}
        <td className="px-4 py-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${section.is_enabled
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-500'
            }`}>
            {section.is_enabled ? <FaToggleOn size={12} /> : <FaToggleOff size={12} />}
            {section.is_enabled ? 'Active' : 'Inactive'}
          </span>
        </td>

        {/* Type */}
        <td className="px-4 py-3">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
            <span>{typeInfo.icon}</span>
            {typeInfo.label}
          </span>
        </td>

        {/* Order with Move Buttons */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp(index);
              }}
              disabled={index === 0 || !isMovable || isSaving}
              className={`p-1 rounded transition-all ${index === 0 || !isMovable || isSaving
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                }`}
              title={!isMovable ? 'Fixed section cannot be moved' : 'Move Up'}
            >
              ↑
            </button>
            <span className="text-sm text-gray-500">#{section.display_order}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown(index);
              }}
              disabled={index === totalSections - 1 || !isMovable || isSaving}
              className={`p-1 rounded transition-all ${index === totalSections - 1 || !isMovable || isSaving
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                }`}
              title={!isMovable ? 'Fixed section cannot be moved' : 'Move Down'}
            >
              ↓
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(section.id);
              }}
              className="ml-1 text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
            >
              {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </button>
          </div>
        </td>
      </tr>

      {/* Expanded Row - Data Details */}
      {isExpanded && (
        <tr>
          <td colSpan="7" className="px-4 py-4 bg-gray-50 border-t border-gray-100">
            <SectionDetails section={section} hasSectionData={hasSectionData} />
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};

// Sub-component for Section Details
const SectionDetails = ({ section, hasSectionData }) => (
  <div className="space-y-3">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
      <div>
        <span className="font-semibold text-gray-600">ID:</span>
        <span className="ml-2 text-gray-700">{section.id}</span>
      </div>
      <div>
        <span className="font-semibold text-gray-600">Section Key:</span>
        <span className="ml-2 text-gray-700">{section.section_key}</span>
      </div>
      <div>
        <span className="font-semibold text-gray-600">Data Table:</span>
        <span className="ml-2 text-gray-700">{section.data_table || 'None'}</span>
      </div>
      <div>
        <span className="font-semibold text-gray-600">Data Key:</span>
        <span className="ml-2 text-gray-700">{section.data_key || 'None'}</span>
      </div>
      <div>
        <span className="font-semibold text-gray-600">Prop Name:</span>
        <span className="ml-2 text-gray-700">{section.prop_name || 'Default'}</span>
      </div>
      <div>
        <span className="font-semibold text-gray-600">Fixed:</span>
        <span className={`ml-2 text-xs px-2 py-0.5 rounded ${section.is_fixed_section ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
          {section.is_fixed_section ? 'Yes' : 'No'}
        </span>
      </div>
      <div>
        <span className="font-semibold text-gray-600">Special:</span>
        <span className={`ml-2 text-xs px-2 py-0.5 rounded ${section.is_special_component ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
          {section.is_special_component ? 'Yes' : 'No'}
        </span>
      </div>
      <div>
        <span className="font-semibold text-gray-600">Created:</span>
        <span className="ml-2 text-gray-500 text-xs">
          {section.created_at ? new Date(section.created_at).toLocaleDateString() : 'N/A'}
        </span>
      </div>
    </div>

    {/* Custom Props */}
    {section.custom_props && Object.keys(section.custom_props).length > 0 && (
      <div>
        <span className="font-semibold text-gray-600 text-sm">Custom Props:</span>
        <pre className="mt-1 p-2 bg-white rounded border border-gray-200 overflow-x-auto text-xs text-gray-600 max-h-24">
          {JSON.stringify(section.custom_props, null, 2)}
        </pre>
      </div>
    )}

    {/* Section Data */}
    <div>
      <span className="font-semibold text-gray-600 text-sm flex items-center gap-2">
        <FaDatabase size={12} />
        Section Data:
        {hasSectionData ? (
          <span className="text-xs text-green-600">✓ Available</span>
        ) : (
          <span className="text-xs text-gray-400">No data available</span>
        )}
      </span>
      {hasSectionData && (
        <pre className="mt-1 p-2 bg-white rounded border border-gray-200 overflow-x-auto text-xs text-gray-600 max-h-48 overflow-y-auto">
          {JSON.stringify(section.data, null, 2)}
        </pre>
      )}
    </div>
  </div>
);

export default SectionRow;