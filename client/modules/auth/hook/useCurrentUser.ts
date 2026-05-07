import { useAuthStore } from "../store/auth.store"

export const useCurrentUser = () => {
    return useAuthStore(
        (state) => state.user
    )
}