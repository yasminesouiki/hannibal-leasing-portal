import { useState } from "react";
import BudgetBar from "../components/BudgetBar";
import MissionForm from "../components/MissionForm";
import DiversForm from "../components/DiversForm";
import MyExpensesList from "../components/MyExpensesList";
import "../components/AuthForm.css";
import "./UserExpensesPage.css";

const SECTIONS = [
  { key: "new", label: "Nouvelle demande" },
  { key: "history", label: "Mes demandes" },
];

const REQUEST_TYPES = [
  { key: "mission", label: "Ordre de mission" },
  { key: "divers", label: "Frais divers" },
];

const UserExpensesPage = () => {
  const [section, setSection] = useState("new");
  const [requestType, setRequestType] = useState("mission");
  const [confirmation, setConfirmation] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSubmitted = () => {
    setConfirmation("Votre demande a été envoyée à l'administrateur.");
    setRefreshKey((key) => key + 1);
    setTimeout(() => setConfirmation(""), 5000);
  };

  return (
    <div className="user-expenses-page">
      <h2>Notes de frais</h2>

      <BudgetBar mine />

      <div className="user-expenses-tabs">
        {SECTIONS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={
              section === tab.key
                ? "user-expenses-tab user-expenses-tab-active"
                : "user-expenses-tab"
            }
            onClick={() => setSection(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {section === "new" && (
        <section className="user-expenses-card">
          <div className="user-expenses-type-switch">
            {REQUEST_TYPES.map((type) => (
              <button
                key={type.key}
                type="button"
                className={
                  requestType === type.key
                    ? "user-expenses-type user-expenses-type-active"
                    : "user-expenses-type"
                }
                onClick={() => setRequestType(type.key)}
              >
                {type.label}
              </button>
            ))}
          </div>

          {confirmation && <div className="global-success">{confirmation}</div>}

          {requestType === "mission" ? (
            <MissionForm onSubmitted={handleSubmitted} />
          ) : (
            <DiversForm onSubmitted={handleSubmitted} />
          )}
        </section>
      )}

      {section === "history" && (
        <section className="user-expenses-card">
          <MyExpensesList refreshKey={refreshKey} />
        </section>
      )}
    </div>
  );
};

export default UserExpensesPage;
