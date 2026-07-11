import { PROFILE_TABS } from "../../utils/profile/profileUtils";
import ProfileInfoTab from "./ProfileInfoTab";
import ProfileTicketsTab from "./ProfileTicketsTab";

const ProfileMainContent = ({
  activeTab,
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
