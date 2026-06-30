/* eslint-disable no-undef */
// resources/js/pages/Backend/CMS/Section/components/modals/Editors/OurProgramsEditor.jsx

// React
import React, { useState, useEffect } from 'react';

// Icons
import { FaExternalLinkAlt, FaList } from 'react-icons/fa';

// Shared Components
import { NumberField } from './shared/Fields';

/**
 * OurProgramsEditor - Editor for OurProgramsSection data
 * This is a special section that displays programs from the Program Manager
 * Features:
 * - Shows information about the section
 * - Provides link to Program Manager for editing
 * - Displays preview of what will be shown
 * - Editable display limit
 * - Not editable directly for program data (read-only)
 */
const OurProgramsEditor = ({ section, hasData, onDataChange }) => {
  // ===== STATE MANAGEMENT =====
  // Get custom props for display settings
  const customProps = section?.custom_props || {};
  const [displayLimit, setDisplayLimit] = useState(customProps?.limit || 3);
  const [showFeatured, setShowFeatured] = useState(customProps?.showFeatured !== false);
  const [bgColor, setBgColor] = useState(customProps?.bgColor || 'bg-white');

  // Notify parent when display settings change
  useEffect(() => {
    if (onDataChange) {
      // Update custom props via the section data
      const updatedProps = {
        limit: displayLimit,
        showFeatured,
        bgColor,
      };
      // We need to update the section's custom_props
      // The parent (SectionEditModal) handles this via onDataChange
      // But we also need to update the custom_props in the section
      if (section) {
        section.custom_props = updatedProps;
        onDataChange({ custom_props: updatedProps });
      }
    }
  }, [displayLimit, showFeatured, bgColor, section, onDataChange]);

  // ===== HANDLERS =====
  const handleLimitChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setDisplayLimit(Math.max(1, value)); // Minimum 1
  };

  const handleShowFeaturedChange = (e) => {
    setShowFeatured(e.target.checked);
  };

  const handleBgColorChange = (e) => {
    setBgColor(e.target.value);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Our Programs Section</h3>

      {/* ===== DISPLAY SETTINGS ===== */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Display Settings</h4>

        <div className="space-y-3">
          {/* Display Limit - Number of programs to show */}
          <div>
            <NumberField
              label="Display Limit"
              value={displayLimit}
              onChange={handleLimitChange}
              placeholder="Number of programs to display"
            />
            <p className="text-xs text-gray-400 mt-1">
              How many programs to show on the frontend (minimum 1)
            </p>
          </div>

          {/* Show Featured First - Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showFeatured"
              checked={showFeatured}
              onChange={handleShowFeaturedChange}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="showFeatured" className="text-sm text-gray-700 font-medium">
              Show Featured Programs First
            </label>
            <span className="text-xs text-gray-400 ml-2">(Prioritize featured programs)</span>
          </div>

          {/* Background Color - Optional */}
          <div>
            <label className="block text-xs text-gray-400 mb-0.5">Background Color Class</label>
            <input
              type="text"
              value={bgColor}
              onChange={handleBgColorChange}
              placeholder="bg-white"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <p className="text-xs text-gray-400 mt-1">Tailwind CSS background color class (e.g., bg-white, bg-gray-50)</p>
          </div>
        </div>
      </div>

      {/* ===== INFO BOX: SPECIAL SECTION ===== */}
      {/* Explains that this is a special section managed by the Program Manager */}
      <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <FaList size={20} />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-800">Special Section</h4>
            <p className="text-sm text-blue-700 mt-1">
              This section displays programs from the <strong>Program Manager</strong>.
              It will show {displayLimit} program{displayLimit > 1 ? 's' : ''}
              {showFeatured ? ' (featured programs prioritized)' : ''}.
            </p>
            <p className="text-xs text-blue-600 mt-1">
              To add, edit, or remove programs, please go to the Program Manager.
            </p>
          </div>
        </div>
      </div>

      {/* ===== CURRENT SETTINGS ===== */}
      {/* Shows configuration details for this section */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Current Settings</h4>
        <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          {/* Display Limit - how many programs to show */}
          <div>
            <span className="text-xs text-gray-500">Display Limit</span>
            <p className="text-sm font-medium text-gray-700">{displayLimit} programs</p>
          </div>
          {/* Featured Priority - whether featured programs come first */}
          <div>
            <span className="text-xs text-gray-500">Featured Priority</span>
            <p className="text-sm font-medium text-gray-700">
              {showFeatured ? '✅ Featured first' : '❌ Not prioritized'}
            </p>
          </div>
          {/* Data Table */}
          <div>
            <span className="text-xs text-gray-500">Data Table</span>
            <p className="text-sm font-medium text-gray-700">{section.data_table || 'programs'}</p>
          </div>
          {/* Data Key */}
          <div>
            <span className="text-xs text-gray-500">Data Key</span>
            <p className="text-sm font-medium text-gray-700">{section.data_key || 'ourProgramsData'}</p>
          </div>
        </div>
      </div>

      {/* ===== AVAILABLE PROGRAMS PREVIEW ===== */}
      {/* Shows a preview of the programs that will be displayed */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Available Programs</h4>
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
          {hasData && section.data ? (
            <div className="space-y-2">
              {/* Program count */}
              <p className="text-xs text-gray-500">
                {Array.isArray(section.data) ? (
                  <>
                    <span className="font-medium">{section.data.length}</span> program
                    {section.data.length > 1 ? 's' : ''} available
                    {/* Show if limit is restricting display */}
                    {displayLimit && section.data.length > displayLimit && (
                      <span className="text-blue-600"> (showing {displayLimit} of {section.data.length})</span>
                    )}
                  </>
                ) : (
                  'Program data available'
                )}
              </p>
              {/* Program tags - show first N based on limit */}
              {Array.isArray(section.data) && section.data.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {section.data.slice(0, displayLimit || 3).map((program, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-xs bg-white px-2 py-1 rounded border border-gray-200"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      {program.title || `Program ${idx + 1}`}
                    </span>
                  ))}
                  {/* Show "+N more" if more programs exist beyond limit */}
                  {displayLimit && section.data.length > displayLimit && (
                    <span className="text-xs text-gray-400 px-2 py-1">
                      +{section.data.length - displayLimit} more
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            // Empty state - no programs
            <p className="text-sm text-gray-400">No programs available</p>
          )}
        </div>
      </div>

      {/* ===== ACTION BUTTON ===== */}
      {/* Navigates user to the Program Manager where they can edit */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            window.location.href = route('backend.cms.programs.index');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          <FaExternalLinkAlt size={14} />
          Go to Program Manager
        </button>
      </div>

      {/* ===== FOOTER NOTE ===== */}
      {/* Reminder that this section is read-only and where to make changes */}
      <div className="mt-3 text-xs text-gray-400 border-t border-gray-200 pt-3">
        <p>
          💡 <strong>Note:</strong> This section displays programs from the Program Manager.
          You cannot edit individual programs here. Use the settings above to control
          how many programs are shown and their order.
        </p>
        <p className="mt-1">
          📍 To manage programs, navigate to <strong>Program Manager</strong> in the sidebar.
        </p>
      </div>
    </div>
  );
};

export default OurProgramsEditor;