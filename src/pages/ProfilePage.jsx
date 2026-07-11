import LoadingSpinner from "../components/LoadingSpinner";
import ProfileMainContent from "../components/profile/ProfileMainContent";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import TicketDetailModal from "../components/profile/TicketDetailModal";
import { useProfilePageState } from "../hooks/profile/useProfilePageState";

const ProfilePage = () => {
  const {
    profile,
    isLoading,
    isError,
    activeTab,
    setActiveTab,
    setSelectedTicketId,
    setCurrentTicketPage,
    ticketCount,
    latestTicket,
    totalTicketPages,
    activeTicketPage,
    paginatedTickets,
    selectedTicket,
    formik,
    updateUserMutation,
  } = useProfilePageState();

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/70">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="min-h-screen bg-[#050d26] px-4 py-16 text-white">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-white/10 bg-[#10151f]/95 px-6 py-12 text-center">
          <h1 className="text-3xl font-bold">
            Không thể tải thông tin cá nhân
          </h1>
          <p className="mt-4 text-white/60">
            Vui lòng thử lại sau hoặc đăng nhập lại để tiếp tục.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(220,38,38,0.18),_transparent_28%),linear-gradient(135deg,#07080b_0%,#0a0d12_45%,#0b1018_100%)] text-white">
      <div className="mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-8">
        <div className="mb-4 hidden xl:block">
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">
            Thông tin khách hàng
          </h1>
        </div>
        <div className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)] xl:gap-5">
          <ProfileSidebar
            profile={profile}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            ticketCount={ticketCount}
            latestTicket={latestTicket}
          />

          <ProfileMainContent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            formik={formik}
            updateUserMutation={updateUserMutation}
            paginatedTickets={paginatedTickets}
            ticketCount={ticketCount}
            selectedTicket={selectedTicket}
            activeTicketPage={activeTicketPage}
            totalTicketPages={totalTicketPages}
            onSelectTicket={setSelectedTicketId}
            onPreviousPage={() =>
              setCurrentTicketPage((page) => Math.max(page - 1, 1))
            }
            onNextPage={() =>
              setCurrentTicketPage((page) =>
                Math.min(page + 1, totalTicketPages),
              )
            }
            onSelectPage={setCurrentTicketPage}
          />
        </div>
      </div>

      <TicketDetailModal
        selectedTicket={selectedTicket}
        onClose={() => setSelectedTicketId(null)}
      />
    </div>
  );
};

export default ProfilePage;
