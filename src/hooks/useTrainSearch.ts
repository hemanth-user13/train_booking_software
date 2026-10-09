import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../app/hooks'
import { searchSaved } from '../features/trains/trainsSlice'
import type { SearchQuery } from '../features/trains/trainTypes'

/** Saves the search (to prefill the form later) and opens the results page. */
export function useTrainSearch() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  return (query: SearchQuery) => {
    dispatch(searchSaved(query))
    navigate(`/customer/trains?${new URLSearchParams({ ...query }).toString()}`)
  }
}
