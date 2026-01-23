'use client'

import { cn } from '@/lib/utils'

interface CalculatingBackgroundProps {
  className?: string
  intensity?: 'subtle' | 'moderate' | 'strong'
}

/**
 * CalculatingBackground - Animated numbers scrolling vertically
 * Creates a "calculating" effect with numbers, decimals, and arrows
 * 
 * Features:
 * - Multiple columns with mixed scroll directions
 * - Numbers, decimals, and arrows
 * - Full width coverage with no gaps
 * - Dense rows of numbers
 */

// Fixed arrays to prevent hydration errors - same on server and client
// Each item includes value and color class
type NumberItem = { value: string; color: 'slate' | 'teal' | 'navy' }

// Helper to create number items with alternating colors
const createNumberItem = (value: string, index: number): NumberItem => {
  const colors: Array<'slate' | 'teal' | 'navy'> = ['slate', 'teal', 'navy']
  return { value, color: colors[index % 3] }
}

// Generate large arrays of financial numbers (80-100 items each)
const generateColumnData = (baseItems: NumberItem[], additionalCount: number): NumberItem[] => {
  const additional: NumberItem[] = []
  const baseValues = [
    '15000', '35000', '65000', '85000', '105000', '155000', '175000', '195000', '225000',
    '2.10%', '2.65%', '3.15%', '3.85%', '4.35%', '4.95%', '5.85%', '6.15%', '6.95%', '7.85%', '8.35%', '9.15%',
    '10.25%', '11.35%', '12.45%', '13.55%', '14.65%', '15.75%', '16.85%', '17.95%', '18.05%', '19.15%', '20.25%',
    '21.35%', '22.45%', '23.55%', '24.65%', '25.75%', '26.85%', '27.95%', '28.05%', '29.15%', '30.25%',
    '31.35%', '32.45%', '33.55%', '34.65%', '35.75%', '36.85%', '37.95%', '38.05%', '39.15%', '40.25%',
    '41.35%', '42.45%', '43.55%', '44.65%', '45.75%', '46.85%', '47.95%', '48.05%', '49.15%', '50.25%',
    '+ 15.25', '+ 25.35', '+ 35.45', '+ 45.55', '+ 55.65', '+ 65.75', '+ 75.85', '+ 85.95', '+ 95.05',
    '- 10.15', '- 20.25', '- 30.35', '- 40.45', '- 50.55', '- 60.65', '- 70.75', '- 80.85', '- 90.95',
    '↑', '↓', '27000', '47000', '67000', '97000', '127000', '147000', '167000', '187000', '207000', '227000',
    '1.50%', '1.75%', '2.25%', '2.50%', '3.25%', '3.50%', '4.25%', '4.50%', '5.25%', '5.50%', '6.25%', '6.50%',
    '7.25%', '7.50%', '8.25%', '8.50%', '9.25%', '9.50%', '10.25%', '10.50%', '11.25%', '11.50%', '12.25%', '12.50%'
  ]
  
  for (let i = 0; i < additionalCount; i++) {
    const value = baseValues[i % baseValues.length]
    additional.push(createNumberItem(value, baseItems.length + i))
  }
  return [...baseItems, ...additional]
}

