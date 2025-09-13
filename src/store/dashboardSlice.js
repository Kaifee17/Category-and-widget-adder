import { createSlice, nanoid } from '@reduxjs/toolkit'

const defaultState = {
  categories: [
    {
      id: 'cspm',
      name: 'CSPM Executive Dashboard',
      enabled: true,
      widgets: [
        { id: 'w1', name: 'Top Risk', text: 'Top risk issues summary' },
        { id: 'w2', name: 'Assets', text: 'Assets overview' },
      ],
    },
    {
      id: 'sec',
      name: 'Security Overview',
      enabled: true,
      widgets: [
        { id: 'w3', name: 'Incidents', text: 'Recent incidents' },
      ],
    },
  ],
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: defaultState,
  reducers: {
    addCategory: {
      reducer(state, action) {
        state.categories.push(action.payload)
      },
      prepare(name) {
        return {
          payload: { id: nanoid(), name, enabled: true, widgets: [] },
        }
      },
    },
    addWidget: {
      reducer(state, action) {
        const { categoryId, widget } = action.payload
        const cat = state.categories.find((c) => c.id === categoryId)
        if (cat) cat.widgets.push(widget)
      },
      prepare(categoryId, name, text) {
        return {
          payload: {
            categoryId,
            widget: { id: nanoid(), name, text },
          },
        }
      },
    },
    removeWidget(state, action) {
      const { categoryId, widgetId } = action.payload
      const cat = state.categories.find((c) => c.id === categoryId)
      if (cat) cat.widgets = cat.widgets.filter((w) => w.id !== widgetId)
    },
    toggleCategory(state, action) {
      const cat = state.categories.find((c) => c.id === action.payload)
      if (cat) cat.enabled = !cat.enabled
    },
    setCategories(state, action) {
      state.categories = action.payload
    },
  },
})

export const { addCategory, addWidget, removeWidget, toggleCategory, setCategories } =
  dashboardSlice.actions
export default dashboardSlice.reducer
