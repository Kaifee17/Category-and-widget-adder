import { configureStore } from '@reduxjs/toolkit'
import dashboardReducer from './dashboardSlice'

const LOCAL_KEY = 'dashboard_state_v1'

// load categories array from localStorage; return undefined if none
function loadState() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (!raw) return undefined
    const categories = JSON.parse(raw)
    return { dashboard: { categories } }
  } catch (e) {
    return undefined
  }
}

function saveState(state) {
  try {
    // only persist categories to keep localStorage small
    localStorage.setItem(LOCAL_KEY, JSON.stringify(state.dashboard.categories))
  } catch (e) {
    // ignore write errors
  }
}

const preloadedState = loadState()

const store = configureStore({
  reducer: { dashboard: dashboardReducer },
  preloadedState,
})

// subscribe to save
store.subscribe(() => {
  saveState(store.getState())
})

export default store