const COLUMN_1_BASE: NumberItem[] = [
  { value: '45.67', color: 'slate' },
  { value: '↑', color: 'teal' },
  { value: '50000', color: 'navy' },
  { value: '12.34', color: 'slate' },
  { value: '+ 23.45', color: 'teal' },
  { value: '↑', color: 'navy' },
  { value: '89012', color: 'slate' },
  { value: '3.21%', color: 'teal' },
  { value: '↓', color: 'navy' },
  { value: '67.89', color: 'slate' },
  { value: '23456', color: 'teal' },
  { value: '- 5.67', color: 'navy' },
  { value: '↑', color: 'slate' },
  { value: '8.90%', color: 'teal' },
  { value: '12345', color: 'navy' },
  { value: '56.78', color: 'slate' },
  { value: '↓', color: 'teal' },
  { value: '+ 34.56', color: 'navy' },
  { value: '78901', color: 'slate' },
  { value: '2.45%', color: 'teal' },
  { value: '25000', color: 'navy' },
  { value: '4.75%', color: 'slate' },
  { value: '↑', color: 'teal' },
  { value: '125000', color: 'navy' },
  { value: '6.25%', color: 'slate' },
  { value: '↓', color: 'teal' },
  { value: '75000', color: 'navy' },
  { value: '2.85%', color: 'slate' },
  { value: '↑', color: 'teal' },
  { value: '180000', color: 'navy' },
  { value: '5.50%', color: 'slate' },
  { value: '↓', color: 'teal' },
  { value: '32000', color: 'navy' },
  { value: '3.95%', color: 'slate' },
  { value: '↑', color: 'teal' },
  { value: '145000', color: 'navy' },
  { value: '7.15%', color: 'slate' },
  { value: '↓', color: 'teal' },
  { value: '55000', color: 'navy' },
  { value: '4.20%', color: 'slate' },
  { value: '↑', color: 'teal' },
  { value: '110000', color: 'navy' },
  { value: '6.80%', color: 'slate' },
  { value: '↓', color: 'teal' },
  { value: '28000', color: 'navy' },
  { value: '3.65%', color: 'slate' },
  { value: '↑', color: 'teal' },
  { value: '82000', color: 'navy' },
  { value: '5.25%', color: 'slate' },
  { value: '↓', color: 'teal' },
  { value: '135000', color: 'navy' },
  { value: '7.50%', color: 'slate' },
  { value: '↑', color: 'teal' },
  { value: '42000', color: 'navy' },
  { value: '4.10%', color: 'slate' },
]

const COLUMN_2_BASE: NumberItem[] = [
  { value: '78.90', color: 'teal' },
  { value: '↓', color: 'navy' },
  { value: '34567', color: 'slate' },
  { value: '9.12%', color: 'teal' },
  { value: '- 12.34', color: 'navy' },
  { value: '↑', color: 'slate' },
  { value: '45678', color: 'teal' },
  { value: '23.45', color: 'navy' },
  { value: '↓', color: 'slate' },
  { value: '6.78%', color: 'teal' },
  { value: '56789', color: 'navy' },
  { value: '+ 45.67', color: 'slate' },
  { value: '↑', color: 'teal' },
  { value: '34.56', color: 'navy' },
  { value: '12340', color: 'slate' },
  { value: '1.23%', color: 'teal' },
  { value: '↓', color: 'navy' },
  { value: '- 8.90', color: 'slate' },
  { value: '67890', color: 'teal' },
  { value: '11.22%', color: 'navy' },
  { value: '95000', color: 'slate' },
  { value: '↑', color: 'teal' },
  { value: '5.50%', color: 'navy' },
  { value: '↓', color: 'slate' },
  { value: '32000', color: 'teal' },
  { value: '3.95%', color: 'navy' },
  { value: '↑', color: 'slate' },
  { value: '145000', color: 'teal' },
  { value: '7.15%', color: 'navy' },
  { value: '↓', color: 'slate' },
  { value: '90000', color: 'teal' },
  { value: '4.50%', color: 'navy' },
  { value: '↑', color: 'slate' },
  { value: '165000', color: 'teal' },
  { value: '8.25%', color: 'navy' },
  { value: '↓', color: 'slate' },
  { value: '38000', color: 'teal' },
  { value: '3.40%', color: 'navy' },
  { value: '↑', color: 'slate' },
  { value: '112000', color: 'teal' },
  { value: '6.90%', color: 'navy' },
  { value: '↓', color: 'slate' },
  { value: '72000', color: 'teal' },
  { value: '5.15%', color: 'navy' },
  { value: '↑', color: 'slate' },
  { value: '198000', color: 'teal' },
  { value: '7.75%', color: 'navy' },
  { value: '↓', color: 'slate' },
  { value: '46000', color: 'teal' },
  { value: '4.30%', color: 'navy' },
]

