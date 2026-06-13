import Card from "./Card";

export default function StatCard({ label, value }) {
  return (
    <Card>
      {/* TODO: label - small uppercase muted text */}
      <div className="text-xs font-medium text-text-muted uppercase tracking-wide">{label}</div>
      <div className="text-2xl font-bold text-text mt-1">{value}</div>
      
      {/* TODO: value - large bold text */}
      
    </Card>
  );
}