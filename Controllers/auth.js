import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

import User from "../Models/User.js"
import { createTransport } from "nodemailer"

dotenv.config()

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: "User not found!" })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ message: "Invalid Password!" })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    })
    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    })
  } catch (err) {
    res.status(401).json({ error: err.message })
  }
}

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." })
    }

    const existingUsername = await User.findOne({ username })
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken." })
    }

    const hashed = await bcrypt.hash(password, 10)
    const user = new User({
      username,
      email,
      password: hashed,
      imageUrl: req.file
        ? `/uploads/${req.file.filename}`
        : "/uploads/placeholder.jpg",
    })
    await user.save()
    res.json({ message: "User registered ✅" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const verificationCodes = new Map()

export const sendEmail = async (req, res) => {
  const { email } = req.body

  const userExist = await User.findOne({ email })
  if (userExist)
    return res.status(409).json({ message: "The email is already in use." })

  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = Date.now() + 5 * 60 * 1000

  verificationCodes.set(email, { code, expiresAt })

  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: "abdumh1268@gmail.com",
      pass: process.env.APP_PASSWORD,
    },
  })

  const mailOptions = {
    from: '"Collabspace"<no-reply@gmail.com',
    to: email,
    subject: `Your Code - ${code}`,
    html: `
        <h1>Hello</h1>
        <p style="font-size: 16px">Your code is: <strong>${code}</strong>. Use it to verify your email.</p>
        <p style="font-size: 16px">If you don't request this, simply ignore this message.</p>
        <p style="font-size: 16px">The Collabspace Team</p>
        `,
  }
  try {
    await transporter.sendMail(mailOptions)
    res.json({ message: "Verification code sent to email", status: "sent" })
  } catch (error) {
    res.status(500).json({ message: error.message, status: "not sent" })
  }
}

export const verifyEmail = (req, res) => {
  const { email, code } = req.body
  const record = verificationCodes.get(email)

  if (!record)
    return res.json({
      message: "No code found for this email",
      verified: false,
    })

  if (Date.now() > record.expiresAt) {
    verificationCodes.delete(email)
    return res.json({ message: "Code expired", verified: false })
  }

  if (code !== record.code)
    return res.json({ message: "Invalid Code", verified: false })

  verificationCodes.delete(email)
  res.json({ message: "Verified successfully", verified: true })
}