const COLUMN_3_BASE: NumberItem[] = [
  { value: '90.12', color: 'navy' },
  { value: '↑', color: 'slate' },
  { value: '23450', color: 'teal' },
  { value: '4.56%', color: 'navy' },
  { value: '+ 67.89', color: 'slate' },
  { value: '↓', color: 'teal' },
  { value: '78923', color: 'navy' },
  { value: '45.67', color: 'slate' },
  { value: '↑', color: 'teal' },
  { value: '7.89%', color: 'navy' },
  { value: '34560', color: 'slate' },
  { value: '- 23.45', color: 'teal' },
  { value: '↓', color: 'navy' },
  { value: '56.78', color: 'slate' },
  { value: '12389', color: 'teal' },
  { value: '13.45%', color: 'navy' },
  { value: '↑', color: 'slate' },
  { value: '+ 90.12', color: 'teal' },
  { value: '45670', color: 'navy' },
  { value: '2.34%', color: 'slate' },
  { value: '55000', color: 'teal' },
  { value: '↓', color: 'navy' },
  { value: '4.20%', color: 'slate' },
  { value: '↑', color: 'teal' },
  { value: '110000', color: 'navy' },
  { value: '6.80%', color: 'slate' },
  { value: '↓', color: 'teal' },
  { value: '28000', color: 'navy' },
  { value: '3.65%', color: 'slate' },
  { value: '↑', color: 'teal' },
  { value: '152000', color: 'navy' },
  { value: '8.10%', color: 'slate' },
  { value: '↓', color: 'teal' },
  { value: '64000', color: 'navy' },
  { value: '4.85%', color: 'slate' },
  { value: '↑', color: 'teal' },
  { value: '178000', color: 'navy' },
  { value: '7.35%', color: 'slate' },
  { value: '↓', color: 'teal' },
  { value: '41000', color: 'navy' },
  { value: '3.55%', color: 'slate' },
  { value: '↑', color: 'teal' },
  { value: '129000', color: 'navy' },
  { value: '6.45%', color: 'slate' },
  { value: '↓', color: 'teal' },
  { value: '87000', color: 'navy' },
  { value: '5.60%', color: 'slate' },
]

const COLUMN_4_BASE: NumberItem[] = [
  { value: '67.34', color: 'slate' },
  { value: '↓', color: 'teal' },
  { value: '56780', color: 'navy' },
  { value: '5.67%', color: 'slate' },
  { value: '- 34.56', color: 'teal' },
  { value: '↑', color: 'navy' },
  { value: '89034', color: 'slate' },
  { value: '78.90', color: 'teal' },
  { value: '↓', color: 'navy' },
  { value: '9.01%', color: 'slate' },
  { value: '23467', color: 'teal' },
  { value: '+ 56.78', color: 'navy' },
  { value: '↑', color: 'slate' },
  { value: '12.34', color: 'teal' },
  { value: '67845', color: 'navy' },
  { value: '14.56%', color: 'slate' },
  { value: '↓', color: 'teal' },
  { value: '- 78.90', color: 'navy' },
  { value: '34589', color: 'slate' },
  { value: '3.45%', color: 'teal' },
  { value: '82000', color: 'navy' },
  { value: '↑', color: 'slate' },
  { value: '5.25%', color: 'teal' },
  { value: '↓', color: 'navy' },
  { value: '135000', color: 'slate' },
  { value: '7.50%', color: 'teal' },
  { value: '↑', color: 'navy' },
  { value: '42000', color: 'slate' },
  { value: '4.10%', color: 'teal' },
  { value: '↓', color: 'navy' },
  { value: '158000', color: 'slate' },
  { value: '8.40%', color: 'teal' },
  { value: '↑', color: 'navy' },
  { value: '53000', color: 'slate' },
  { value: '4.65%', color: 'teal' },
  { value: '↓', color: 'navy' },
  { value: '142000', color: 'slate' },
  { value: '7.20%', color: 'teal' },
  { value: '↑', color: 'navy' },
  { value: '69000', color: 'slate' },
  { value: '5.40%', color: 'teal' },
  { value: '↓', color: 'navy' },
  { value: '191000', color: 'slate' },
  { value: '8.60%', color: 'teal' },
  { value: '↑', color: 'navy' },
  { value: '37000', color: 'slate' },
  { value: '3.80%', color: 'teal' },
]

// Generate expanded columns with 80-100 items each
const COLUMN_1_DATA = generateColumnData(COLUMN_1_BASE, 45)
const COLUMN_2_DATA = generateColumnData(COLUMN_2_BASE, 45)
const COLUMN_3_DATA = generateColumnData(COLUMN_3_BASE, 45)
const COLUMN_4_DATA = generateColumnData(COLUMN_4_BASE, 45)

