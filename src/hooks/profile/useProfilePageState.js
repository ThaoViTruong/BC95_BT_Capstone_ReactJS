import { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useToast } from "../../components/ToastProvider";
import { useProfile, useUpdateUser } from "../useUser";
import { login, selectorIsLoggedIn, selectorUser } from "../../store/authSlice";
import {
  PROFILE_TABS,
  TICKETS_PER_PAGE,
  buildProfileUpdatePayload,
  findTicketById,
  getApiMessage,
  getProfileFormInitialValues,
  getResetProfileFormValues,
  paginateItems,
  sortTicketsByLatest,
  userInfoSchema,
} from "../../utils/profile/profileUtils";

export const useProfilePageState = () => {
  const location = useLocation();
  const isLoggedIn = useSelector(selectorIsLoggedIn);
  const currentUser = useSelector(selectorUser);
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { data: profile, isLoading, isError } = useProfile(isLoggedIn);
  const updateUserMutation = useUpdateUser();
  const [activeTab, setActiveTab] = useState(PROFILE_TABS.info);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [currentTicketPage, setCurrentTicketPage] = useState(1);

  useEffect(() => {
    const requestedTab = location.state?.activeTab;

    if (!requestedTab) {
      return;
    }

    const timeoutId = setTimeout(() => {
      if (
        requestedTab === PROFILE_TABS.tickets ||
        requestedTab === "history"
      ) {
        setActiveTab(PROFILE_TABS.tickets);
        setCurrentTicketPage(1);
        return;
      }

      if (requestedTab === PROFILE_TABS.info) {
        setActiveTab(PROFILE_TABS.info);
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [location.state]);

  const tickets = useMemo(
    () => sortTicketsByLatest(profile?.thongTinDatVe || []),
    [profile?.thongTinDatVe],
  );
  const ticketCount = tickets.length;
  const latestTicket = tickets[0] || null;
  const {
    totalPages: totalTicketPages,
    activePage: activeTicketPage,
    items: paginatedTickets,
  } = useMemo(
    () => paginateItems(tickets, currentTicketPage, TICKETS_PER_PAGE),
    [tickets, currentTicketPage],
  );
  const selectedTicket = useMemo(
    () => findTicketById(tickets, selectedTicketId),
    [selectedTicketId, tickets],
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getProfileFormInitialValues(profile, currentUser),
    validationSchema: userInfoSchema,
    onSubmit: async (values, { resetForm }) => {
      const { normalizedPassword, payload } = buildProfileUpdatePayload(
        values,
        profile,
        currentUser,
      );

      try {
        await updateUserMutation.mutateAsync(payload);

        dispatch(
          login({
            ...(currentUser || {}),
            ...payload,
            soDT: payload.soDt,
          }),
        );

        resetForm({
          values: getResetProfileFormValues(values),
        });
        showToast({
          type: "success",
          title: "Cập nhật thành công",
          message: normalizedPassword
            ? "Cập nhật thông tin và mật khẩu thành công."
            : "Cập nhật thông tin cá nhân thành công.",
        });
      } catch (error) {
        showToast({
          type: "error",
          title: "Cập nhật thất bại",
          message: getApiMessage(
            error.response?.data,
            "Không thể cập nhật thông tin. Vui lòng thử lại.",
          ),
        });
      }
    },
  });

  return {
    profile,
    isLoading,
    isError,
    activeTab,
    setActiveTab,
    selectedTicketId,
    setSelectedTicketId,
    currentTicketPage,
    setCurrentTicketPage,
    ticketCount,
    latestTicket,
    totalTicketPages,
    activeTicketPage,
    paginatedTickets,
    selectedTicket,
    formik,
    updateUserMutation,
  };
};
