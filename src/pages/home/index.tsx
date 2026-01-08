import { Counter } from '@/features/counter'

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Alter Client
        </h1>

        <Counter />

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          Edit <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">src/pages/home/index.tsx</code> and save to test HMR
        </p>
      </div>
    </div>
  )
}

