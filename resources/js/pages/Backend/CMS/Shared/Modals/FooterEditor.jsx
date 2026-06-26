// resources/js/pages/Backend/CMS/Shared/Modals/FooterEditor.jsx

import { FaPlus, FaTrash } from 'react-icons/fa6';

export default function FooterEditor({ formData, updateFormData, addArrayItem, removeArrayItem }) {
  return (
    <div className="space-y-4 w-full">
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
        <label className="block text-sm font-medium text-gray-700">Footer Description</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => updateFormData('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div>
          <label className="block text-sm font-medium text-gray-700">Address Title</label>
          <input
            type="text"
            value={formData.address?.title || ''}
            onChange={(e) => updateFormData('address.title', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address Details</label>
          <input
            type="text"
            value={formData.address?.details || ''}
            onChange={(e) => updateFormData('address.details', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Title</label>
          <input
            type="text"
            value={formData.contact?.title || ''}
            onChange={(e) => updateFormData('contact.title', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Numbers (comma separated)</label>
          <input
            type="text"
            value={(formData.contact?.numbers || []).join(', ')}
            onChange={(e) => updateFormData('contact.numbers', e.target.value.split(',').map(s => s.trim()))}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <h3 className="font-semibold text-lg">Quick Links</h3>
      {(formData.quickLinks || []).map((link, index) => (
        <div key={index} className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg w-full">
          <input
            type="text"
            value={link.name || ''}
            onChange={(e) => updateFormData(`quickLinks.${index}.name`, e.target.value)}
            placeholder="Link Name"
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={link.url || ''}
            onChange={(e) => updateFormData(`quickLinks.${index}.url`, e.target.value)}
            placeholder="URL"
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => removeArrayItem('quickLinks', index)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition shrink-0"
          >
            <FaTrash size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addArrayItem('quickLinks', { name: '', url: '/' })}
        className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
      >
        <FaPlus size={14} /> Add Quick Link
      </button>

      <h3 className="font-semibold text-lg pt-4">Programs</h3>
      {(formData.programs || []).map((program, index) => (
        <div key={index} className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg w-full">
          <input
            type="text"
            value={program.name || ''}
            onChange={(e) => updateFormData(`programs.${index}.name`, e.target.value)}
            placeholder="Program Name"
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={program.url || ''}
            onChange={(e) => updateFormData(`programs.${index}.url`, e.target.value)}
            placeholder="URL"
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => removeArrayItem('programs', index)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition shrink-0"
          >
            <FaTrash size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addArrayItem('programs', { name: '', url: '/' })}
        className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
      >
        <FaPlus size={14} /> Add Program
      </button>

      <h3 className="font-semibold text-lg pt-4">Newsletter</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div>
          <label className="block text-sm font-medium text-gray-700">Newsletter Title</label>
          <input
            type="text"
            value={formData.newsletter?.title || ''}
            onChange={(e) => updateFormData('newsletter.title', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Button Text</label>
          <input
            type="text"
            value={formData.newsletter?.buttonText || ''}
            onChange={(e) => updateFormData('newsletter.buttonText', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Placeholder</label>
        <input
          type="text"
          value={formData.newsletter?.placeholder || ''}
          onChange={(e) => updateFormData('newsletter.placeholder', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <h3 className="font-semibold text-lg pt-4">Bottom Footer</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700">Copyright Text</label>
        <input
          type="text"
          value={formData.bottomFooter?.copyright || ''}
          onChange={(e) => updateFormData('bottomFooter.copyright', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}