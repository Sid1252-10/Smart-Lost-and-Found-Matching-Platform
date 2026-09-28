# 🏴‍☠️ Grand Line Lost Treasure Registry

> **"Even the greatest pirates lose their treasures. The Grand Line Lost Treasure Registry helps reunite owners with their lost belongings using smart matching and the spirit of One Piece."**

---

## 📖 Overview

**Grand Line Lost Treasure Registry** is a smart Lost & Found platform inspired by the **One Piece Universe**.

The platform allows users to report lost and found items and automatically discover potential matches using information such as:

- 🏷️ Item category
- 📝 Item name
- 📄 Description
- 📍 Location
- 🌳 Grove number
- 📅 Date
- 🎨 Colour
- 🔖 Unique marks
- 🖼️ Image

The project transforms a traditional Lost & Found system into an immersive pirate-themed experience where treasures and belongings can be registered and recovered across the Grand Line.

---

# 🎯 Problem Statement

### PS-08: Smart Lost and Found Matching Platform

When a large number of lost and found items are reported, manually comparing every report becomes difficult and time-consuming.

A user who loses an item may have to search through numerous found-item reports to determine whether their belongings have been recovered.

The **Grand Line Lost Treasure Registry** addresses this problem by automatically comparing Lost and Found reports and ranking potential matches based on multiple characteristics.

---

# 💡 Our Solution

The platform provides a centralized Lost & Found registry where users can:

1. 📝 Report a lost item.
2. 📦 Report a found item.
3. 🗄️ Store reports in a centralized Supabase database.
4. 👁️ Automatically compare Lost and Found reports.
5. ⚔️ Calculate a matching score.
6. 📊 Classify the match using confidence levels.
7. 🤝 Display potential matching items.

Instead of manually searching through every report, the **Observation Haki Matching Engine** helps identify reports that share similar characteristics.

---
# 🛠️ Tech Stack

## 🎨 Frontend

- ⚛️ **React** — Component-based user interface
- ⚡ **Vite** — Frontend development server and build tool
- 🟨 **JavaScript (ES6+)** — Application logic and matching engine
- 🎨 **CSS** — Styling and visual design

## 🗄️ Backend & Database

- 🔥 **Supabase** — Backend services and database integration
- 🐘 **PostgreSQL** — Persistent database for Lost & Found records
- 🔌 **Supabase JavaScript Client** — Communication between the React application and Supabase

## 🧠 Matching & Intelligence

- 👁️ **Observation Haki Matching Engine** — Custom Lost & Found matching system
- 🔤 **Jaccard Similarity** — Keyword similarity between reports
- 📍 **Location Scoring** — Grove-based location comparison
- 📅 **Time Scoring** — Date proximity comparison
- 🏷️ **Category Scoring** — Item category comparison
- 📊 **Weighted Scoring** — Combines multiple matching factors into a score out of 100

## 🔧 Development Tools

- 📦 **npm** — Dependency and package management
- 🔧 **Git** — Version control
- 🐙 **GitHub** — Source code hosting and collaboration
- 💻 **VS Code** — Development environment

# 🏝️ One Piece Theme Integration

## 📜 Story

The Grand Line is full of adventures, treasures, and unfortunately, lost belongings.

Whether it is:

- ⚔️ Zoro's lost sword
- 👒 Luffy's Straw Hat
- 🧭 A missing Log Pose
- 💰 A treasure chest full of Beli
- 🍎 A mysterious Devil Fruit

Pirates, merchants, and adventurers can register lost or found treasures and allow the system to discover possible matches.

---

## ⚓ Theme Elements

- 👁️ **Observation Haki Matching Engine**
- 🏝️ **Grand Line Island Locations**
- 🌳 **Grove-Based Location System**
- ☠️ **Pirate Crew Inspired Interface**
- 💰 **Treasure Registry**
- 🗺️ **Grand Line Navigation Theme**
- 🏴‍☠️ **One Piece Inspired UI**

---

# ✨ Features

## 📝 Lost Item Reporting

Users can create Lost Item reports containing:

- Item name
- Category
- Description
- Location
- Grove number
- Date
- Colour
- Unique marks
- Image

---

## 📦 Found Item Reporting

Users can register Found Items with similar information so that the matching engine can compare them against Lost Items.

---

## 👁️ Observation Haki Matching

The matching engine automatically compares Lost and Found reports using:

- 🏷️ Category
- 📍 Location
- 📅 Date
- 🔤 Keywords from title and description

Potential matches are ranked according to their calculated score.

---

## 🔎 Search & Discovery

Users can explore registered Lost and Found items and view their details.

---

## 🤝 Match Recommendations

After submitting a report, the system can identify potential opposite-type reports and present the strongest matches.

---

## 📊 Match Confidence

Potential matches are classified into different confidence levels:

| Score | Confidence |
|---:|---|
| **85+** | 🏴‍☠️ LEGENDARY |
| **70–84** | 🔥 HIGH |
| **50–69** | ⚡ MODERATE |
| **Below 50** | 🌊 LOW |

---

# 🧠 Observation Haki Matching Engine

The core matching system is inspired by **Observation Haki**.

Instead of relying on a single property, the system evaluates multiple characteristics of two reports and combines their scores into a final match score out of 100.

---

## ⚔️ Matching Factors

| Factor | Maximum Score |
|---|---:|
| 🏷️ Category | 35 |
| 🗺️ Location | 25 |
| 📅 Time | 15 |
| 🔤 Keywords | 25 |
| **Total** | **100** |

---

## 🏷️ Category Matching

The system compares the category of the Lost and Found reports.

An exact category match receives the maximum category score.

For example:

```text
Lost:  Electronics
Found: Electronics