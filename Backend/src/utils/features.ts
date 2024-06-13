import mongoose from "mongoose";
export const connectDB = () => {
  mongoose
    .connect("mongodb://localhost:27017", {
      dbName: "Ecommerce",
    })
    .then((c) => console.log(`Db connected to ${c.connection.host}`))
    .catch((e)=>console.log(`Error in connecting with DB`));
};
