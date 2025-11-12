import BrokerConnectionForm from "../components/BrokerConnectionForm";

export default function Dashboard() {
  const token = localStorage.getItem("token");

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Just include your content */}
      <BrokerConnectionForm token={token} />
    </div>
  );
}
