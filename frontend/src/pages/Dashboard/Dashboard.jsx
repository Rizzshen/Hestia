import PageWrapper from "../../components/layout/PageWrapper";
import Button  from "../../components/ui/Button";
import Card from "../../components/ui/Card";

export default function Dashboard() {
  return (
    <PageWrapper title="Dashboard">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <Button variant="secondary" className="mt-4">
        Click Me
      </Button>
      <Card>Hi</Card>
    </PageWrapper>
  );
}
