import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

import Dashboard from "./pages/Dashboard";
import BirthTable from "./pages/births/TableBirth";
import CreateBirth from "./pages/births/CreateBirth";
import ValidateBirth from "./pages/births/ValidateBirth";
import SearchBirth from "./pages/births/SearchBirth";
import PrintBirth from "./pages/births/PrintBirth";
import EditBirth from "./pages/births/EditBirth";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* Routes du dashboard */}
        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        <Route
          element={<DashboardLayout />}
        >

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/births/create"
            element={<CreateBirth />}
          />

          <Route
            path="/births/validate"
            element={<ValidateBirth />}
          />

          <Route
            path="/births/search"
            element={<SearchBirth />}
          />

          <Route
            path="/births/print"
            element={<PrintBirth />}
          />

          <Route
            path="/tout"
            element={<BirthTable />}
          />

          <Route
            path="/births/:id/edit"
            element={<EditBirth />}
          />

        </Route>
      </Routes>

    </BrowserRouter>
  );
}

export default App;