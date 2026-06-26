// resources/js/pages/Backend/CMS/Shared/Modals/EventsEditor.jsx

import { FaPlus, FaTrash } from 'react-icons/fa6';

export default function EventsEditor({ formData, updateFormData, addArrayItem, removeArrayItem }) {
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
          <label className="block text-sm font-medium text-gray-700">Section Description</label>
          <textarea
            value={formData.section?.description || ''}
            onChange={(e) => updateFormData('section.description', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div>
          <label className="block text-sm font-medium text-gray-700">Button Text</label>
          <input
            type="text"
            value={formData.section?.button?.text || ''}
            onChange={(e) => updateFormData('section.button.text', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Button Link</label>
          <input
            type="text"
            value={formData.section?.button?.link || ''}
            onChange={(e) => updateFormData('section.button.link', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <h3 className="font-semibold text-lg">Events</h3>
      {(formData.events || []).map((event, index) => (
        <div key={event.id || index} className="bg-gray-50 p-4 rounded-lg space-y-3 border-l-4 border-green-300 w-full">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Event #{index + 1}</span>
            <button
              type="button"
              onClick={() => removeArrayItem('events', index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition shrink-0"
            >
              <FaTrash size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
            <input
              type="text"
              value={event.date?.day || ''}
              onChange={(e) => updateFormData(`events.${index}.date.day`, e.target.value)}
              placeholder="Day"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={event.date?.month || ''}
              onChange={(e) => updateFormData(`events.${index}.date.month`, e.target.value)}
              placeholder="Month"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={event.date?.weekday || ''}
              onChange={(e) => updateFormData(`events.${index}.date.weekday`, e.target.value)}
              placeholder="Weekday"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={event.date?.time || ''}
              onChange={(e) => updateFormData(`events.${index}.date.time`, e.target.value)}
              placeholder="Time"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <input
            type="text"
            value={event.location || ''}
            onChange={(e) => updateFormData(`events.${index}.location`, e.target.value)}
            placeholder="Location"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            value={event.title || ''}
            onChange={(e) => updateFormData(`events.${index}.title`, e.target.value)}
            placeholder="Event Title"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            value={event.description || ''}
            onChange={(e) => updateFormData(`events.${index}.description`, e.target.value)}
            placeholder="Description"
            rows={2}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            value={event.link || ''}
            onChange={(e) => updateFormData(`events.${index}.link`, e.target.value)}
            placeholder="Link URL"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => addArrayItem('events', {
          id: Date.now(),
          date: { day: '', month: '', weekday: '', time: '' },
          location: '',
          title: '',
          description: '',
          link: '/events/'
        })}
        className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
      >
        <FaPlus size={14} /> Add Event
      </button>
    </div>
  );
}