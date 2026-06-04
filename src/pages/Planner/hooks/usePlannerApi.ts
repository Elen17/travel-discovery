import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { getPlannerHistory, sendPlannerMessage } from '@/api/planner'
import type { ExplorationId, PlannerChatPayload } from '@/types/planner'

export const plannerQueryKeys = {
  history: (sessionToken: string | null) => ['planner', 'history', sessionToken] as const,
}

type UsePlannerHistoryOptions = {
  sessionToken: string | null
  enabled?: boolean
}

export const usePlannerHistory = ({ sessionToken, enabled = true }: UsePlannerHistoryOptions) =>
  useQuery({
    queryKey: plannerQueryKeys.history(sessionToken),
    queryFn: () => getPlannerHistory(sessionToken ?? undefined),
    enabled: enabled && Boolean(sessionToken),
    staleTime: 30_000,
  })

type SendMessageVariables = PlannerChatPayload & {
  onReply?: (reply: string) => void
}

export const usePlannerChat = (explorationId: ExplorationId) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (variables: SendMessageVariables) => {
      const { onReply: _onReply, ...payload } = variables
      return sendPlannerMessage({ ...payload, explorationId })
    },
    onSuccess: (data, variables) => {
      if (variables.sessionToken ?? data.sessionToken) {
        queryClient.invalidateQueries({
          queryKey: plannerQueryKeys.history(data.sessionToken),
        })
      }
      variables.onReply?.(data.reply)
    },
  })

  const sendMessage = useCallback(
    (payload: SendMessageVariables) => mutation.mutateAsync(payload),
    [mutation],
  )

  return {
    sendMessage,
    isSending: mutation.isPending,
    error: mutation.error,
    data: mutation.data,
  }
}
