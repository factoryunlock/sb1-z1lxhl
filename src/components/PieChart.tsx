import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { TokenAllocation, PieChartProps } from '../types/ChartTypes';

const PieChart: React.FC<PieChartProps> = ({ data, size = 400 }) => {
  const [selectedSlice, setSelectedSlice] = useState<string | null>(null);

  const padding = 160;
  const svgSize = size + padding * 2;
  const radius = size / 2;
  const centerPoint = svgSize / 2;

  const slicePaths = useMemo(() => {
    let currentAngle = 0;
    return data.map(item => {
      const angle = (item.percentage / 100) * 360;
      const startAngle = currentAngle;
      currentAngle += angle;
      
      return {
        ...item,
        startAngle,
        angle
      };
    });
  }, [data]);

  const handleSliceClick = (category: string) => {
    setSelectedSlice(category === selectedSlice ? null : category);
  };

  const createSlicePath = (startAngle: number, angle: number, isSelected: boolean) => {
    const scale = isSelected ? 1.1 : 1;
    
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = ((startAngle + angle) * Math.PI) / 180;
    
    const scaledRadius = radius * scale;
    
    const x1 = centerPoint + scaledRadius * Math.cos(startAngleRad);
    const y1 = centerPoint + scaledRadius * Math.sin(startAngleRad);
    const x2 = centerPoint + scaledRadius * Math.cos(endAngleRad);
    const y2 = centerPoint + scaledRadius * Math.sin(endAngleRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    return [
      `M ${centerPoint} ${centerPoint}`,
      `L ${x1} ${y1}`,
      `A ${scaledRadius} ${scaledRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
  };

  const renderSlices = () => {
    return (
      <>
        {/* First pass: render non-selected slices */}
        {slicePaths.map((item, index) => {
          const isSelected = selectedSlice === item.category;
          if (isSelected) return null;
          return (
            <motion.path
              key={item.category}
              d={createSlicePath(item.startAngle, item.angle, isSelected)}
              fill={item.color}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: { 
                  duration: 0.3,
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }
              }}
              whileHover={{ 
                scale: 1.05,
                transition: { 
                  duration: 0.2,
                  type: "spring",
                  stiffness: 300
                }
              }}
              onClick={() => handleSliceClick(item.category)}
              style={{ cursor: 'pointer' }}
              transition={{
                delay: index * 0.1,
                duration: 0.4
              }}
            />
          );
        })}
        {/* Second pass: render selected slice */}
        {slicePaths.map((item, index) => {
          const isSelected = selectedSlice === item.category;
          if (!isSelected) return null;
          return (
            <motion.path
              key={`selected-${item.category}`}
              d={createSlicePath(item.startAngle, item.angle, isSelected)}
              fill={item.color}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1.1,
                transition: { 
                  duration: 0.3,
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }
              }}
              whileHover={{ 
                scale: 1.1,
                transition: { 
                  duration: 0.2,
                  type: "spring",
                  stiffness: 300
                }
              }}
              onClick={() => handleSliceClick(item.category)}
              style={{ cursor: 'pointer' }}
              transition={{
                delay: index * 0.1,
                duration: 0.4
              }}
            />
          );
        })}
      </>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
      <div className="flex justify-center">
        <div className="relative" style={{ width: svgSize, height: svgSize }}>
          <svg width={svgSize} height={svgSize} className="transform-gpu">
            {renderSlices()}
          </svg>
        </div>
      </div>

      <div className="space-y-2">
        {data.map((item: TokenAllocation) => (
          <div
            key={item.category}
            className={`bg-gray-900 rounded-lg overflow-hidden transition-all duration-300 ${
              selectedSlice === item.category ? 'ring-2 ring-offset-2 ring-offset-gray-950 ring-' + item.color : ''
            }`}
          >
            <div
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-800"
              onClick={() => handleSliceClick(item.category)}
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-white text-lg font-medium">{item.category}</span>
                <span className="text-white text-lg">({item.percentage}%)</span>
              </div>
              {selectedSlice === item.category ? (
                <ChevronUp className="w-5 h-5 text-white" />
              ) : (
                <ChevronDown className="w-5 h-5 text-white" />
              )}
            </div>
            <AnimatePresence>
              {selectedSlice === item.category && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-4 pb-4"
                >
                  <p className="text-white text-base whitespace-pre-line">{item.details}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChart;