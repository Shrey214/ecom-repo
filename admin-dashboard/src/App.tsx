import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loader from "./components/Loader";
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Products = lazy(() => import("./pages/Products"));
const Transaction = lazy(() => import("./pages/Transactions"));
const Customers = lazy(() => import("./pages/Customers"));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/product" element={<Products />} />
          <Route path="/admin/transaction" element={<Transaction />} />
          <Route path="/admin/customer" element={<Customers />} />

          {/*Charts*/}
          {/* <Route path="/admin/chart/bar" element={} /> */}
          {/* <Route path="/admin/chart/pie" element={} /> */}
          {/* <Route path="/admin/chart/line" element={} /> */}

          {/* Apps */}

          {/* <Route path="/admin/app/stopwatch" element={} /> */}
          {/* <Route path="/admin/app/coupon" element={} /> */}
          {/* <Route path="/admin/app/toss" element={} /> */}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
