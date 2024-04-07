import { Routes, Route, BrowserRouter as Router } from "react-router-dom"
import React from "react";
import Dashboard from "./Screens/Dashboard";
import store from "../src/Store/AdminStore"
import { Provider } from "react-redux";
import AdminRegistration from "./Screens/AdminRegistration";
import AdminLogin from "./Screens/Adminlogin";
import AdminList from "./Screens/AdminList";
function App() {
  return (
    <div>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route Component={AdminRegistration} path="/adminreg">
            </Route>
            <Route Component={AdminLogin} path="/adminlogin">
            </Route>
            <Route Component={AdminList} path="/adminlist">
            </Route>
            <Route Component={Dashboard} path="/dashboard/*"></Route>
          </Routes>
        </Router>
      </Provider>
    </div>
  );
}
export default App;
