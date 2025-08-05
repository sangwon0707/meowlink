import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { LinkItem, FilterType } from '../types'

// 앱 상태 타입
interface AppState {
  links: LinkItem[]
  searchQuery: string
  selectedFilter: FilterType
  isDarkMode: boolean
  isLoading: boolean
  error: string | null
}

// 액션 타입
type AppAction =
  | { type: 'SET_LINKS'; payload: LinkItem[] }
  | { type: 'ADD_LINK'; payload: LinkItem }
  | { type: 'UPDATE_LINK'; payload: { id: number; updates: Partial<LinkItem> } }
  | { type: 'DELETE_LINK'; payload: number }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTER'; payload: FilterType }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }

// 초기 상태 - localStorage에서 다크모드 설정 불러오기
const getInitialDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false
  const stored = localStorage.getItem('meowlink-dark-mode')
  if (stored !== null) return JSON.parse(stored)
  // 시스템 다크모드 감지
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

const initialState: AppState = {
  links: [],
  searchQuery: '',
  selectedFilter: 'all',
  isDarkMode: getInitialDarkMode(),
  isLoading: false,
  error: null,
}

// 리듀서
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LINKS':
      return { ...state, links: action.payload }
    
    case 'ADD_LINK':
      return { ...state, links: [...state.links, action.payload] }
    
    case 'UPDATE_LINK':
      return {
        ...state,
        links: state.links.map(link =>
          link.id === action.payload.id
            ? { ...link, ...action.payload.updates }
            : link
        ),
      }
    
    case 'DELETE_LINK':
      return {
        ...state,
        links: state.links.filter(link => link.id !== action.payload),
      }
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload }
    
    case 'SET_FILTER':
      return { ...state, selectedFilter: action.payload }
    
    case 'TOGGLE_DARK_MODE':
      const newDarkMode = !state.isDarkMode
      // localStorage에 저장
      if (typeof window !== 'undefined') {
        localStorage.setItem('meowlink-dark-mode', JSON.stringify(newDarkMode))
      }
      return { ...state, isDarkMode: newDarkMode }
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    default:
      return state
  }
}

// 컨텍스트 타입
interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<AppAction>
}

// 컨텍스트 생성
const AppContext = createContext<AppContextType | undefined>(undefined)

// 프로바이더 컴포넌트
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

// 커스텀 훅
export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}