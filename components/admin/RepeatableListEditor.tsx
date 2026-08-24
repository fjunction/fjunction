// components/admin/RepeatableListEditor.tsx
'use client'

import { useState } from 'react'

type Field = {
  key: string
  label: string
  type?: 'text' | 'textarea' | 'select'
  options?: string[]
}

export function RepeatableListEditor<T extends Record<string, any>>({
  name,
  initialItems,
  fields,
  emptyItem,
}: {
  name: string
  initialItems: T[]
  fields: Field[]
  emptyItem: T
}) {
  const [items, setItems] = useState<T[]>(initialItems ?? [])

  function updateField(index: number, key: string, value: string) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)))
  }

  function addItem() {
    setItems((prev) => [...prev, { ...emptyItem }])
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={JSON.stringify(items)} />

      {items.map((item, index) => (
        <div key={index} className="rounded-lg border border-gray-200 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((field) => (
              <label key={field.key} className="block text-sm">
                <span className="mb-1 block font-medium text-gray-700">{field.label}</span>
                {field.type === 'textarea' ? (
                  <textarea
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    value={item[field.key] ?? ''}
                    onChange={(e) => updateField(index, field.key, e.target.value)}
                    rows={3}
                  />
                ) : field.type === 'select' ? (
                  <select
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    value={item[field.key] ?? ''}
                    onChange={(e) => updateField(index, field.key, e.target.value)}
                  >
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    value={item[field.key] ?? ''}
                    onChange={(e) => updateField(index, field.key, e.target.value)}
                  />
                )}
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="mt-3 text-sm font-medium text-red-600 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        + Add item
      </button>
    </div>
  )
}