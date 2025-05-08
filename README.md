# 🗺️ GeoS — Geographical Book Search Engine

**GeoS** is an intelligent geographical search engine that lets users ask natural-language queries (e.g. _"fiction books about dogs"_) and discover example books from various genres — displayed both on an interactive map and as a detailed list.

Powered by GPT-4o and enriched with book metadata (title, author, publication year, Goodreads info), GeoS makes literary discovery visual, intuitive, and fun.

 <!--![GEOS Banner](https://your-image-link.com/banner.png) Optional banner -->

---

## ✨ Features

- 🔍 **Natural Language Book Search** via GPT-4o
- 🗺️ **Interactive Map** showcasing books from different locations
- 📚 **Detailed List View** with:
  - Title
  - Author
  - Year
  - Goodreads Rating
  - Goodreads Link
- 🔁 Dynamic response generation per query
- 🎯 Clean, fast UI built in React with TypeScript

---

## 🛠️ Tech Stack

| Frontend | Backend | AI |
|----------|---------|----|
| React (TypeScript) | Flask (Python) | ChatGPT-4o |


---

## 📷 Example Output

> **Query:** “fiction books about dogs”

**Results:**
- 📍 **Seattle, USA**
  - 📘 *The Art of Racing in the Rain* by Garth Stein (2008)  
    ⭐ Goodreads: [4.2](https://www.goodreads.com/book/show/The_Art_of_Racing_in_the_Rain)

- 📍 **Dublin, Ireland**
  - 📘 *Dog Stars* by Peter Heller (2012)  
    ⭐ Goodreads: [3.9](https://www.goodreads.com/book/show/13154853-the-dog-stars)

- 📍 **London, UK**
  - 📘 *Flush: A Biography* by Virginia Woolf (1933)  
    ⭐ Goodreads: [3.7](https://www.goodreads.com/book/show/2619.Flush)

_Results shown on both an interactive map and detailed list view._

---

## 🗺️ Roadmap

- [x] MVP: Natural language search for 3 countries + list results
- [x] Display book metadata in a list (title, author, year, rating, link)
- [x] Integrate ChatGPT-4o for intelligent parsing
- [ ] Display book metadata in a map
- [ ] Natural Language Search for 100+ countries 
- [ ] Filters to allow search by region or selected countries
- [ ] Improved interaction with ChatBot i.e. including suggested next steps
---

## 👤 Author

Built with ❤️ by [Lana Tymchyk]

- 💼 [LinkedIn](https://linkedin.com/in/tymchyk)

 <!--
## 🚀 Getting Started

### 🔧 Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/geos.git
cd geos

# Install frontend dependencies
cd frontend
npm install


# Install backend dependencies
cd ../backend
pip install -r requirements.txt
-->
