module.exports = mongoose => {
    const Securities = mongoose.model(
      "securities",
      mongoose.Schema(
        {
          ticker: String,
          avgBuyPrice: Number,
          shares: Number
        }
      )
    );
    return Securities;
  };