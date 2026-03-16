type Props = {
  onClick: () => void
  children?: string
}

export function LoadMoreButton(props: Props) {
  const { onClick, children = '더 보기' } = props

  return (
    <button
      type="button"
      className="mt-4 w-full py-2 rounded-xl border border-line-1 bg-bg-light font-pretendard text-3 text-text-80"
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default LoadMoreButton

