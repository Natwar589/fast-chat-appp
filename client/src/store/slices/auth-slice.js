export const createAuthSlice = (set) => ({
    userInfo: undefined,
    setUserInfo: (userInfo) => set(() => ({ userInfo })),
    updateProfile: (profile) => set((state) => ({
      userInfo: {
        ...state.userInfo,
        ...profile,
      },
    })),
  });
  