// Create 4 additional columns
const COLUMN_5_BASE: NumberItem[] = [
  { value: '33.45', color: 'teal' },
  { value: '↑', color: 'navy' },
  { value: '67000', color: 'slate' },
  { value: '5.25%', color: 'teal' },
  { value: '↓', color: 'navy' },
  { value: '98000', color: 'slate' },
  { value: '6.75%', color: 'teal' },
  { value: '↑', color: 'navy' },
  { value: '132000', color: 'slate' },
  { value: '7.85%', color: 'teal' },
  { value: '↓', color: 'navy' },
  { value: '49000', color: 'slate' },
  { value: '4.45%', color: 'teal' },
  { value: '↑', color: 'navy' },
  { value: '168000', color: 'slate' },
  { value: '8.55%', color: 'teal' },
  { value: '↓', color: 'navy' },
  { value: '51000', color: 'slate' },
  { value: '4.85%', color: 'teal' },
  { value: '↑', color: 'navy' },
  { value: '139000', color: 'slate' },
  { value: '7.65%', color: 'teal' },
  { value: '↓', color: 'navy' },
  { value: '61000', color: 'slate' },
  { value: '5.05%', color: 'teal' },
  { value: '↑', color: 'navy' },
  { value: '176000', color: 'slate' },
  { value: '8.75%', color: 'teal' },
  { value: '↓', color: 'navy' },
  { value: '44000', color: 'slate' },
  { value: '4.25%', color: 'teal' },
  { value: '↑', color: 'navy' },
  { value: '148000', color: 'slate' },
  { value: '7.95%', color: 'teal' },
  { value: '↓', color: 'navy' },
  { value: '58000', color: 'slate' },
  { value: '5.35%', color: 'teal' },
  { value: '↑', color: 'navy' },
  { value: '184000', color: 'slate' },
  { value: '8.95%', color: 'teal' },
  { value: '↓', color: 'navy' },
  { value: '39000', color: 'slate' },
  { value: '3.95%', color: 'teal' },
]

const COLUMN_6_BASE: NumberItem[] = [
  { value: '88.12', color: 'navy' },
  { value: '↓', color: 'slate' },
  { value: '102000', color: 'teal' },
  { value: '6.35%', color: 'navy' },
  { value: '↑', color: 'slate' },
  { value: '54000', color: 'teal' },
  { value: '5.15%', color: 'navy' },
  { value: '↓', color: 'slate' },
  { value: '156000', color: 'teal' },
  { value: '8.15%', color: 'navy' },
  { value: '↑', color: 'slate' },
  { value: '48000', color: 'teal' },
  { value: '4.55%', color: 'navy' },
  { value: '↓', color: 'slate' },
  { value: '162000', color: 'teal' },
  { value: '8.35%', color: 'navy' },
  { value: '↑', color: 'slate' },
  { value: '52000', color: 'teal' },
  { value: '4.95%', color: 'navy' },
  { value: '↓', color: 'slate' },
  { value: '172000', color: 'teal' },
  { value: '8.55%', color: 'navy' },
  { value: '↑', color: 'slate' },
  { value: '56000', color: 'teal' },
  { value: '5.45%', color: 'navy' },
  { value: '↓', color: 'slate' },
  { value: '188000', color: 'teal' },
  { value: '9.05%', color: 'navy' },
  { value: '↑', color: 'slate' },
  { value: '36000', color: 'teal' },
  { value: '3.75%', color: 'navy' },
  { value: '↓', color: 'slate' },
  { value: '202000', color: 'teal' },
  { value: '9.45%', color: 'navy' },
  { value: '↑', color: 'slate' },
  { value: '34000', color: 'teal' },
  { value: '3.55%', color: 'navy' },
  { value: '↓', color: 'slate' },
  { value: '218000', color: 'teal' },
  { value: '9.85%', color: 'navy' },
  { value: '↑', color: 'slate' },
  { value: '31000', color: 'teal' },
  { value: '3.35%', color: 'navy' },
]

