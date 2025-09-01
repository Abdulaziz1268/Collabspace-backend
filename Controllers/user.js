export const profile = (req, res) => {
  res.json({ message: "welcome user", user: req.user })
}
