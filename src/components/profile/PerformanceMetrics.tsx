
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PerformanceData {
  month: string;
  rating: number;
  wins: number;
  losses: number;
}

interface PerformanceMetricsProps {
  performanceData: PerformanceData[];
}

const PerformanceMetrics = ({ performanceData }: PerformanceMetricsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>
          Track your rating and match results over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ChartContainer 
            config={{
              rating: { color: "#ff7e1d" },
              wins: { color: "#4a90e2" },
              losses: { color: "#e57373" }
            }}
          >
            <AreaChart
              data={performanceData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area 
                type="monotone" 
                dataKey="rating" 
                stroke="#ff7e1d" 
                fillOpacity={0.3} 
                fill="#ff7e1d" 
                name="Rating"
              />
            </AreaChart>
          </ChartContainer>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Match History</h3>
          <Table>
            <TableCaption>Your recent match results</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Wins</TableHead>
                <TableHead>Losses</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {performanceData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell>{data.month}</TableCell>
                  <TableCell>{data.rating}</TableCell>
                  <TableCell className="text-green-600">{data.wins}</TableCell>
                  <TableCell className="text-red-600">{data.losses}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
