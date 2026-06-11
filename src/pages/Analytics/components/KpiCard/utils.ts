export const buildSparklinePath = (
  values: number[],
  width: number,
  height: number,
): string => {
  if (values.length === 0) return ''

  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const stepX = width / Math.max(values.length - 1, 1)

  return values
    .map((value, index) => {
      const x = index * stepX
      const y = height - ((value - min) / range) * height
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
}
