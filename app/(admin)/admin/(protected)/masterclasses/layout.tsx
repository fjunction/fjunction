// app/(admin)/admin/(protected)/masterclasses/layout.tsx
export default function MasterclassesAdminLayout({ children }: { children: React.ReactNode }) {
    return (
      <div
        className="min-h-[calc(100vh-56px)] bg-white text-gray-900 [color-scheme:light]
          [&_input]:bg-white [&_input]:text-gray-900
          [&_textarea]:bg-white [&_textarea]:text-gray-900
          [&_select]:bg-white [&_select]:text-gray-900
          [&_::placeholder]:text-gray-400"
      >
        {children}
      </div>
    )
  }