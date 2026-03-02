import { useStore } from '@/shared/stores/useStore'

export function Counter() {
  const { count, increment, decrement, reset } = useStore()

  return (
    <div className="text-center mb-8">
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Zustand + Tailwind CSS
      </p>
      <div className="text-6xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
        {count}
      </div>
      <div className="flex gap-4 justify-center">
        <button
          onClick={decrement}
          className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
        >
          -
        </button>
        <button
          onClick={reset}
          className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
        >
          Reset
        </button>
        <button
          onClick={increment}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
        >
          +
        </button>
      </div>
    </div>
  )
}
