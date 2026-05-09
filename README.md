# 📈 Stock Portfolio Tracker - MERN Stack

A full-stack web application for tracking and managing your stock portfolio with virtual money. Perfect for learning and interviewing!

## 🎯 Features

- ✅ **User Authentication**: Register/Login with JWT
- ✅ **Search Stocks**: Real-time stock search functionality
- ✅ **Live Prices**: View current stock prices and charts
- ✅ **Buy/Sell Stocks**: Trade with virtual money
- ✅ **Portfolio Tracking**: Monitor your holdings and P&L
- ✅ **Watchlist**: Save favorite stocks
- ✅ **Transaction History**: Track all your trades
- ✅ **Analytics Dashboard**: Profit/Loss metrics
- ✅ **Stock Charts**: Visualize price trends

## 🛠 Tech Stack

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Chart.js** - Data visualization

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
stock-portfolio-app/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Portfolio.js
│   │   ├── Transaction.js
│   │   └── Watchlist.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── portfolioController.js
│   │   ├── stockController.js
│   │   └── watchlistController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── portfolioRoutes.js
│   │   ├── stockRoutes.js
│   │   └── watchlistRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── StockCard.jsx
│   │   │   ├── BuySellForm.jsx
│   │   │   └── StockChart.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── SearchStock.jsx
│   │   │   ├── Portfolio.jsx
│   │   │   ├── Watchlist.jsx
│   │   │   └── StockDetails.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── PortfolioContext.jsx
│   │   │   └── StockContext.jsx
│   │   ├── api/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB URI and JWT secret:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/stock-portfolio
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

5. Start the server:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm start
```

App will run on `http://localhost:3000`

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Portfolio
- `POST /api/portfolio/buy` - Buy stocks
- `POST /api/portfolio/sell` - Sell stocks
- `GET /api/portfolio` - Get portfolio holdings
- `GET /api/portfolio/transactions` - Get transaction history

### Stocks
- `GET /api/stocks/all` - Get all stocks
- `GET /api/stocks/search` - Search stocks
- `GET /api/stocks/:symbol` - Get stock details

### Watchlist
- `POST /api/watchlist/add` - Add to watchlist
- `GET /api/watchlist` - Get watchlist
- `POST /api/watchlist/remove` - Remove from watchlist

## 🎓 Key Features for Interviews

1. **Authentication & Authorization**
   - JWT token implementation
   - Protected routes
   - Password hashing with bcryptjs

2. **RESTful API Design**
   - Proper HTTP methods
   - Status codes
   - Error handling middleware

3. **Database Design**
   - Relational data modeling
   - Indexes for performance
   - Timestamps tracking

4. **State Management**
   - React Context API
   - Local storage for tokens
   - Error handling

5. **UI/UX**
   - Responsive design
   - User-friendly interface
   - Real-time updates

## 🔄 Future Enhancements

- [ ] Real-time stock prices (WebSocket)
- [ ] Advanced charts and indicators
- [ ] Portfolio analytics dashboard
- [ ] Stock news integration
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] Dark mode
- [ ] Mobile app (React Native)

## 📄 License

MIT License

## 🤝 Contributing

Feel free to fork and submit pull requests!

## 💡 Tips for Interview Preparation

1. Understand the complete flow of authentication
2. Know how to scale the application
3. Be ready to discuss database optimization
4. Explain your choice of technologies
5. Discuss potential security concerns
6. Be prepared for follow-up questions on APIs
