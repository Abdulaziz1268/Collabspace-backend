import User from "../Models/User.js"

export const profile = async (req, res) => {
  const response = await User.findById(req.user.id).select("-password")
  res.json({ message: "welcome user", user: response })
}
