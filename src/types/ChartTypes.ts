export interface TokenAllocation {
  category: string;
  percentage: number;
  color: string;
  details: string;
}

export interface PieChartProps {
  data: TokenAllocation[];
  size?: number;
}