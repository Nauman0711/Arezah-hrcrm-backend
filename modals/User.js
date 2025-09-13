const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);
//mongoose.connect("mongodb+srv://zarmeenqureshieritheia_db_user:iQlWFyxiGswrqNmr@cluster0.mongodb.net/mycruddb");
