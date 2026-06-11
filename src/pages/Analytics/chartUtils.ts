export const formatCompactCount = (count: number, locale: string): string => {
  if (count >= 1000) {
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(count / 1000)}k`
  }
  return String(count)
}

const polarToCartesian = (radius: number, angleDeg: number) => {
  const angleRad = (angleDeg * Math.PI) / 180
  return {
    x: 50 + radius * Math.cos(angleRad),
    y: 50 + radius * Math.sin(angleRad),
  }
}

export const buildDonutSegments = (
  segments: { percent: number; color: string }[],
): { d: string; color: string }[] => {
  const radius = 40
  const innerRadius = 28
  let cumulative = 0

  return segments.map(({ percent, color }) => {
    const startAngle = (cumulative / 100) * 360 - 90
    cumulative += percent
    const endAngle = (cumulative / 100) * 360 - 90

    const startOuter = polarToCartesian(radius, startAngle)
    const endOuter = polarToCartesian(radius, endAngle)
    const startInner = polarToCartesian(innerRadius, endAngle)
    const endInner = polarToCartesian(innerRadius, startAngle)
    const largeArc = percent > 50 ? 1 : 0

    const d = [
      `M ${startOuter.x} ${startOuter.y}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${endOuter.x} ${endOuter.y}`,
      `L ${startInner.x} ${startInner.y}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${endInner.x} ${endInner.y}`,
      'Z',
    ].join(' ')

    return { d, color }
  })
}
