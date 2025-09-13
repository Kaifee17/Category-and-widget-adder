import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addCategory,
  addWidget,
  removeWidget,
  toggleCategory,
} from "./store/dashboardSlice";

export default function App() {
  const categories = useSelector((s) => s.dashboard.categories);
  const dispatch = useDispatch();

  const [newCategoryName, setNewCategoryName] = useState("");
  const [search, setSearch] = useState("");
  const [addingTo, setAddingTo] = useState(null);
  const [widgetName, setWidgetName] = useState("");
  const [widgetText, setWidgetText] = useState("");

  // --- handlers ---
  const handleAddCategory = (e) => {
    e.preventDefault();
    const name = newCategoryName.trim();
    if (!name) return;
    dispatch(addCategory(name));
    setNewCategoryName("");
  };

  const openAddForm = (categoryId) => {
    setAddingTo(categoryId);
    setWidgetName("");
    setWidgetText("");
  };

  const handleAddWidget = (e, categoryId) => {
    e.preventDefault();
    if (!widgetName.trim()) return;
    dispatch(addWidget(categoryId, widgetName.trim(), widgetText.trim()));
    setAddingTo(null);
  };

  const results =
    search.trim().length > 0
      ? categories
          .flatMap((cat) =>
            cat.widgets.map((w) => ({
              ...w,
              categoryName: cat.name,
              categoryId: cat.id,
            }))
          )
          .filter(
            (w) =>
              w.name.toLowerCase().includes(search.toLowerCase()) ||
              w.text.toLowerCase().includes(search.toLowerCase())
          )
      : [];

  // --- UI ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition">
      {/* Navbar */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-center items-center">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
            📊 Dashboard Builder
          </h1>
        </div>
        <p className="text-center text-gray-500 dark:text-gray-400 pb-4 text-sm md:text-base">
          Build your perfect dashboard — add categories, create widgets, and
          organize your insights beautifully 
        </p>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="md:col-span-1 bg-white dark:bg-gray-900 rounded-2xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
            📂 Categories
          </h2>

          {/* FIXED: stacked input + button */}
          <form onSubmit={handleAddCategory} className="mb-6 space-y-3">
            <input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New category..."
              className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
            />
            <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition">
              + Add Category
            </button>
          </form>

          <ul className="space-y-3">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cat.enabled}
                    onChange={() => dispatch(toggleCategory(cat.id))}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    {cat.name}
                    <span className="ml-1 text-xs text-gray-400">
                      ({cat.widgets.length})
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </aside>

        {/* Widgets area */}
        <section className="md:col-span-3 space-y-6">
          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="🔍 Search widgets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:ring focus:ring-blue-200 shadow-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
            />
            {search && (
              <div className="mt-4 bg-white dark:bg-gray-900 rounded-xl shadow p-4">
                <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Results ({results.length})
                </h3>
                {results.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No matches found.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {results.map((r) => (
                      <li
                        key={r.id}
                        className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                      >
                        <div className="font-medium text-gray-800 dark:text-gray-100">
                          {r.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {r.text}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Category: {r.categoryName}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Category widgets */}
          {categories
            .filter((c) => c.enabled)
            .map((cat) => (
              <div
                key={cat.id}
                className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {cat.name}
                  </h3>
                  <button
                    onClick={() => openAddForm(cat.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-sm transition"
                  >
                    + Add Widget
                  </button>
                </div>

                {addingTo === cat.id && (
                  <form
                    onSubmit={(e) => handleAddWidget(e, cat.id)}
                    className="mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 grid grid-cols-2 gap-3 border dark:border-gray-700"
                  >
                    <input
                      value={widgetName}
                      onChange={(e) => setWidgetName(e.target.value)}
                      placeholder="Widget name"
                      className="px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    />
                    <input
                      value={widgetText}
                      onChange={(e) => setWidgetText(e.target.value)}
                      placeholder="Widget description"
                      className="px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    />
                    <div className="col-span-2 flex gap-2">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition">
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setAddingTo(null)}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                  {cat.widgets.length === 0 && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      No widgets in this category.
                    </div>
                  )}
                  {cat.widgets.map((w) => (
                    <div
                      key={w.id}
                      className="p-4 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm hover:shadow-md transition relative"
                    >
                      <button
                        onClick={() =>
                          dispatch(
                            removeWidget({ categoryId: cat.id, widgetId: w.id })
                          )
                        }
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
                      >
                        ✕
                      </button>
                      <div className="font-semibold text-gray-800 dark:text-gray-100">
                        {w.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {w.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </section>
      </main>
    </div>
  );
}
