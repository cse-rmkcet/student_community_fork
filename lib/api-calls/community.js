import { AxiosClient } from ".";

export const fetchCommunities = async () => {
  const { data } = await AxiosClient.get("/community/me");
  return data;
};
export const fetchPublicAndRestrictedCommunities = async () => {
  const { data } = await AxiosClient.get("/community");
  return data;
};

export const createCommunity = async (comm) => {
  const { data } = await AxiosClient.post("/community", comm);
  return data;
};

export const getCommunityInfo = async (communityId) => {
  const { data } = await AxiosClient.get(`/community/${communityId}`);
  return data;
};
export const updateCommunityRoles = async (options) => {
  const { data } = await AxiosClient.patch(`/community/manage/roles`, options);
  return data;
};

export const requestToJoinCommunity = async (communityId) => {
  const { data } = await AxiosClient.post(`/community/requests/${communityId}`);
  return data;
};

export const joinPublicCommunity = async (communityId) => {
  const { data } = await AxiosClient.post(
    `/community/join/public?communityId=${communityId}`
  );
  return data;
};

export const getPendingCommRequests = async (communityId) => {
  const { data } = await AxiosClient.get(`/community/requests/${communityId}`);
  return data;
};

export const communityActions = async ({ communityId, action }) => {
  const { data } = await AxiosClient.post(`/community/actions/${communityId}`, {
    action,
  });
  return data;
};

export const managePendingCommRequests = async (options) => {
  const { data } = await AxiosClient.patch(
    `/community/requests/${options.communityId}`,
    options
  );
  return data;
};

export const updateCommunityInfo = async (options) => {
  const { data } = await AxiosClient.patch(
    `/community/manage?institutionId=${options.institutionId}`,
    options
  );
  return data;
};

export const getCommInviteCode = async (id) => {
  const { data } = await AxiosClient.get(`/community/code/${id}`);
  return data;
};

export const joinCommunityWithCode = async (options) => {
  const { data } = await AxiosClient.post(`/community/join`, options);
  return data;
};
