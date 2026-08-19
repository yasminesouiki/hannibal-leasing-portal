import { useEffect, useState } from "react";
import {
  getMessageContacts,
  getInboxMessages,
  getSentMessages,
  sendMessage,
  markMessageRead,
  getFileUrl,
} from "../services/authService";
import "../components/AuthForm.css";
import "./Messagerie.css";

const TABS = [
  { key: "inbox", label: "Reçus" },
  { key: "sent", label: "Envoyés" },
];

const ROLE_LABELS = { admin: "Admin", rh: "RH", user: "Agent" };

const Messagerie = () => {
  const [activeTab, setActiveTab] = useState("inbox");
  const [contacts, setContacts] = useState([]);
  const [inbox, setInbox] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const [composing, setComposing] = useState(false);
  const [form, setForm] = useState({ recipientId: "", subject: "", body: "" });
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  const loadAll = async () => {
    try {
      const [contactsData, inboxData, sentData] = await Promise.all([
        getMessageContacts(),
        getInboxMessages(),
        getSentMessages(),
      ]);
      setContacts(contactsData.contacts);
      setInbox(inboxData.messages);
      setSent(sentData.messages);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Impossible de charger la messagerie");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleExpand = async (msg) => {
    const expanded = expandedId === msg.id;
    setExpandedId(expanded ? null : msg.id);

    if (!expanded && activeTab === "inbox" && !msg.is_read) {
      try {
        await markMessageRead(msg.id);
        setInbox((prev) => prev.map((m) => (m.id === msg.id ? { ...m, is_read: 1 } : m)));
      } catch {
        // pas bloquant si le marquage échoue
      }
    }
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAttachmentSelect = (e) => {
    setAttachmentFile(e.target.files?.[0] || null);
  };

  const handleReply = (msg) => {
    setSendError("");
    setForm({
      recipientId: String(msg.sender_id),
      subject: msg.subject.startsWith("Re: ") ? msg.subject : `Re: ${msg.subject}`,
      body: "",
    });
    setAttachmentFile(null);
    setComposing(true);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setSendError("");

    if (!form.recipientId || !form.subject || !form.body) {
      setSendError("Destinataire, objet et message sont requis");
      return;
    }

    setSending(true);
    try {
      await sendMessage({ ...form, attachmentFile });
      setForm({ recipientId: "", subject: "", body: "" });
      setAttachmentFile(null);
      setComposing(false);
      setActiveTab("sent");
      await loadAll();
    } catch (err) {
      setSendError(err.response?.data?.message || "Envoi impossible");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <p>Chargement...</p>;

  const messages = activeTab === "inbox" ? inbox : sent;

  return (
    <div className="messagerie">
      <div className="messagerie-header">
        <div className="messagerie-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={
                activeTab === tab.key
                  ? "messagerie-tab messagerie-tab-active"
                  : "messagerie-tab"
              }
              onClick={() => {
                setActiveTab(tab.key);
                setExpandedId(null);
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button type="button" className="form-button" onClick={() => setComposing((c) => !c)}>
          {composing ? "Annuler" : "Nouveau message"}
        </button>
      </div>

      {error && <div className="global-error">{error}</div>}

      {composing && (
        <form onSubmit={handleSend} noValidate className="messagerie-compose">
          {sendError && <div className="global-error">{sendError}</div>}

          <div className="form-group">
            <label className="form-label" htmlFor="recipientId">Destinataire</label>
            <select
              id="recipientId"
              name="recipientId"
              className="form-input"
              value={form.recipientId}
              onChange={handleFormChange}
            >
              <option value="">Sélectionner...</option>
              {contacts.map((c) => {
                const name = c.nom || c.prenom ? `${c.prenom} ${c.nom}` : c.email;
                const roleLabel = c.role === "user" ? c.poste || ROLE_LABELS.user : ROLE_LABELS[c.role] || c.role;
                return (
                  <option key={c.id} value={c.id}>
                    {name} ({roleLabel})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="subject">Objet</label>
            <input
              id="subject"
              name="subject"
              className="form-input"
              value={form.subject}
              onChange={handleFormChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="body">Message</label>
            <textarea
              id="body"
              name="body"
              className="form-input messagerie-textarea"
              rows={5}
              value={form.body}
              onChange={handleFormChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="attachment">Pièce jointe (optionnel)</label>
            <input id="attachment" type="file" onChange={handleAttachmentSelect} />
            {attachmentFile && <span className="messagerie-attachment-name">{attachmentFile.name}</span>}
          </div>

          <button type="submit" className="form-button" disabled={sending}>
            {sending ? "Envoi..." : "Envoyer"}
          </button>
        </form>
      )}

      {messages.length === 0 ? (
        <p>{activeTab === "inbox" ? "Aucun message reçu." : "Aucun message envoyé."}</p>
      ) : (
        <ul className="messagerie-list">
          {messages.map((msg) => {
            const expanded = expandedId === msg.id;
            const otherName =
              activeTab === "inbox"
                ? `${msg.sender_prenom || ""} ${msg.sender_nom || ""}`.trim() || msg.sender_email
                : `${msg.recipient_prenom || ""} ${msg.recipient_nom || ""}`.trim() || msg.recipient_email;

            return (
              <li key={msg.id} className="messagerie-card">
                <button
                  type="button"
                  className="messagerie-card-summary"
                  onClick={() => handleExpand(msg)}
                >
                  {activeTab === "inbox" && !msg.is_read && <span className="messagerie-unread-dot" />}
                  <span className="messagerie-card-contact">{otherName}</span>
                  <span className="messagerie-card-subject">{msg.subject}</span>
                  <span className="messagerie-card-date">
                    {new Date(msg.created_at).toLocaleString("fr-FR")}
                  </span>
                  <span className="expense-card-chevron">{expanded ? "▲" : "▼"}</span>
                </button>

                {expanded && (
                  <div className="messagerie-card-body">
                    <p className="messagerie-card-message">{msg.body}</p>
                    {msg.attachment && (
                      <a
                        href={getFileUrl(msg.attachment)}
                        target="_blank"
                        rel="noreferrer"
                        className="messagerie-attachment-link"
                      >
                        Pièce jointe
                      </a>
                    )}

                    {activeTab === "inbox" && (
                      <div className="messagerie-card-actions">
                        <button
                          type="button"
                          className="form-button"
                          onClick={() => handleReply(msg)}
                        >
                          Répondre
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Messagerie;
