import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import {
  createPlannerPlan,
  getPlannerHistory,
  getPlannerPlans,
  sendPlannerMessageHybrid,
} from '@/api/planner'
import type { ExplorationId, PlannerChatPayload, PlannerPlanPayload } from '@/types/planner'

export const plannerQueryKeys = {
  history: (planId: string | null) => ['planner', 'history', planId] as const,
  plans: ['planner', 'plans'] as const,
}

type UsePlannerHistoryOptions = {
  planId: string | null
  enabled?: boolean
}

export const usePlannerHistory = ({ planId, enabled = true }: UsePlannerHistoryOptions) =>
  useQuery({
    queryKey: plannerQueryKeys.history(planId),
    queryFn: () => getPlannerHistory(planId as string),
    enabled: enabled && Boolean(planId),
    staleTime: 30_000,
  })

type UsePlannerPlansOptions = {
  enabled?: boolean
}

export const usePlannerPlans = ({ enabled = true }: UsePlannerPlansOptions = {}) =>
  useQuery({
    queryKey: plannerQueryKeys.plans,
    queryFn: getPlannerPlans,
    enabled,
    staleTime: 5 * 60_000,
  })

type SendMessageVariables = PlannerChatPayload & {
  onReply?: (reply: string) => void
}

export const usePlannerChat = (explorationId: ExplorationId) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ message, planId, role }: SendMessageVariables) =>
      sendPlannerMessageHybrid({ message, planId, role, explorationId }),
    onSuccess: (data, variables) => {
      if (variables.planId ?? data.planId) {
        queryClient.invalidateQueries({
          queryKey: plannerQueryKeys.history(data.planId),
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

export const useCreatePlannerPlan = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (payload: PlannerPlanPayload) => createPlannerPlan(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plannerQueryKeys.plans })
    },
  })

  const createPlan = useCallback(
    (payload: PlannerPlanPayload) => mutation.mutateAsync(payload),
    [mutation],
  )

  return {
    createPlan,
    isCreating: mutation.isPending,
    error: mutation.error,
  }
}
