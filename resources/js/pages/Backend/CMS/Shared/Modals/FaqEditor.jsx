// resources/js/pages/Backend/CMS/Shared/Modals/FaqEditor.jsx

import { FaPlus, FaTrash } from 'react-icons/fa6';

export default function FaqEditor({ formData, updateFormData, addArrayItem, removeArrayItem }) {
  return (
    <div className="space-y-4 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div>
          <label className="block text-sm font-medium text-gray-700">Section Title</label>
          <input
            type="text"
            value={formData.section?.title || ''}
            onChange={(e) => updateFormData('section.title', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Section Subtitle</label>
          <input
            type="text"
            value={formData.section?.subtitle || ''}
            onChange={(e) => updateFormData('section.subtitle', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <h3 className="font-semibold text-lg">FAQ Items</h3>
      {(formData.faqs || []).map((faq, index) => (
        <div key={faq.id || index} className="bg-gray-50 p-4 rounded-lg space-y-3 border-l-4 border-blue-300 w-full">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">FAQ #{index + 1}</span>
            <button
              type="button"
              onClick={() => removeArrayItem('faqs', index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition shrink-0"
            >
              <FaTrash size={14} />
            </button>
          </div>
          <input
            type="text"
            value={faq.question || ''}
            onChange={(e) => updateFormData(`faqs.${index}.question`, e.target.value)}
            placeholder="Question"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={faq.answer || ''}
            onChange={(e) => updateFormData(`faqs.${index}.answer`, e.target.value)}
            placeholder="Answer"
            rows={2}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => addArrayItem('faqs', { id: Date.now(), question: '', answer: '' })}
        className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
      >
        <FaPlus size={14} /> Add FAQ
      </button>
    </div>
  );
}