const COLUMN_7_BASE: NumberItem[] = [
  { value: '22.78', color: 'slate' },
  { value: '↑', color: 'teal' },
  { value: '114000', color: 'navy' },
  { value: '6.55%', color: 'slate' },
  { value: '↓', color: 'teal' },
  { value: '62000', color: 'navy' },
  { value: '5.25%', color: 'slate' },
  { value: '↑', color: 'teal' },
  { value: '164000', color: 'navy' },
  { value: '8.25%', color: 'slate' },
  { value: '↓', color: 'teal' },
  { value: '50000', color: 'navy' },
  { value: '4.75%', color: 'slate' },
  { value: '↑', color: 'teal' },
  { value: '170000', color: 'navy' },
  { value: '8.45%', color: 'slate' },
  { value: '↓', color: 'teal' },
  { value: '54000', color: 'navy' },
  { value: '5.05%', color: 'slate' },
  { value: '↑', color: 'teal' },
  { value: '186000', color: 'navy' },
  { value: '9.15%', color: 'slate' },
  { value: '↓', color: 'teal' },
  { value: '40000', color: 'navy' },
  { value: '4.15%', color: 'slate' },
  { value: '↑', color: 'teal' },
  { value: '200000', color: 'navy' },
  { value: '9.35%', color: 'slate' },
  { value: '↓', color: 'teal' },
  { value: '33000', color: 'navy' },
  { value: '3.65%', color: 'slate' },
  { value: '↑', color: 'teal' },
  { value: '216000', color: 'navy' },
  { value: '9.75%', color: 'slate' },
  { value: '↓', color: 'teal' },
  { value: '29000', color: 'navy' },
  { value: '3.15%', color: 'slate' },
  { value: '↑', color: 'teal' },
  { value: '232000', color: 'navy' },
  { value: '10.15%', color: 'slate' },
  { value: '↓', color: 'teal' },
  { value: '26000', color: 'navy' },
  { value: '2.95%', color: 'slate' },
]

const COLUMN_8_BASE: NumberItem[] = [
  { value: '55.23', color: 'teal' },
  { value: '↓', color: 'navy' },
  { value: '118000', color: 'slate' },
  { value: '6.65%', color: 'teal' },
  { value: '↑', color: 'navy' },
  { value: '60000', color: 'slate' },
  { value: '5.35%', color: 'teal' },
  { value: '↓', color: 'navy' },
  { value: '160000', color: 'slate' },
  { value: '8.05%', color: 'teal' },
  { value: '↑', color: 'navy' },
  { value: '52000', color: 'slate' },
  { value: '4.85%', color: 'teal' },
  { value: '↓', color: 'navy' },
  { value: '174000', color: 'slate' },
  { value: '8.65%', color: 'teal' },
  { value: '↑', color: 'navy' },
  { value: '46000', color: 'slate' },
  { value: '4.35%', color: 'teal' },
  { value: '↓', color: 'navy' },
  { value: '192000', color: 'slate' },
  { value: '9.25%', color: 'teal' },
  { value: '↑', color: 'navy' },
  { value: '38000', color: 'slate' },
  { value: '3.85%', color: 'teal' },
  { value: '↓', color: 'navy' },
  { value: '210000', color: 'slate' },
  { value: '9.65%', color: 'teal' },
  { value: '↑', color: 'navy' },
  { value: '30000', color: 'slate' },
  { value: '3.25%', color: 'teal' },
  { value: '↓', color: 'navy' },
  { value: '228000', color: 'slate' },
  { value: '10.05%', color: 'teal' },
  { value: '↑', color: 'navy' },
  { value: '24000', color: 'slate' },
  { value: '2.75%', color: 'teal' },
  { value: '↓', color: 'navy' },
  { value: '246000', color: 'slate' },
  { value: '10.45%', color: 'teal' },
  { value: '↑', color: 'navy' },
  { value: '20000', color: 'slate' },
  { value: '2.55%', color: 'teal' },
]

const COLUMN_5_DATA = generateColumnData(COLUMN_5_BASE, 45)
const COLUMN_6_DATA = generateColumnData(COLUMN_6_BASE, 45)
const COLUMN_7_DATA = generateColumnData(COLUMN_7_BASE, 45)
const COLUMN_8_DATA = generateColumnData(COLUMN_8_BASE, 45)

