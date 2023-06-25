import { useParams } from "react-router-dom";

const FamilyPage: React.FC = () => {
  const { family_name } = useParams();

  return <>{family_name}</>;
};

export default FamilyPage;
