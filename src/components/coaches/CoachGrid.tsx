
import { Coach } from "@/types/Coach";
import DetailedCoachCard from "./DetailedCoachCard";
import EmptyCoachResults from "./EmptyCoachResults";

interface CoachGridProps {
  coaches: Coach[];
  resetFilters: () => void;
}

const CoachGrid = ({ coaches, resetFilters }: CoachGridProps) => {
  if (coaches.length === 0) {
    return <EmptyCoachResults resetFilters={resetFilters} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {coaches.map(coach => (
        <div key={coach.id}>
          <DetailedCoachCard coach={coach} />
        </div>
      ))}
    </div>
  );
};

export default CoachGrid;
