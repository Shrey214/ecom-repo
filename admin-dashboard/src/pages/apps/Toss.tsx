import AdminSidebar from "../../components/AdminSidebar";

const Toss = () => {
  return (
    <div className="admin-container">
      {/*Sidebar*/}
      <AdminSidebar />
      {/*Main*/}
      <main className="dashboard"></main>
    </div>
  );
};

export default Toss;
