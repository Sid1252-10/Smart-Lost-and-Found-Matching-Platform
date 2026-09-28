# 🏴‍☠️ Grand Line Lost Treasure Registry

> *"Even the greatest pirates lose their treasures. The Grand Line Lost Treasure Registry helps reunite owners with their lost belongings using AI-powered matching and the spirit of One Piece."*

## 📖 Overview

Grand Line Lost Treasure Registry is a smart Lost & Found platform inspired by the **One Piece Universe**. The platform allows users to report lost and found items, search records, and receive AI-powered match suggestions based on item details, location, date, and images.

The project transforms a traditional lost-and-found system into an immersive pirate experience where treasures, swords, Log Poses, and valuable belongings can be recovered across the Grand Line.

---

## 🎯 Problem Statement

**PS-08: Smart Lost and Found Matching Platform**

When many lost and found items are reported, manually comparing reports becomes difficult. This platform automatically compares lost and found reports and suggests potential matches to help users recover their belongings efficiently.

---

## 🏝️ One Piece Theme Integration

### Story

The Grand Line is full of adventures, treasures, and unfortunately, lost belongings.

Whether it is:

* ⚔️ Zoro's lost sword
* 👒 Luffy's Straw Hat
* 🧭 A missing Log Pose
* 💰 A treasure chest full of Beli
* 🍎 A mysterious Devil Fruit

Pirates, merchants, and adventurers can register lost or found treasures and let the system discover possible matches.

### Theme Elements

* Observation Haki Match Engine
* Grand Line Island Locations
* Den Den Mushi Notifications
* Pirate Crews and Treasure Registry
* Bounty-Based Reputation System
* One Piece Inspired UI and Visual Design

---

## ✨ Features

### Lost Item Reporting

* Create lost treasure reports
* Add title and description
* Select category
* Upload images
* Specify location and date

### Found Item Reporting

* Register found treasures
* Upload evidence images
* Add discovery location and date
* Categorize found items

### Smart Matching System

* Description similarity matching
* Category matching
* Location matching
* Date matching
* AI-generated match score

### Search & Discovery

* Search lost items
* Search found items
* Filter by category
* Filter by location
* View detailed item information

### Claims & Recovery

* Submit ownership claims
* Review potential matches
* Mark recovered items
* Maintain recovery history

---

## 🧠 AI Matching Engine

The platform calculates a match score using:

| Factor                 | Weight |
| ---------------------- | ------ |
| Category Match         | 25%    |
| Description Similarity | 40%    |
| Location Similarity    | 20%    |
| Date Similarity        | 15%    |

### Example

Lost Item:

* Straw Hat
* Sabaody Archipelago
* Red ribbon attached

Found Item:

* Straw Hat
* Sabaody Grove 41
* Yellow straw hat with red ribbon

Result:

Observation Haki Match Score: **92%**

---

## 🏗️ System Architecture

Frontend → Backend API → Database

AI Matching Service → Match Recommendation Engine

Image Upload Service → Storage

---

## 💻 Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Framer Motion

### Backend

* FastAPI

### Database

* MongoDB Atlas

### AI & Machine Learning

* Sentence Transformers
* Scikit-Learn
* Cosine Similarity Matching

### Storage

* Cloudinary / Firebase Storage

### Authentication

* Firebase Authentication

---

## 📂 Project Structure

```text
grand-line-lost-treasure-registry/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── assets/
│
├── backend/
│   ├── app/
│   ├── routes/
│   ├── models/
│   ├── services/
│   └── utils/
│
├── ai-engine/
│   ├── matching/
│   ├── embeddings/
│   └── scoring/
│
├── docs/
│
└── README.md
```

---

## 🚀 Future Enhancements

* Image-based object matching
* Crew verification system
* Real-time notifications
* Interactive Grand Line map
* Mobile application
* OCR for item identification
* Advanced AI ownership verification

---

## 👨‍💻 Team

Built for the One Piece Themed Hackathon.

*"A treasure lost on the Grand Line should never remain lost forever."*

---

## 📜 License

This project is developed for educational and hackathon purposes.

### ⚓ Set Sail. Recover Treasures. Become the Most Trusted Pirate on the Grand Line.
