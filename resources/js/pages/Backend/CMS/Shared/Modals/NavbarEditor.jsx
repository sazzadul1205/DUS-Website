// resources/js/pages/Backend/CMS/Shared/Modals/NavbarEditor.jsx

import { FaPlus, FaTrash } from 'react-icons/fa6';

export default function NavbarEditor({ formData, updateFormData, addArrayItem, removeArrayItem }) {
  return (
    <div className="space-y-4 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div>
          <label className="block text-sm font-medium text-gray-700">Logo Src</label>
          <input
            type="text"
            value={formData.logo?.src || ''}
            onChange={(e) => updateFormData('logo.src', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Logo Alt Text</label>
          <input
            type="text"
            value={formData.logo?.alt || ''}
            onChange={(e) => updateFormData('logo.alt', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <h3 className="font-semibold text-lg">Navigation Links</h3>
      {(formData.navLinks || []).map((link, index) => (
        <div key={index} className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg w-full">
          <input
            type="text"
            value={link.name || ''}
            onChange={(e) => updateFormData(`navLinks.${index}.name`, e.target.value)}
            placeholder="Link Name"
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={link.href || ''}
            onChange={(e) => updateFormData(`navLinks.${index}.href`, e.target.value)}
            placeholder="URL"
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => removeArrayItem('navLinks', index)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition shrink-0"
          >
            <FaTrash size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addArrayItem('navLinks', { name: '', href: '/' })}
        className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
      >
        <FaPlus size={14} /> Add Nav Link
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 w-full">
        <div>
          <label className="block text-sm font-medium text-gray-700">CTA Button Text</label>
          <input
            type="text"
            value={formData.button?.text || ''}
            onChange={(e) => updateFormData('button.text', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">CTA Button URL</label>
          <input
            type="text"
            value={formData.button?.href || ''}
            onChange={(e) => updateFormData('button.href', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}