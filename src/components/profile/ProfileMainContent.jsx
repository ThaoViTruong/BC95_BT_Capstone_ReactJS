import { PROFILE_TABS } from "../../utils/profile/profileUtils";
import ProfileInfoTab from "./ProfileInfoTab";
import ProfileTicketsTab from "./ProfileTicketsTab";

const ProfileTabButton = ({ isActive, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative px-2 py-3 text-sm font-semibold transition ${
      isActive ? "text-white" : "text-white/45 hover:text-white/70"
    }`}
  >
    {label}
    <span
      className={`absolute inset-x-0 bottom-0 h-0.5 rounded-full transition ${
        isActive ? "bg-red-500" : "bg-transparent"
      }`}
    />
  </button>
);

const ProfileMainContent = ({
  activeTab,
  setActiveTab,
  formik,
  updateUserMutation,
  paginatedTickets,
  ticketCount,
  selectedTicket,
  activeTicketPage,
  totalTicketPages,
  onSelectTicket,
  onPreviousPage,
  onNextPage,
  onSelectPage,
}) => (
  <section className="min-w-0">
    <div className="mb-4 flex items-center gap-6 border-b border-white/10 px-1 md:mb-5">
      <ProfileTabButton
        isActive={activeTab === PROFILE_TABS.info}
        label="Thông tin"
        onClick={() => setActiveTab(PROFILE_TABS.info)}
      />
      <ProfileTabButton
        isActive={activeTab === PROFILE_TABS.tickets}
        label="Lịch sử & Vé"
        onClick={() => setActiveTab(PROFILE_TABS.tickets)}
      />
    </div>
    {activeTab === PROFILE_TABS.info ? (
      <ProfileInfoTab
        formik={formik}
        updateUserMutation={updateUserMutation}
      />
    ) : (
      <ProfileTicketsTab
        tickets={paginatedTickets}
        ticketCount={ticketCount}
        selectedTicket={selectedTicket}
        onSelectTicket={onSelectTicket}
        activePage={activeTicketPage}
        totalPages={totalTicketPages}
        onPreviousPage={onPreviousPage}
        onNextPage={onNextPage}
        onSelectPage={onSelectPage}
      />
    )}
  </section>
);

export default ProfileMainContent;