export function CalculatingBackground({ 
  className,
  intensity = 'moderate'
}: CalculatingBackgroundProps) {
  const opacityMap = {
    subtle: 'opacity-[0.1]',
    moderate: 'opacity-[0.3]',
    strong: 'opacity-[0.4]'
  }

  const colorMap = {
    slate: 'text-slate-600',
    teal: 'text-teal-500',
    navy: 'text-navy'
  }

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none z-[1]', className)}>
      <div className={cn('relative w-full h-full', opacityMap[intensity])}>
        {/* Column 1 - Scrolls Up - left-[0%] */}
        <div className="absolute left-0 top-0 w-[13%] h-full overflow-hidden">
          <div className="scroll-numbers-up space-y-2">
            {[...COLUMN_1_DATA, ...COLUMN_1_DATA].map((item, i) => (
              <div key={`col1-${i}`} className={cn('text-xs font-mono whitespace-nowrap blur-[0.5px]', colorMap[item.color] || 'text-slate-600')}>
                {item.value}
              </div>
            ))}
          </div>
        </div>

        {/* Column 2 - Scrolls Down - left-[12.5%] */}
        <div className="absolute left-[12.5%] top-0 w-[13%] h-full overflow-hidden">
          <div className="scroll-numbers-down space-y-2">
            {[...COLUMN_2_DATA, ...COLUMN_2_DATA].map((item, i) => (
              <div key={`col2-${i}`} className={cn('text-xs font-mono whitespace-nowrap blur-[0.5px]', colorMap[item.color] || 'text-slate-600')}>
                {item.value}
              </div>
            ))}
          </div>
        </div>

        {/* Column 3 - Scrolls Up - left-[25%] */}
        <div className="absolute left-[25%] top-0 w-[13%] h-full overflow-hidden">
          <div className="scroll-numbers-up space-y-2" style={{ animationDuration: '35s' }}>
            {[...COLUMN_3_DATA, ...COLUMN_3_DATA].map((item, i) => (
              <div key={`col3-${i}`} className={cn('text-xs font-mono whitespace-nowrap blur-[0.5px]', colorMap[item.color] || 'text-slate-600')}>
                {item.value}
              </div>
            ))}
          </div>
        </div>

        {/* Column 4 - Scrolls Down - left-[37.5%] */}
        <div className="absolute left-[37.5%] top-0 w-[13%] h-full overflow-hidden">
          <div className="scroll-numbers-down space-y-2" style={{ animationDuration: '25s' }}>
            {[...COLUMN_4_DATA, ...COLUMN_4_DATA].map((item, i) => (
              <div key={`col4-${i}`} className={cn('text-xs font-mono whitespace-nowrap blur-[0.5px]', colorMap[item.color] || 'text-slate-600')}>
                {item.value}
              </div>
            ))}
          </div>
        </div>

        {/* Column 5 - Scrolls Up - left-[50%] */}
        <div className="absolute left-[50%] top-0 w-[13%] h-full overflow-hidden">
          <div className="scroll-numbers-up space-y-2" style={{ animationDuration: '32s' }}>
            {[...COLUMN_5_DATA, ...COLUMN_5_DATA].map((item, i) => (
              <div key={`col5-${i}`} className={cn('text-xs font-mono whitespace-nowrap blur-[0.5px]', colorMap[item.color] || 'text-slate-600')}>
                {item.value}
              </div>
            ))}
          </div>
        </div>

        {/* Column 6 - Scrolls Down - left-[62.5%] */}
        <div className="absolute left-[62.5%] top-0 w-[13%] h-full overflow-hidden">
          <div className="scroll-numbers-down space-y-2" style={{ animationDuration: '28s' }}>
            {[...COLUMN_6_DATA, ...COLUMN_6_DATA].map((item, i) => (
              <div key={`col6-${i}`} className={cn('text-xs font-mono whitespace-nowrap blur-[0.5px]', colorMap[item.color] || 'text-slate-600')}>
                {item.value}
              </div>
            ))}
          </div>
        </div>

        {/* Column 7 - Scrolls Up - left-[75%] */}
        <div className="absolute left-[75%] top-0 w-[13%] h-full overflow-hidden">
          <div className="scroll-numbers-up space-y-2" style={{ animationDuration: '38s' }}>
            {[...COLUMN_7_DATA, ...COLUMN_7_DATA].map((item, i) => (
              <div key={`col7-${i}`} className={cn('text-xs font-mono whitespace-nowrap blur-[0.5px]', colorMap[item.color] || 'text-slate-600')}>
                {item.value}
              </div>
            ))}
          </div>
        </div>

        {/* Column 8 - Scrolls Down - left-[87.5%] */}
        <div className="absolute left-[87.5%] top-0 w-[13%] h-full overflow-hidden">
          <div className="scroll-numbers-down space-y-2" style={{ animationDuration: '22s' }}>
            {[...COLUMN_8_DATA, ...COLUMN_8_DATA].map((item, i) => (
              <div key={`col8-${i}`} className={cn('text-xs font-mono whitespace-nowrap blur-[0.5px]', colorMap[item.color] || 'text-slate-600')}>
                {item.value}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
