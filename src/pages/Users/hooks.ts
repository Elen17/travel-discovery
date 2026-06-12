import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createUser, deleteUser, getUserList, updateUser } from '@/api/users'
import { useAppDispatch } from '@/store/hooks'
import { addUser, removeUser, replaceUser } from '@/store/usersSlice'
import type { CreateUserPayload, User } from '@/types/user'

export const usersQueryKeys = {
  list: ['users', 'list'] as const,
}

export const useUserList = () =>
  useQuery({
    queryKey: usersQueryKeys.list,
    queryFn: getUserList,
  })

export const useUserMutations = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: (user) => {
      dispatch(addUser(user))
      void queryClient.invalidateQueries({ queryKey: usersQueryKeys.list })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<User> }) =>
      updateUser(id, payload),
    onSuccess: (user) => {
      dispatch(replaceUser(user))
      void queryClient.invalidateQueries({ queryKey: usersQueryKeys.list })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: (_, id) => {
      dispatch(removeUser(id))
      void queryClient.invalidateQueries({ queryKey: usersQueryKeys.list })
    },
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  }
}
