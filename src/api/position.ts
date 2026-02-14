import request from '@/utils/request'
import type { ApiResponse } from '@/types/auth'
import type {
  PositionCreate,
  PositionUpdate,
  PositionListParams,
  Position,
  PaginatedResponse
} from '@/types/position'

const POSITION_PREFIX = '/positions'

export function listPositions(params?: PositionListParams): Promise<ApiResponse<PaginatedResponse<Position>>> {
  return request.get(POSITION_PREFIX, { params })
}

export function createPosition(data: PositionCreate): Promise<ApiResponse<Position>> {
  return request.post(POSITION_PREFIX, data)
}

export function getPosition(positionId: string): Promise<ApiResponse<Position>> {
  return request.get(`${POSITION_PREFIX}/${positionId}`)
}

export function updatePosition(positionId: string, data: PositionUpdate): Promise<ApiResponse<Position>> {
  return request.put(`${POSITION_PREFIX}/${positionId}`, data)
}

export function deletePosition(positionId: string): Promise<ApiResponse<null>> {
  return request.delete(`${POSITION_PREFIX}/${positionId}`)
}
