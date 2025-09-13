import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FcOpenedFolder } from "react-icons/fc";
import { RxDashboard } from "react-icons/rx";
import { IoAddOutline } from "react-icons/io5";
import { ImSearch } from "react-icons/im";
import { RxCross1 } from "react-icons/rx";

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
  const [timeFilter, setTimeFilter] = useState("all");

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
    dispatch(
      addWidget(categoryId, widgetName.trim(), widgetText.trim(), Date.now())
    );
    setAddingTo(null);
  };

  const filterByTime = (widgets) => {
    if (timeFilter === "all") return widgets;
    const now = Date.now();
    const cutoff =
      timeFilter === "2d"
        ? now - 2 * 24 * 60 * 60 * 1000
        : timeFilter === "7d"
        ? now - 7 * 24 * 60 * 60 * 1000
        : null;
    return cutoff ? widgets.filter((w) => w.createdAt >= cutoff) : widgets;
  };

  const results =
    search.trim().length > 0
      ? categories
          .flatMap((cat) =>
            filterByTime(cat.widgets).map((w) => ({
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-900 dark:to-gray-950 transition">
      {/* Navbar */}
      <header className="bg-blue-400 dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-center relative items-center">
          {/* Centered title */}
          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl md:text-3xl font-bold font-serif bg-white bg-clip-text text-transparent flex items-center gap-2">
            <span className="text-white dark:text-blue-400">
              <RxDashboard />
            </span>
            Dashboard Builder
          </h1>

          {/* Filter by time on the right */}
          <div className="ml-auto flex items-center gap-2">
            <label className="text-xl  font-serif text-white dark:text-gray-300">
              Filter:
            </label>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-1 border rounded-lg dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="all">All</option>
              <option value="2d">Last 2 Days</option>
              <option value="7d">Last 7 Days</option>
            </select>
          </div>
        </div>

        <p className="text-center font-lato text-gray-100 dark:text-gray-400 pb-4 text-sm md:text-base">
          Build your perfect dashboard — add categories, create widgets, and
          organize your insights beautifully
        </p>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="md:col-span-1 bg-blue-300 dark:bg-gray-900 rounded-2xl shadow p-5">
          <h2 className="flex font-serif items-center gap-2 text-lg font-semibold mb-4 text-gray-100 dark:text-gray-200">
            <FcOpenedFolder className="text-2xl" />
            Categories
          </h2>

          {/* Input + Button stacked */}
          <form onSubmit={handleAddCategory} className="mb-6 space-y-3">
            <input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New category..."
              className="w-full font-inter px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
            />
            <button className="w-full font-lato flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition">
              <IoAddOutline className="text-lg" />
              Add Category
            </button>
          </form>

          <ul className="space-y-3">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <label className="flex font-serif items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cat.enabled}
                    onChange={() => dispatch(toggleCategory(cat.id))}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="font-medium text-white dark:text-gray-200">
                    {cat.name}
                    <span className="ml-1 text-xs text-white">
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
            <div className="relative w-full">
          <ImSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
           type="text"
           placeholder="Search widgets..."
           value={search}
           onChange={(e) => setSearch(e.target.value)}
           className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring focus:ring-blue-200 shadow-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                  />
          </div>


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
                  <h3 className="text-lg font-semibold font-serif text-gray-800 dark:text-gray-200">
                    {cat.name}
                  </h3>
                  <button
                    onClick={() => openAddForm(cat.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-sm transitio font-lato"
                  >
                    + Add Widget
                  </button>
                </div>

                {addingTo === cat.id && (
                  <form
                    onSubmit={(e) => handleAddWidget(e, cat.id)}
                    className="mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 grid grid-cols-2 gap-3 border dark:border-gray-70 font-lato"
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
                  {filterByTime(cat.widgets).length === 0 && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      No widgets in this category.
                    </div>
                  )}
                  {filterByTime(cat.widgets).map((w) => (
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
                        <RxCross1 />

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
